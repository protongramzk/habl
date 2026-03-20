import { createSignal, onMount, For, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { getGroupById, isGroupMember, joinGroup, leaveGroup } from "../utils/groups";
import { getPosts } from "../utils/posts";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { ArrowLeft, Plus, Settings, Users, LogOut } from "lucide-solid";
import { user } from "../utils/auth";

export default function GroupDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = createSignal(null);
  const [posts, setPosts] = createSignal([]);
  const [isMember, setIsMember] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [joining, setJoining] = createSignal(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupData, postsData, memberStatus] = await Promise.all([
        getGroupById(params.id),
        getPosts({ groupId: params.id }),
        isGroupMember(params.id)
      ]);
      setGroup(groupData);
      setPosts(postsData);
      setIsMember(memberStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchData);

  const handleJoinLeave = async () => {
    if (!user()) return navigate("/login");
    setJoining(true);
    try {
      if (isMember()) {
        await leaveGroup(group().id);
        setIsMember(false);
      } else {
        await joinGroup(group().id);
        setIsMember(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div class="pb-24">
      {loading() ? (
        <div class="flex justify-center p-24">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <>
          <div class="relative h-48 md:h-64 w-full bg-zinc-900 overflow-hidden">
            {group()?.cover_url ? (
              <img src={group().cover_url} class="w-full h-full object-cover" alt="Group Cover" />
            ) : (
              <div class="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center opacity-50">
                <Users size={64} class="text-zinc-700" />
              </div>
            )}
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

            <button
              onClick={() => navigate("/group-list")}
              class="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>

            <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div>
                <h1 class="text-3xl font-bold text-white shadow-sm">{group()?.name}</h1>
                <p class="text-zinc-300 text-sm mt-1">{group()?.description}</p>
              </div>
              <Show when={group()?.owner_id === user()?.id}>
                <button class="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                  <Settings size={20} />
                </button>
              </Show>
            </div>
          </div>

          <div class="container mt-6">
            <div class="flex gap-3 mb-8">
              <button
                onClick={handleJoinLeave}
                class={"btn flex-1 " + (isMember() ? "btn-secondary" : "btn-primary")}
                disabled={joining()}
              >
                {isMember() ? <><LogOut size={18} /> Leave</> : <><Plus size={18} /> Join Group</>}
              </button>

              <Show when={isMember()}>
                <button
                  onClick={() => navigate(`/g/${group().id}/post`)}
                  class="btn btn-primary flex-1"
                >
                  <Plus size={18} /> Post to Group
                </button>
              </Show>
            </div>

            <div class="space-y-4">
              <For each={posts()}>
                {(post) => <PostCard post={post} />}
              </For>
              {posts().length === 0 && (
                <div class="card text-center py-12 text-secondary">
                  No posts yet. Be the first to share something!
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <Navbar />
    </div>
  );
}
