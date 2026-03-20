// src/components/Comments.jsx
import { createSignal, onMount, For, Show } from "solid-js";
import { useNavigate, A } from "@solidjs/router";
import { supabase } from "../utils/supabase";
import { user } from "../utils/auth";
import { deleteComment } from "../utils/comments.js";
import MenuBar from "./MenuBar";
import { Edit3, Trash2, MoreVertical } from "lucide-solid";

export default function Comments(props) {
  const navigate = useNavigate();

  const [comments, setComments] = createSignal([]);
  const [commentText, setCommentText] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal(null);
  const [pressTimers, setPressTimers] = createSignal({});

  async function fetchComments() {
    const { data, error } = await supabase
      .from("comments")
      .select("*, accounts(id, username, pp_url)")
      .eq("post_id", props.postId)
      .order("created_at", { ascending: true });

    if (error) console.error(error);
    else setComments(data);
  }

  onMount(fetchComments);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user()) return alert("Login dulu 😑");
    if (!commentText().trim()) return;

    setLoading(true);

    const { error } = await supabase.from("comments").insert({
      post_id: props.postId,
      account_id: user().id,
      content: commentText(),
    });

    if (error) console.error(error);
    else {
      setCommentText("");
      fetchComments();
    }

    setLoading(false);
  };

  // Long press untuk mobile
  const handleMouseDown = (commentId) => {
    const timer = setTimeout(() => {
      // Menu will show via MenuBar
    }, 600);

    setPressTimers((prev) => ({
      ...prev,
      [commentId]: timer,
    }));
  };

  const handleMouseUp = (commentId) => {
    const timer = pressTimers()[commentId];
    if (timer) {
      clearTimeout(timer);
      setPressTimers((prev) => ({
        ...prev,
        [commentId]: null,
      }));
    }
  };

  const handleEditComment = (commentId) => {
    navigate(`/c/edit/${commentId}`);
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = confirm("Hapus comment ini?");
    if (!confirmed) return;

    setDeletingId(commentId);
    try {
      const result = await deleteComment(commentId, user().id);
      if (result.success) {
        fetchComments();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Gagal menghapus comment");
    } finally {
      setDeletingId(null);
    }
  };

  const getMenuItems = (commentId) => [
    {
      label: "Edit",
      icon: <Edit3 size={16} />,
      action: () => handleEditComment(commentId),
    },
    {
      divider: true,
    },
    {
      label: "Hapus",
      icon: <Trash2 size={16} />,
      action: () => handleDeleteComment(commentId),
      variant: "destructive",
    },
  ];

  return (
    <section class="bg-transparent py-8">
      <div class="max-w-2xl mx-auto px-4">
        {/* Header Section */}
        <div class="flex items-baseline gap-2 mb-6">
          <h2 class="text-xl font-bold text-neutral-50 tracking-tight">
            Diskusi
          </h2>
          <span class="px-2.5 py-0.5 inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800/50 text-xs font-medium text-neutral-400">
            {comments().length}
          </span>
        </div>

        {/* Comment Form - Shadcn style */}
        <form onSubmit={handleSubmit} class="mb-8">
          <div class="relative overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/50 focus-within:border-emerald-600/50 focus-within:ring-1 focus-within:ring-emerald-600/20 transition-all">
            <textarea
              rows="3"
              class="w-full bg-transparent p-4 outline-none text-sm placeholder:text-neutral-500 text-neutral-50 resize-none"
              placeholder="Apa pendapatmu?..."
              value={commentText()}
              onInput={(e) => setCommentText(e.target.value)}
              required
            />
            <div class="flex justify-end gap-2 p-3 bg-neutral-900/50 border-t border-neutral-800">
              <button
                type="submit"
                disabled={loading() || !commentText().trim()}
                class="inline-flex items-center justify-center rounded-md text-xs font-medium bg-emerald-600 text-neutral-50 hover:bg-emerald-500 disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed px-4 py-2 transition-colors"
              >
                {loading() ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div class="space-y-6">
          <Show
            when={comments().length > 0}
            fallback={
              <p class="text-sm text-neutral-500 text-center py-8">
                Belum ada komentar
              </p>
            }
          >
            <For each={comments()}>
              {(comment) => (
                <article
                  class="group flex gap-4"
                  onMouseDown={() => handleMouseDown(comment.id)}
                  onMouseUp={() => handleMouseUp(comment.id)}
                  onTouchStart={() => handleMouseDown(comment.id)}
                  onTouchEnd={() => handleMouseUp(comment.id)}
                >
                  {/* Avatar - Clickable */}
                  <A
                    href={`/u/${comment.accounts?.username}`}
                    class="flex-shrink-0 hover:opacity-80 transition-opacity"
                    title={`Visit @${comment.accounts?.username}'s profile`}
                  >
                    <img
                      src={comment.accounts?.pp_url || "/default.png"}
                      alt={comment.accounts?.username}
                      class="h-9 w-9 rounded-full border border-neutral-700 object-cover"
                      loading="lazy"
                    />
                  </A>

                  {/* Comment Content */}
                  <div class="flex-1 min-w-0 space-y-1">
                    {/* Header */}
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2 min-w-0">
                        {/* Username - Clickable */}
                        <A
                          href={`/u/${comment.accounts?.username}`}
                          class="text-sm font-semibold text-neutral-50 hover:text-emerald-400 transition-colors truncate"
                          title={`Visit @${comment.accounts?.username}'s profile`}
                        >
                          @{comment.accounts?.username || "anon"}
                        </A>
                        <span class="text-[10px] text-neutral-600 flex-shrink-0">
                          •
                        </span>
                        <time class="text-[10px] text-neutral-500 font-medium uppercase tracking-tight flex-shrink-0">
                          {new Date(comment.created_at).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short" }
                          )}
                        </time>
                      </div>

                      {/* Menu - Only for owner */}
                      <Show
                        when={
                          user() &&
                          user().id === comment.account_id &&
                          deletingId() !== comment.id
                        }
                      >
                        <MenuBar
                          items={getMenuItems(comment.id)}
                          trigger={(open) => (
                            <button
                              onClick={open}
                              class="opacity-0 group-hover:opacity-100 p-1 rounded-md text-neutral-600 hover:text-neutral-50 hover:bg-neutral-800/50 transition-all flex-shrink-0"
                              title="Comment menu"
                              aria-label="Comment menu"
                            >
                              <MoreVertical size={14} />
                            </button>
                          )}
                        />
                      </Show>

                      {/* Deleting state */}
                      <Show when={deletingId() === comment.id}>
                        <span class="text-xs text-neutral-500 flex-shrink-0">
                          Deleting...
                        </span>
                      </Show>
                    </div>

                    {/* Comment Text */}
                    <p class="text-sm text-neutral-400 leading-relaxed break-words">
                      {comment.content}
                    </p>
                  </div>
                </article>
              )}
            </For>
          </Show>
        </div>
      </div>
    </section>
  );
}
