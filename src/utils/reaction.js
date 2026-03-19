// src/utils/reaction.js
import { supabase } from "./supabase";
import { user } from "./auth";

// 🔥 ambil jumlah reaction
export async function getReactionCount(postId) {
  const { count, error } = await supabase
    .from("reactions")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (error) throw error;
  return count;
}

// 🔥 cek user sudah react atau belum
export async function hasReacted(postId) {
  const currentUser = user();
  if (!currentUser) return false;

  const { data } = await supabase
    .from("reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("account_id", currentUser.id)
    .maybeSingle();

  return !!data;
}

// 🔥 toggle reaction
export async function toggleReaction(postId) {
  const currentUser = user();
  if (!currentUser) throw new Error("Login dulu 😑");

  const { data } = await supabase
    .from("reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("account_id", currentUser.id)
    .maybeSingle();

  if (data) {
    await supabase.from("reactions").delete().eq("id", data.id);
    return false;
  } else {
    await supabase.from("reactions").insert({
      post_id: postId,
      account_id: currentUser.id,
      reaction: "love",
    });
    return true;
  }
}
