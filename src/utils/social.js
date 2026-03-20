// src/utils/social.js
import { supabase } from "./supabase";
import { user } from "./auth";

/**
 * Follow a user
 * @param {string} followingId - ID of user to be followed
 */
export async function followUser(followingId) {
  const currentUser = user();
  if (!currentUser) throw new Error("Login dulu 😑");
  if (currentUser.id === followingId) throw new Error("Tak bisa follow diri sendiri 😂");

  const { error } = await supabase
    .from("followers")
    .insert({
      follower_id: currentUser.id,
      following_id: followingId,
    });

  if (error) {
    console.error("[followUser] Error:", error);
    throw error;
  }
  return { success: true };
}

/**
 * Unfollow a user
 * @param {string} followingId - ID of user to unfollow
 */
export async function unfollowUser(followingId) {
  const currentUser = user();
  if (!currentUser) throw new Error("Login dulu 😑");

  const { error } = await supabase
    .from("followers")
    .delete()
    .eq("follower_id", currentUser.id)
    .eq("following_id", followingId);

  if (error) {
    console.error("[unfollowUser] Error:", error);
    throw error;
  }
  return { success: true };
}

/**
 * Check if the current user is following another user
 * @param {string} followingId
 */
export async function isFollowing(followingId) {
  const currentUser = user();
  if (!currentUser) return false;

  const { data, error } = await supabase
    .from("followers")
    .select("id")
    .eq("follower_id", currentUser.id)
    .eq("following_id", followingId)
    .maybeSingle();

  if (error) {
    console.error("[isFollowing] Error:", error);
    return false;
  }
  return !!data;
}

/**
 * Get follower count for a user
 * @param {string} userId
 */
export async function getFollowerCount(userId) {
  const { count, error } = await supabase
    .from("followers")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId);

  if (error) {
    console.error("[getFollowerCount] Error:", error);
    throw error;
  }
  return count || 0;
}

/**
 * Get following count for a user
 * @param {string} userId
 */
export async function getFollowingCount(userId) {
  const { count, error } = await supabase
    .from("followers")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);

  if (error) {
    console.error("[getFollowingCount] Error:", error);
    throw error;
  }
  return count || 0;
}
