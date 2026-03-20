// src/utils/comments.js
import { supabase } from "./supabase";
import { user } from "./auth";

/**
 * Fetch comments for a post
 * Includes author info and supports nested comments
 * @param {string} postId
 * @returns {Promise<Array>}
 */
export async function getComments(postId) {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      author:accounts (*)
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getComments] Error:", error);
    throw error;
  }
  return data;
}

/**
 * Add a new comment
 * @param {string} postId
 * @param {string} content
 * @param {string|null} parentId - For nested comments/replies
 */
export async function addComment(postId, content, parentId = null) {
  const currentUser = user();
  if (!currentUser) throw new Error("Harus login dulu 😤");

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      account_id: currentUser.id,
      content,
      parent_id: parentId,
    })
    .select()
    .single();

  if (error) {
    console.error("[addComment] Error:", error);
    throw error;
  }
  return data;
}

/**
 * Delete a comment
 * Only the author can delete their own comment
 * @param {string} commentId
 * @param {string} userId
 */
export async function deleteComment(commentId, userId) {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("account_id", userId);

  if (error) {
    console.error("[deleteComment] Error:", error);
    throw error;
  }
  return { success: true };
}
