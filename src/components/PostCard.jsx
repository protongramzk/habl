// src/components/PostCard.jsx
import { createSignal, onMount, Show, For } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { Heart, MessageCircle, Share2, Edit3, Trash2, MoreVertical } from "lucide-solid";
import { getUserProfile } from "../utils/user";
import {
  getReactionCount,
  toggleReaction,
  hasReacted,
} from "../utils/reaction";
import { getCommentCount } from "../utils/posts";
import { deletePost } from "../utils/posts-delete";
import { user } from "../utils/auth";
import MenuBar from "./MenuBar";
import Button from "./Button";

export default function PostCard(props) {
  const navigate = useNavigate();
  const post = props.post;

  const [userProfile, setUserProfile] = createSignal(null);
  const [reactionCount, setReactionCount] = createSignal(0);
  const [commentCount, setCommentCount] = createSignal(0);
  const [liked, setLiked] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [deleting, setDeleting] = createSignal(false);

  onMount(async () => {
    try {
      const [userData, reactCount, commentCountData, likedState] =
        await Promise.all([
          getUserProfile(post.account_id),
          getReactionCount(post.id),
          getCommentCount(post.id),
          hasReacted(post.id),
        ]);

      setUserProfile(userData);
      setReactionCount(reactCount || 0);
      setCommentCount(commentCountData || 0);
      setLiked(likedState);
    } catch (err) {
      console.error("Failed to load post data:", err);
    } finally {
      setLoading(false);
    }
  });

  const handleLike = async () => {
    try {
      const state = await toggleReaction(post.id);
      setLiked(state);
      setReactionCount((prev) => prev + (state ? 1 : -1));
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
    }
  };

  const handleComment = () => {
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
        }
        navigate("/");
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

  const handleShare = async () => {
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
    <article class="rounded-lg border border-neutral-800 bg-neutral-900/50 shadow-sm overflow-hidden transition-all hover:border-neutral-700">
      {/* Card Header - Author Info */}
      <div class="flex items-center gap-3 p-4 border-b border-neutral-800">
        {/* Avatar - Clickable */}
        <Show
          when={!loading() && userProfile()}
          fallback={
            <div class="h-10 w-10 rounded-full bg-neutral-800 animate-pulse flex-shrink-0" />
          }
        >
          <A
            href={`/u/${userProfile()?.username}`}
            class="flex-shrink-0 hover:opacity-80 transition-opacity"
            title={`Visit ${userProfile()?.username}'s profile`}
          >
            <img
              src={userProfile()?.pp_url || "/default.png"}
              alt={userProfile()?.username || "User"}
              class="h-10 w-10 rounded-full border border-neutral-700 object-cover"
              loading="lazy"
            />
          </A>
        </Show>

        {/* Username & Date - Username clickable */}
        <div class="flex-1 min-w-0">
          <Show
            when={!loading() && userProfile()}
            fallback={
              <div class="space-y-1">
                <div class="h-4 bg-neutral-800 rounded w-24 animate-pulse" />
                <div class="h-3 bg-neutral-800 rounded w-16 animate-pulse" />
              </div>
            }
          >
            <A
              href={`/u/${userProfile()?.username}`}
              class="text-sm font-semibold text-neutral-50 hover:text-emerald-400 transition-colors leading-tight truncate block"
              title={`Visit @${userProfile()?.username}`}
            >
              @{userProfile()?.username || "anon"}
            </A>
            <p class="text-xs text-neutral-500 mt-0.5">
              {new Date(post.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </Show>
        </div>

        {/* Menu Button - Only for owner */}
        <Show when={isOwner() && !deleting()}>
          <MenuBar
            items={menuItems()}
            trigger={(open) => (
              <Button
                size="icon"
                variant="ghost"
                onClick={open}
                title="Post menu"
                ariaLabel="Post menu"
              >
                <MoreVertical size={16} />
              </Button>
            )}
          />
        </Show>

        {/* Deleting state */}
        <Show when={deleting()}>
          <div class="text-xs text-neutral-500">Deleting...</div>
        </Show>
      </div>

      {/* Card Content */}
      <div class="px-4 py-3 space-y-3">
        {/* Caption */}
        <Show when={post.caption}>
          <p class="text-sm leading-relaxed text-neutral-300 font-normal break-words">
            {post.caption}
          </p>
        </Show>

        {/* Media Grid */}
        <Show when={post.media?.length > 0}>
          <div
            class={`grid gap-1 overflow-hidden rounded-md border border-neutral-700 ${
              post.media.length === 1
                ? "grid-cols-1"
                : post.media.length === 2
                  ? "grid-cols-2"
                  : post.media.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2"
            }`}
          >
            <For each={post.media.slice(0, 4)}>
              {(url, idx) => (
                <div class="relative overflow-hidden bg-neutral-800 aspect-video cursor-pointer group">
                  <img
                    src={url}
                    alt={`Post image ${idx() + 1}`}
                    class="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    loading="lazy"
                    onClick={() => navigate(`/p/${post.id}`)}
                  />
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* Card Footer - Actions */}
      <div class="flex items-center gap-1 p-3 pt-2 border-t border-neutral-800">
        {/* Like Button */}
        <Button
          variant={liked() ? "primary" : "outline"}
          size="sm"
          onClick={handleLike}
          disabled={loading()}
          leftIcon={<Heart size={14} fill={liked() ? "currentColor" : "none"} stroke-width={2} />}
          title={liked() ? "Unlike" : "Like"}
          ariaLabel="Like"
        >
          <span class="tabular-nums text-xs">{reactionCount()}</span>
        </Button>

        {/* Comment Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleComment}
          disabled={loading()}
          leftIcon={<MessageCircle size={14} stroke-width={2} />}
          title="Comment"
          ariaLabel="Comment"
        >
          <span class="tabular-nums text-xs">{commentCount()}</span>
        </Button>

        {/* Share Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleShare}
          disabled={loading()}
          className="ml-auto"
          title="Share post"
          ariaLabel="Share"
        >
          <Share2 size={14} stroke-width={2} />
        </Button>
      </div>
    </article>
  );
}
