import { createSignal, onMount, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { getGroups } from "../utils/groups";
import Navbar from "../components/Navbar";
import { Search, Plus, Users } from "lucide-solid";

export default function GroupList() {
  const [groups, setGroups] = createSignal([]);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [loading, setLoading] = createSignal(true);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await getGroups(searchTerm());
      setGroups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchGroups);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchGroups();
  };

  return (
    <div class="container pb-24">
      <header class="mb-8 mt-4">
        <h1 class="text-3xl mb-6">Explore Groups</h1>

        <div class="relative mb-6">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search groups..."
            class="input-field pl-10"
            value={searchTerm()}
            onInput={handleSearch}
          />
        </div>

        <div class="flex gap-3">
          <button
            onClick={() => navigate("/group-create")}
            class="btn btn-primary flex-1"
          >
            <Plus size={18} />
            Create Group
          </button>
          <button
            onClick={() => navigate("/federation-create")}
            class="btn btn-secondary flex-1"
          >
            <Users size={18} />
            Federation
          </button>
        </div>
      </header>

      {loading() ? (
        <div class="flex justify-center p-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <div class="space-y-4">
          <For each={groups()}>
            {(group) => (
              <div class="card flex justify-between items-center group">
                <div class="flex-1 mr-4">
                  <h3 class="text-lg font-bold mb-1">{group.name}</h3>
                  <p class="text-sm text-secondary line-clamp-2">
                    {group.description || "No description provided."}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/g/${group.id}`)}
                  class="btn btn-primary"
                >
                  Explore
                </button>
              </div>
            )}
          </For>
          {groups().length === 0 && (
            <div class="text-center p-12 text-secondary">
              No groups found. Try a different search or create one!
            </div>
          )}
        </div>
      )}

      <Navbar />
    </div>
  );
}
