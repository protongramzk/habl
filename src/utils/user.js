// src/utils/user.js
import { supabase } from "./supabase";

/**
 * Fetch a single user profile by ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getUserProfile(id) {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[getUserProfile] Error:", error);
    throw error;
  }
  return data;
}

/**
 * Fetch a single user profile by username
 * @param {string} username
 * @returns {Promise<Object>}
 */
export async function getUserProfileByUsername(username) {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error("[getUserProfileByUsername] Error:", error);
    throw error;
  }
  return data;
}

/**
 * Update current user's profile
 * @param {string} userId
 * @param {Object} updates - { username, bio, ppFile }
 */
export async function updateUserProfile(userId, { username, bio, ppFile }) {
  let ppUrl = null;

  if (ppFile instanceof File) {
    const ext = ppFile.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("profile_pics")
      .upload(fileName, ppFile);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("profile_pics")
      .getPublicUrl(fileName);

    ppUrl = data.publicUrl;
  }

  const updatesObj = {};
  if (username !== undefined && username !== null) updatesObj.username = username;
  if (bio !== undefined && bio !== null) updatesObj.bio = bio;
  if (ppUrl !== null) updatesObj.pp_url = ppUrl;
  updatesObj.updated_at = new Date().toISOString();

  if (Object.keys(updatesObj).length === 0) return;

  const { error } = await supabase
    .from("accounts")
    .update(updatesObj)
    .eq("id", userId);

  if (error) {
    console.error("[updateUserProfile] Error:", error);
    throw error;
  }
}

/**
 * Search users by username
 * @param {string} searchTerm
 */
export async function searchUsers(searchTerm) {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .ilike("username", `%${searchTerm}%`)
    .limit(10);

  if (error) {
    console.error("[searchUsers] Error:", error);
    throw error;
  }
  return data;
}
