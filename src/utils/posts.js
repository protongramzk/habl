// src/utils/posts.js
import { supabase } from "./supabase";
import { user } from "./auth";
import { deleteFromPosts } from "./storageHelper";

export async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getCommentCount(postId) {
  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) throw error;
  return count;
}

// 🔥 upload multiple files
export async function uploadPost({ caption, files, group_id = null }) {
  const currentUser = user();

  if (!currentUser) {
    throw new Error("Harus login dulu 😤");
  }

  const uploadedUrls = [];

  for (const file of files) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${currentUser.id}/${Date.now()}-${Math.random()}.${fileExt}`;

    // upload ke bucket "posts"
    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // ambil public URL
    const { data } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    uploadedUrls.push(data.publicUrl);
  }

  // insert ke database
  const { error: insertError } = await supabase.from("posts").insert({
    account_id: currentUser.id,
    caption,
    media: uploadedUrls,
    group_id,
  });

  if (insertError) throw insertError;
}

/**
 * Delete post dan semua associated data (comments, reactions)
 * @param {string} postId - Post UUID
 * @param {string} userId - Current user ID (untuk ownership check)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deletePost(postId, userId) {
  try {
    // 1. Get post first (untuk check ownership & media)
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("id, account_id, media")
      .eq("id", postId)
      .single();

    if (fetchError) {
      throw new Error("Post tidak ditemukan");
    }

    // 2. Check ownership
    if (post.account_id !== userId) {
      throw new Error("Anda hanya bisa menghapus post sendiri");
    }

    // 3. Delete associated media files from storage
    if (post.media && post.media.length > 0) {
      for (const mediaUrl of post.media) {
        try {
          await deleteFromPosts(mediaUrl);
        } catch (err) {
          console.error("Failed to delete media:", err);
          // Continue with deletion even if media delete fails
        }
      }
    }

    // 4. Delete post (CASCADE will delete comments & reactions)
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("account_id", userId);

    if (deleteError) {
      throw new Error(`Failed to delete post: ${deleteError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("[deletePost]", error);
    return {
      success: false,
      error: error.message || "Failed to delete post",
    };
  }
}

/**
 * Delete comment
 * @param {string} commentId - Comment UUID
 * @param {string} userId - Current user ID (untuk ownership check)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteComment(commentId, userId) {
  try {
    // 1. Get comment first (untuk check ownership)
    const { data: comment, error: fetchError } = await supabase
      .from("comments")
      .select("id, account_id")
      .eq("id", commentId)
      .single();

    if (fetchError) {
      throw new Error("Comment tidak ditemukan");
    }

    // 2. Check ownership
    if (comment.account_id !== userId) {
      throw new Error("Anda hanya bisa menghapus comment sendiri");
    }

    // 3. Delete comment
    const { error: deleteError } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("account_id", userId);

    if (deleteError) {
      throw new Error(`Failed to delete comment: ${deleteError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("[deleteComment]", error);
    return {
      success: false,
      error: error.message || "Failed to delete comment",
    };
  }
}

/**
 * Soft delete post (set caption to "[Deleted]" and clear media)
 * Optional if you prefer soft delete instead
 * @param {string} postId - Post UUID
 * @param {string} userId - Current user ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function softDeletePost(postId, userId) {
  try {
    const { error } = await supabase
      .from("posts")
      .update({
        caption: "[Deleted]",
        media: [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("account_id", userId);

    if (error) {
      throw new Error(`Failed to delete post: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("[softDeletePost]", error);
    return {
      success: false,
      error: error.message || "Failed to delete post",
    };
  }
}

/**
 * Soft delete comment (set content to "[Deleted]")
 * Optional if you prefer soft delete instead
 * @param {string} commentId - Comment UUID
 * @param {string} userId - Current user ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function softDeleteComment(commentId, userId) {
  try {
    const { error } = await supabase
      .from("comments")
      .update({
        content: "[Deleted]",
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId)
      .eq("account_id", userId);

    if (error) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("[softDeleteComment]", error);
    return {
      success: false,
      error: error.message || "Failed to delete comment",
    };
  }
}
