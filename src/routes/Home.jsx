// src/routes/Home.jsx
import { createSignal, onMount } from "solid-js";

import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";

import { supabase } from "../utils/supabase";
import { user } from "../utils/auth";

export default function Home() {
  const [posts, setPosts] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    await fetchFeed();
  });

  // 🔥 algoritma feed sederhana
  async function fetchFeed() {
    setLoading(true);

    let query = supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    // kalau login → bisa nanti filter by following
    if (user()) {
      // versi simple dulu (global feed + nanti bisa di-upgrade)
      // contoh future:
      // filter berdasarkan followers / group membership
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
    } else {
      setPosts(data);
    }

    setLoading(false);
  }

  return (
    <div class="bg-black min-h-screen text-white pb-24">
      <div class="max-w-xl mx-auto p-4 space-y-4">
        <h1 class="text-lg font-semibold">Home 🔥</h1>

        {loading() && <p class="text-zinc-500">Loading...</p>}

        {!loading() && posts().length === 0 && (
          <p class="text-zinc-500">Belum ada post 😶</p>
        )}

        {posts().map((post) => (
          <PostCard post={post} />
        ))}
      </div>

      {/* 🔻 floating navbar */}
      <Navbar />
    </div>
  );
}
