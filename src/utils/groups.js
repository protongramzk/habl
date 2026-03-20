// src/utils/groups.js
import { supabase } from "./supabase";
import { user } from "./auth";

/**
 * Fetch all groups
 * @param {Object} options - Search or pagination options
 */
export async function getGroups(searchTerm = "") {
  let query = supabase.from("groups").select("*");
  if (searchTerm) query = query.ilike("name", `%${searchTerm}%`);

  const { data, error } = await query;
  if (error) {
    console.error("[getGroups] Error:", error);
    throw error;
  }
  return data;
}

/**
 * Fetch a single group by ID
 * @param {string} groupId
 */
export async function getGroupById(groupId) {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (error) {
    console.error("[getGroupById] Error:", error);
    throw error;
  }
  return data;
}

/**
 * Join a group
 * @param {string} groupId
 */
export async function joinGroup(groupId) {
  const currentUser = user();
  if (!currentUser) throw new Error("Login dulu 😑");

  const { error } = await supabase
    .from("group_members")
    .insert({
      group_id: groupId,
      account_id: currentUser.id,
      role: "member",
    });

  if (error) {
    console.error("[joinGroup] Error:", error);
    throw error;
  }
  return { success: true };
}

/**
 * Leave a group
 * @param {string} groupId
 */
export async function leaveGroup(groupId) {
  const currentUser = user();
  if (!currentUser) throw new Error("Login dulu 😑");

  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("account_id", currentUser.id);

  if (error) {
    console.error("[leaveGroup] Error:", error);
    throw error;
  }
  return { success: true };
}

/**
 * Check if the current user is a member of a group
 * @param {string} groupId
 */
export async function isGroupMember(groupId) {
  const currentUser = user();
  if (!currentUser) return false;

  const { data, error } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", groupId)
    .eq("account_id", currentUser.id)
    .maybeSingle();

  if (error) {
    console.error("[isGroupMember] Error:", error);
    return false;
  }
  return !!data;
}

/**
 * Create a new group
 * @param {Object} groupData - { name, description, coverFile }
 */
export async function createGroup({ name, description, coverFile }) {
  const currentUser = user();
  if (!currentUser) throw new Error("Harus login dulu 😤");

  let coverUrl = null;

  if (coverFile instanceof File) {
    const ext = coverFile.name.split(".").pop();
    const fileName = `groups/${currentUser.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("posts") // Reuse posts bucket or use a separate one if it exists
      .upload(fileName, coverFile);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    coverUrl = data.publicUrl;
  }

  const { data, error } = await supabase
    .from("groups")
    .insert({
      name,
      description,
      cover_url: coverUrl,
      owner_id: currentUser.id,
    })
    .select()
    .single();

  if (error) {
    console.error("[createGroup] Error:", error);
    throw error;
  }

  // Auto-join as admin/owner
  await joinGroup(data.id);
  await supabase.from("group_members").update({ role: "admin" }).eq("group_id", data.id).eq("account_id", currentUser.id);

  return data;
}
