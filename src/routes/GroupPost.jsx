import { createSignal, onMount, For, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { uploadPost } from "../utils/posts";
import { getGroupById, isGroupMember } from "../utils/groups";
import Navbar from "../components/Navbar";
import { ArrowLeft, Image as ImageIcon, X, Send } from "lucide-solid";
import { user } from "../utils/auth";

export default function GroupPost() {
  const params = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = createSignal(null);
  const [caption, setCaption] = createSignal("");
  const [files, setFiles] = createSignal([]);
  const [previews, setPreviews] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [verifying, setVerifying] = createSignal(true);
  const [error, setError] = createSignal("");

  onMount(async () => {
    if (!user()) return navigate("/login");

    try {
      const [groupData, memberStatus] = await Promise.all([
        getGroupById(params.id),
        isGroupMember(params.id)
      ]);

      if (!memberStatus) {
        alert("You must be a member to post in this group!");
        return navigate(`/g/${params.id}`);
      }

      setGroup(groupData);
    } catch (err) {
      console.error(err);
      navigate("/group-list");
    } finally {
      setVerifying(false);
    }
  });

  const handleFile = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files(), ...selectedFiles]);

    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews(), ...newPreviews]);
  };

  const removeFile = (idx) => {
    const updatedFiles = files().filter((_, i) => i !== idx);
    const updatedPreviews = previews().filter((_, i) => i !== idx);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption() && files().length === 0) return setError("Post cannot be empty");

    setLoading(true);
    setError("");
    try {
      await uploadPost({
        caption: caption(),
        files: files(),
        group_id: params.id
      });
      navigate(`/g/${params.id}`);
    } catch (err) {
      setError(err.message || "Failed to upload post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="container pb-24">
      <header class="flex items-center gap-4 mt-4 mb-8">
        <button onClick={() => navigate(`/g/${params.id}`)} class="nav-icon-btn">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 class="text-3xl">New Group Post</h1>
          <p class="text-sm text-secondary">Posting to {group()?.name}</p>
        </div>
      </header>

      {verifying() ? (
        <div class="flex justify-center p-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} class="space-y-6">
          <div class="card p-0 overflow-hidden bg-zinc-900 border border-zinc-800">
            <textarea
              placeholder="What's happening in this group?"
              class="w-full bg-transparent border-none p-4 text-white resize-none min-h-[150px] outline-none"
              value={caption()}
              onInput={(e) => setCaption(e.target.value)}
            />

            <Show when={previews().length > 0}>
              <div class="grid grid-cols-2 gap-2 p-2 bg-black/20">
                <For each={previews()}>
                  {(url, idx) => (
                    <div class="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={url} class="w-full h-full object-cover" alt="Preview" />
                      <button
                        type="button"
                        onClick={() => removeFile(idx())}
                        class="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <input
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                id="file-upload"
                onChange={handleFile}
              />
              <label
                for="file-upload"
                class="btn btn-secondary py-2"
              >
                <ImageIcon size={20} />
                Add Media
              </label>
            </div>

            <button
              type="submit"
              class="btn btn-primary px-8"
              disabled={loading()}
            >
              {loading() ? "Posting..." : <><Send size={18} /> Post</>}
            </button>
          </div>

          {error() && (
            <div class="text-red-500 text-sm font-medium">{error()}</div>
          )}
        </form>
      )}

      <Navbar />
    </div>
  );
}
