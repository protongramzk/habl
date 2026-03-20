import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { createGroup } from "../utils/groups";
import Navbar from "../components/Navbar";
import { ArrowLeft, Image as ImageIcon, Check } from "lucide-solid";

export default function GroupCreate() {
  const [name, setName] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [coverFile, setCoverFile] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name()) return setError("Group name is required");

    setLoading(true);
    setError("");
    try {
      const group = await createGroup({
        name: name(),
        description: description(),
        coverFile: coverFile()
      });
      navigate(`/g/${group.id}`);
    } catch (err) {
      setError(err.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    setCoverFile(e.target.files[0]);
  };

  return (
    <div class="container pb-24">
      <header class="flex items-center gap-4 mt-4 mb-10">
        <button onClick={() => navigate(-1)} class="nav-icon-btn">
          <ArrowLeft size={24} />
        </button>
        <h1 class="text-4xl">Create Group</h1>
      </header>

      <form onSubmit={handleCreate} class="space-y-8">
        <div class="space-y-3">
          <label class="font-bold text-sm uppercase tracking-widest text-zinc-500">Group Name</label>
          <input
            type="text"
            placeholder="Awesome Group"
            class="input-field text-xl"
            value={name()}
            onInput={(e) => setName(e.target.value)}
          />
        </div>

        <div class="space-y-3">
          <label class="font-bold text-sm uppercase tracking-widest text-zinc-500">Description</label>
          <textarea
            placeholder="What is this group about?"
            class="input-field min-h-[140px]"
            value={description()}
            onInput={(e) => setDescription(e.target.value)}
          />
        </div>

        <div class="space-y-3">
          <label class="font-bold text-sm uppercase tracking-widest text-zinc-500">Cover Image</label>
          <div class="relative">
            <input
              type="file"
              accept="image/*"
              class="hidden"
              id="cover-upload"
              onChange={handleFile}
            />
            <label
              for="cover-upload"
              class="upload-zone"
            >
              {coverFile() ? (
                <div class="text-pink-600 flex flex-col items-center gap-2">
                  <Check size={40} />
                  <span class="font-bold">{coverFile().name}</span>
                </div>
              ) : (
                <>
                  <ImageIcon size={48} />
                  <span class="mt-4 font-bold">Select Cover Artwork</span>
                </>
              )}
            </label>
          </div>
        </div>

        {error() && (
          <div class="p-4 rounded-xl bg-red-900/10 border border-red-900/50 text-red-500 text-sm font-bold text-center">
            {error()}
          </div>
        )}

        <button
          type="submit"
          class="btn btn-primary w-full py-5 text-xl shadow-xl"
          disabled={loading()}
        >
          {loading() ? "Creating Community..." : "Create Group"}
        </button>
      </form>

      <Navbar />
    </div>
  );
}
