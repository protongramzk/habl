// src/utils/posts.js
import { supabase } from "./supabase";
import { user } from "./auth";
import { deleteFromPosts } from "./storageHelper";

/**
 * Fetch all posts with author details
 * @param {Object} options - Filter options
 * @returns {Promise<Array>}
 */
export async function getPosts({ groupId = null, accountId = null, limit = 20 } = {}) {
  let query = supabase
    .from("posts")
    .select(`
      *,
      author:accounts (*)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (groupId) query = query.eq("group_id", groupId);
  if (accountId) query = query.eq("account_id", accountId);

  const { data, error } = await query;

  if (error) {
    console.error("[getPosts] Error:", error);
    throw error;
  }
  return data;
}

/**
 * Fetch a single post by ID with author details
 * @param {string} postId
 * @returns {Promise<Object>}
 */
export async function getPostById(postId) {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:accounts (*)
    `)
    .eq("id", postId)
    .single();

  if (error) {
    console.error("[getPostById] Error:", error);
    throw error;
  }
  return data;
}

/**
 * Get comment count for a post
 * @param {string} postId
 * @returns {Promise<number>}
 */
export async function getCommentCount(postId) {
  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) {
    console.error("[getCommentCount] Error:", error);
    throw error;
  }
  return count || 0;
}

/**
 * Upload a new post
 * @param {Object} params - { caption, files, group_id }
 */
export async function uploadPost({ caption, files, group_id = null }) {
  const currentUser = user();

  if (!currentUser) {
    throw new Error("Harus login dulu 😤");
  }

  const uploadedUrls = [];

  if (files && files.length > 0) {
    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("posts")
        .getPublicUrl(fileName);

      uploadedUrls.push(data.publicUrl);
    }
  }

  const { error: insertError } = await supabase.from("posts").insert({
    account_id: currentUser.id,
    caption,
    media: uploadedUrls,
    group_id,
  });

  if (insertError) {
    console.error("[uploadPost] Error:", insertError);
    throw insertError;
  }
}

/**
 * Delete a post and its media
 * @param {string} postId
 * @param {string} userId
 */
export async function deletePost(postId, userId) {
  try {
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("id, account_id, media")
      .eq("id", postId)
      .single();

    if (fetchError) throw new Error("Post tidak ditemukan");
    if (post.account_id !== userId) throw new Error("Bukan pemilik post");

    if (post.media && post.media.length > 0) {
      for (const mediaUrl of post.media) {
        try {
          await deleteFromPosts(mediaUrl);
        } catch (err) {
          console.error("Failed to delete media:", err);
        }
      }
    }

    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (error) {
    console.error("[deletePost] Error:", error);
    return { success: false, error: error.message };
  }
}
