// src/utils/user.js
import { supabase } from "./supabase";

export async function getUserProfile(id) {
  const { data, error } = await supabase
    .from("accounts")
    .select("id, username, pp_url, bio, created_at")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProfileByUsername(username) {
  const { data, error } = await supabase
    .from("accounts")
    .select("id, username, pp_url, bio, created_at")
    .eq("username", username)
    .single();

  if (error) throw error;
  return data;
}

// Update profil: username, bio, atau upload foto
// Hanya update field yang berubah (ada diff)
export async function updateUserProfile(userId, { username, bio, ppFile }) {
  let ppUrl = null;

  // Upload foto ke storage jika ada file baru
  if (ppFile instanceof File) {
    const fileName = `${userId}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("profile_pictures")
      .upload(fileName, ppFile);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from("profile_pictures")
      .getPublicUrl(fileName);

    ppUrl = data.publicUrl;
  }

  // Build updates object - hanya include yang berubah
  const updates = {};
  if (username !== null) updates.username = username;
  if (bio !== null) updates.bio = bio;
  if (ppUrl !== null) updates.pp_url = ppUrl;

  // Jika tidak ada perubahan, return early
  if (Object.keys(updates).length === 0) {
    return;
  }

  const { error } = await supabase
    .from("accounts")
    .update(updates)
    .eq("id", userId);

  if (error) throw error;
}
