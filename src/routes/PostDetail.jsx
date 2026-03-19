import { useParams } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

import PostCard from "../components/PostCard";
import Comments from "../components/Comments";
import { supabase } from "../utils/supabase";

export default function PostDetail() {
  const params = useParams();
  const [post, setPost] = createSignal(null);

  onMount(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", params.postId)
      .single();

    if (error) console.error(error);
    else setPost(data);
  });

  return (
    <div class="bg-black min-h-screen text-white pb-24">
      <div class="max-w-xl mx-auto p-4 space-y-4">
        {post() ? <PostCard post={post()} /> : <p>Loading...</p>}
        <Comments postId={params.postId} />
      </div>
    </div>
  );
}
