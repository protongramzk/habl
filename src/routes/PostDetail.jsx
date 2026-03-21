import { useParams } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";

import PostCard from "../components/PostCard";
import Comments from "../components/Comments";
import { getPostById } from "../utils/posts";

export default function PostDetail() {
  const params = useParams();
  const [post, setPost] = createSignal(null);
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    try {
      const data = await getPostById(params.postId);
      setPost(data);
    } catch (err) {
      console.error("Failed to fetch post detail:", err);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="bg-black min-h-screen text-white pb-24">
      <div class="max-w-xl mx-auto p-4 space-y-6">
        <Show
          when={!loading()}
          fallback={<div class="h-64 bg-zinc-900/50 animate-pulse rounded-xl border border-zinc-800" />}
        >
          <Show when={post()} fallback={<p class="text-center py-10 text-zinc-500">Post tidak ditemukan 🕵️‍♂️</p>}>
            <PostCard post={post()} />
            <div class="pt-2">
              <Comments postId={params.postId} />
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}
