import { createSignal, onMount, Show, For } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { Heart, MessageCircle, Share2, Edit3, Trash2, MoreVertical } from "lucide-solid";
import { getUserProfile } from "../utils/user";
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

  const [userProfile, setUserProfile] = createSignal(post.author || null);
  const [reactionCount, setReactionCount] = createSignal(0);
  const [commentCount, setCommentCount] = createSignal(0);
  const [liked, setLiked] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [deleting, setDeleting] = createSignal(false);

  onMount(async () => {
    try {
      // If we don't have userProfile, fetch it
      if (!userProfile()) {
        getUserProfile(post.account_id).then(data => setUserProfile(data)).catch(() => {});
      }

      // Fetch stats in parallel, but handle individually to prevent total failure
      getReactionCount(post.id).then(count => setReactionCount(count || 0)).catch(() => {});
      getCommentCount(post.id).then(count => setCommentCount(count || 0)).catch(() => {});

      if (user()) {
        hasReacted(post.id).then(state => setLiked(state)).catch(() => {});
      }
    } catch (err) {
      console.error("Failed to load post data stats:", err);
    } finally {
      // Small delay to ensure some data is likely there, but don't hang
      setTimeout(() => setLoading(false), 500);
    }
  });

  const handleLike = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user()) return navigate("/login");

    try {
      const state = await toggleReaction(post.id);
      setLiked(state);
      setReactionCount((prev) => prev + (state ? 1 : -1));
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
    }
  };

  const handleComment = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigate(`/p/${post.id}`);
  };

  const handleDelete = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const confirmed = confirm("Hapus post ini?");
    if (!confirmed) return;

    setDeleting(true);
    try {
      const result = await deletePost(post.id, user().id);
      if (result.success) {
        if (props.onDeleted) props.onDeleted(post.id);
        navigate("/");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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
      action: () => navigate(`/p/edit/${post.id}`),
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
      class="card p-0 overflow-hidden mb-4 border border-zinc-800 cursor-pointer"
      onClick={() => navigate(`/p/${post.id}`)}
    >
      {/* Card Header - Author Info */}
      <div class="flex items-center gap-3 p-4 border-b border-zinc-800 bg-zinc-900/50">
        <A
          href={`/u/${userProfile()?.username || userProfile()?.id}`}
          class="flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={userProfile()?.pp_url || "/default.png"}
            alt={userProfile()?.username}
            class="h-10 w-10 rounded-full border border-zinc-700 object-cover"
          />
        </A>

        <div class="flex-1 min-w-0">
          <A
            href={`/u/${userProfile()?.username || userProfile()?.id}`}
            class="text-sm font-bold text-white hover:text-pink-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            @{userProfile()?.username || "anon"}
          </A>
          <p class="text-[10px] text-zinc-500 uppercase tracking-wider">
            {new Date(post.created_at).toLocaleDateString("id-ID")}
          </p>
        </div>

        <Show when={isOwner() && !deleting()}>
          <MenuBar
            items={menuItems()}
            trigger={(open) => (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  open(e);
                }}
              >
                <MoreVertical size={18} />
              </Button>
            )}
          />
        </Show>
      </div>

      {/* Card Content */}
      <div class="p-4 space-y-4">
        <Show when={post.caption}>
          <p class="text-sm text-zinc-300 leading-relaxed break-words">
            {post.caption}
          </p>
        </Show>

        <Show when={post.media?.length > 0}>
          <div class={`grid gap-2 rounded-xl overflow-hidden ${post.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <For each={post.media}>
              {(url) => (
                <img src={url} class="w-full h-full object-cover aspect-video" />
              )}
            </For>
          </div>
        </Show>
      </div>

      {/* Card Footer - Actions */}
      <div class="flex items-center gap-2 p-3 pt-0">
        <Button
          variant={liked() ? "primary" : "outline"}
          size="sm"
          onClick={handleLike}
          className={liked() ? "" : "border-zinc-800"}
          leftIcon={<Heart size={16} fill={liked() ? "currentColor" : "none"} />}
        >
          {reactionCount()}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleComment}
          className="border-zinc-800"
          leftIcon={<MessageCircle size={16} />}
        >
          {commentCount()}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleShare}
          className="ml-auto border-zinc-800"
        >
          <Share2 size={16} />
        </Button>
      </div>
    </article>
  );
}
