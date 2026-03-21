import { createSignal, onMount, Show, For, createMemo } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { Heart, MessageCircle, Share2, Edit3, Trash2, MoreVertical } from "lucide-solid";
import {
  getReactionCount,
  toggleReaction,
  hasReacted,
} from "../utils/reaction";
import { getCommentCount, deletePost } from "../utils/posts";
import { user } from "../utils/auth";
import MenuBar from "./MenuBar";
import Button from "./Button";

export default function PostCard(props) {
  const navigate = useNavigate();
  const post = props.post;

  // Author data might be pre-joined (author) or not (account_id)
  const author = () => post.author || { id: post.account_id, username: 'anon', pp_url: '/default.png' };

  const [reactionCount, setReactionCount] = createSignal(0);
  const [commentCount, setCommentCount] = createSignal(0);
  const [liked, setLiked] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [deleting, setDeleting] = createSignal(false);

  onMount(async () => {
    try {
      const [reactCount, commCount, likedState] = await Promise.all([
        getReactionCount(post.id),
        getCommentCount(post.id),
        hasReacted(post.id),
      ]);

      setReactionCount(reactCount || 0);
      setCommentCount(commCount || 0);
      setLiked(likedState);
    } catch (err) {
      console.error("Failed to load post interaction data:", err);
    } finally {
      setLoading(false);
    }
  });

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user()) {
      alert("Login dulu 😑");
      return;
    }

    const previousLiked = liked();
    const previousCount = reactionCount();

    // Optimistic UI
    setLiked(!previousLiked);
    setReactionCount(prev => previousLiked ? Math.max(0, prev - 1) : prev + 1);

    try {
      const state = await toggleReaction(post.id);
      setLiked(state);
      // Optional: re-fetch count to ensure accuracy
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
      // Revert on error
      setLiked(previousLiked);
      setReactionCount(previousCount);
    }
  };

  const handleComment = (e) => {
    e.stopPropagation();
    navigate(`/p/${post.id}`);
  };

  const handleEdit = () => {
    navigate(`/p/edit/${post.id}`);
  };

  const handleDelete = async () => {
    const confirmed = confirm("Hapus post ini? Ini tidak bisa dibatalkan.");
    if (!confirmed) return;

    setDeleting(true);
    try {
      const result = await deletePost(post.id, user().id);
      if (result.success) {
        if (props.onDeleted) {
          props.onDeleted(post.id);
        } else {
           navigate("/");
        }
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Gagal menghapus post");
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/p/${post.id}`;
      await navigator.clipboard.writeText(url);
      alert("Link disalin 🔗");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const isOwner = () => user() && user().id === post.account_id;

  const menuItems = () => [
    {
      label: "Edit",
      icon: <Edit3 size={16} />,
      action: handleEdit,
    },
    {
      divider: true,
    },
    {
      label: "Hapus",
      icon: <Trash2 size={16} />,
      action: handleDelete,
      variant: "destructive",
    },
  ];

  return (
    <article
      class="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 shadow-sm overflow-hidden transition-all duration-300 hover:border-zinc-700 cursor-pointer"
      onClick={() => navigate(`/p/${post.id}`)}
    >
      <Show when={deleting()}>
        <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div class="flex items-center gap-2 text-zinc-400">
             <div class="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
             <span class="text-sm font-medium">Menghapus...</span>
          </div>
        </div>
      </Show>

      {/* Card Header */}
      <div class="flex items-center gap-3 p-4">
        <A
          href={`/u/${author().username || 'anon'}`}
          class="flex-shrink-0 relative group/avatar"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={author().pp_url || "/default.png"}
            alt={author().username || "User"}
            class="h-10 w-10 rounded-full border border-zinc-700 object-cover bg-zinc-800 transition-transform group-hover/avatar:scale-105"
          />
          <div class="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
        </A>

        <div class="flex-1 min-w-0">
          <A
            href={`/u/${author().username || 'anon'}`}
            class="text-[15px] font-bold text-zinc-50 hover:text-pink-500 transition-colors leading-tight truncate block"
            onClick={(e) => e.stopPropagation()}
          >
            @{author().username || "anon"}
          </A>
          <p class="text-[11px] text-zinc-500 mt-0.5 font-semibold uppercase tracking-wider">
            {new Date(post.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>

        <Show when={isOwner()}>
          <div onClick={(e) => e.stopPropagation()}>
            <MenuBar
              items={menuItems()}
              trigger={(open) => (
                <button
                  onClick={open}
                  class="p-2 -mr-2 text-zinc-500 hover:text-zinc-50 hover:bg-zinc-800/50 rounded-full transition-all"
                >
                  <MoreVertical size={18} />
                </button>
              )}
            />
          </div>
        </Show>
      </div>

      {/* Content */}
      <div class="px-4 pb-3 space-y-3">
        <Show when={post.caption}>
          <p class="text-[15px] leading-[1.6] text-zinc-200 font-normal break-words">
            {post.caption}
          </p>
        </Show>

        <Show when={post.media?.length > 0}>
          <div
            class={`grid gap-2 overflow-hidden rounded-lg border border-zinc-800/50 ${
              post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            <For each={post.media.slice(0, 4)}>
              {(url) => (
                <div class="aspect-square bg-zinc-800/50 overflow-hidden relative group/image">
                  <img
                    src={url}
                    alt="Post media"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-black/5 opacity-0 group-hover/image:opacity-100 transition-opacity" />
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* Actions */}
      <div class="flex items-center gap-6 px-4 py-3 border-t border-zinc-800/30">
        <button
          class={`flex items-center gap-2 text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
            liked() ? "text-pink-500" : "text-zinc-400 hover:text-pink-500"
          }`}
          onClick={handleLike}
          disabled={loading()}
        >
          <div class={`p-2 rounded-full transition-colors ${liked() ? 'bg-pink-500/10' : 'group-hover:bg-pink-500/5'}`}>
            <Heart
              size={20}
              fill={liked() ? "currentColor" : "none"}
              stroke-width={liked() ? 2.5 : 2}
            />
          </div>
          <span class="tabular-nums">{reactionCount()}</span>
        </button>

        <button
          class="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white transition-all hover:scale-105 active:scale-95 group/comm"
          onClick={handleComment}
          disabled={loading()}
        >
          <div class="p-2 rounded-full group-hover/comm:bg-white/5 transition-colors">
            <MessageCircle size={20} stroke-width={2} />
          </div>
          <span class="tabular-nums">{commentCount()}</span>
        </button>

        <button
          class="ml-auto p-2 text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-90"
          onClick={handleShare}
          title="Share"
        >
          <Share2 size={18} stroke-width={2} />
        </button>
      </div>
    </article>
  );
}
