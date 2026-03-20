// src/utils/reaction.js
import { supabase } from "./supabase";
import { user } from "./auth";

/**
 * Get reaction count for a post
 * @param {string} postId
 * @returns {Promise<number>}
 */
export async function getReactionCount(postId) {
  const { count, error } = await supabase
    .from("reactions")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) {
    console.error("[getReactionCount] Error:", error);
    throw error;
  }
  return count || 0;
}

/**
 * Check if the current user has reacted to a post
 * @param {string} postId
 * @returns {Promise<boolean>}
 */
export async function hasReacted(postId) {
  const currentUser = user();
  if (!currentUser) return false;

  const { data, error } = await supabase
    .from("reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("account_id", currentUser.id)
    .maybeSingle();

  if (error) {
    console.error("[hasReacted] Error:", error);
    return false;
  }

  return !!data;
}

/**
 * Toggle reaction on a post
 * @param {string} postId
 * @returns {Promise<boolean>} - New reaction state (true: reacted, false: not reacted)
 */
export async function toggleReaction(postId) {
  const currentUser = user();
  if (!currentUser) throw new Error("Login dulu 😑");

  const { data, error } = await supabase
    .from("reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("account_id", currentUser.id)
    .maybeSingle();

  if (error) {
    console.error("[toggleReaction] Fetch Error:", error);
    throw error;
  }

  if (data) {
    const { error: deleteError } = await supabase
      .from("reactions")
      .delete()
      .eq("id", data.id);

    if (deleteError) {
      console.error("[toggleReaction] Delete Error:", deleteError);
      throw deleteError;
    }
    return false;
  } else {
    const { error: insertError } = await supabase.from("reactions").insert({
      post_id: postId,
      account_id: currentUser.id,
      reaction: "love", // Default reaction for now
    });

    if (insertError) {
      console.error("[toggleReaction] Insert Error:", insertError);
      throw insertError;
    }
    return true;
  }
}
