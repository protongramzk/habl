import { createSignal, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { uploadPost } from "../utils/posts";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { ArrowLeft, Image as ImageIcon, X, Send } from "lucide-solid";

export default function CreatePost() {
  const navigate = useNavigate();
  const [caption, setCaption] = createSignal("");
  const [files, setFiles] = createSignal([]);
  const [previews, setPreviews] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleFile = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files(), ...selectedFiles]);
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews(), ...newPreviews]);
  };

  const removeFile = (idx) => {
    setFiles(files().filter((_, i) => i !== idx));
    setPreviews(previews().filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption().trim() && files().length === 0) return setError("Post content is required");

    setLoading(true);
    setError("");
    try {
      await uploadPost({ caption: caption(), files: files() });
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="container pb-24">
      <header class="flex items-center gap-4 py-6">
        <button onClick={() => navigate(-1)} class="nav-icon-btn">
          <ArrowLeft size={24} />
        </button>
        <h1 class="text-3xl">Create Post</h1>
      </header>

      <form onSubmit={handleSubmit} class="space-y-6">
        <div class="card p-0 overflow-hidden bg-zinc-900 border border-zinc-800">
          <textarea
            placeholder="What's on your mind?"
            class="w-full bg-transparent border-none p-4 text-white resize-none min-h-[150px] outline-none text-lg"
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
            <label for="file-upload" class="btn btn-secondary py-2 cursor-pointer">
              <ImageIcon size={20} />
              Add Media
            </label>
          </div>

          <Button type="submit" disabled={loading()} leftIcon={<Send size={18} />}>
            {loading() ? "Posting..." : "Post"}
          </Button>
        </div>

        {error() && (
          <div class="card bg-red-900/10 border-red-900/50 text-red-500 text-sm">
            {error()}
          </div>
        )}
      </form>

      <Navbar />
    </div>
  );
}
