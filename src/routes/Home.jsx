import { createSignal, onMount, For, Show } from "solid-js";
import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import { getPosts } from "../utils/posts";

export default function Home() {
  const [posts, setPosts] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    await fetchFeed();
  });

  async function fetchFeed() {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data || []);
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div class="bg-black min-h-screen text-white pb-24">
      <div class="max-w-xl mx-auto p-4 space-y-6">
        <header class="flex items-center justify-between mb-2">
          <h1 class="text-2xl font-bold font-heading">Home</h1>
          <div class="w-8 h-8 rounded-full bg-pink-600/20 flex items-center justify-center text-pink-500">
            🔥
          </div>
        </header>

        <Show when={loading()}>
          <div class="space-y-4">
            {[1, 2, 3].map(() => (
              <div class="h-64 bg-zinc-900/50 animate-pulse rounded-xl border border-zinc-800" />
            ))}
          </div>
        </Show>

        <Show when={!loading() && posts().length === 0}>
          <div class="text-center py-20">
            <p class="text-zinc-500 text-lg font-medium">Belum ada post 😶</p>
            <p class="text-zinc-600 text-sm mt-1">Jadilah yang pertama untuk berbagi!</p>
          </div>
        </Show>

        <div class="space-y-4">
          <For each={posts()}>
            {(post) => (
              <PostCard post={post} onDeleted={handleDeleted} />
            )}
          </For>
        </div>
      </div>

      <Navbar />
    </div>
  );
}
