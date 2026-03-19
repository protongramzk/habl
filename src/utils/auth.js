// src/utils/auth.js
import { supabase } from "./supabase";
import { createSignal } from "solid-js";

// 🔥 reactive user state
const [user, setUser] = createSignal(null);

// ambil user saat init
export async function initAuth() {
  const { data } = await supabase.auth.getUser();
  setUser(data.user);

  // listen perubahan auth (login/logout)
  supabase.auth.onAuthStateChange((event, session) => {
    setUser(session?.user ?? null);
  });
}

// 🟢 REGISTER
export async function register({ email, password, username }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // optional: update username ke table accounts
  if (data.user) {
    await supabase.from("accounts").update({
      username
    }).eq("id", data.user.id);
  }

  return data;
}

// 🔵 LOGIN
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

// 🔴 LOGOUT
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// 📦 export user state
export { user };
