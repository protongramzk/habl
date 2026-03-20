// src/components/EditPostForm.jsx
import { createSignal, Show, For, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { X, Loader2 } from "lucide-solid";
import { supabase } from "../utils/supabase";
import { user } from "../utils/auth";
import { deleteFromPosts } from "../utils/storageHelper";

export default function EditPostForm(props) {
  const navigate = useNavigate();

  const [caption, setCaption] = createSignal("");
  const [existingMediaUrls, setExistingMediaUrls] = createSignal([]);
  const [selectedFiles, setSelectedFiles] = createSignal([]);
  const [previews, setPreviews] = createSignal([]);
  const [uploading, setUploading] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal(false);
  const [originalCaption, setOriginalCaption] = createSignal("");

  // Load post data on mount
  onMount(async () => {
    if (!props.postId) return;

    try {
      const { data, error: fetchError } = await supabase
        .from("posts")
        .select("id, caption, media, account_id")
        .eq("id", props.postId)
        .single();

      if (fetchError) {
        setError("Post not found");
        return;
      }

      // Check ownership
      if (data.account_id !== user().id) {
        setError("You can only edit your own posts");
        return;
      }

      // Set form data
      setCaption(data.caption);
      setOriginalCaption(data.caption);
      setExistingMediaUrls(data.media || []);
    } catch (err) {
      setError("Failed to load post");
    }
  });

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const totalMedia = existingMediaUrls().length + files.length;

    if (totalMedia > 4) {
      setError(`Maximum 4 images allowed (currently have ${existingMediaUrls().length})`);
      return;
    }

    setSelectedFiles(files);

    // Create previews
    const newPreviews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove existing media
  const removeExistingMedia = (idx) => {
    setExistingMediaUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  // Remove selected file
  const removeNewFile = (idx) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // Upload new images to storage bucket
  const uploadNewImages = async (files) => {
    if (!files.length) return [];

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const fileName = `${user().id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;

        // Upload to posts bucket
        const { error: uploadError } = await supabase.storage
          .from("posts")
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        // Get public URL
        const { data } = supabase.storage
          .from("posts")
          .getPublicUrl(fileName);

        uploadedUrls.push(data.publicUrl);
      }

      return uploadedUrls;
    } catch (err) {
      throw new Error(err.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  // Delete old images from storage
  const deleteOldImages = async (urlsToDelete) => {
    for (const url of urlsToDelete) {
      try {
        await deleteFromPosts(url);
      } catch (err) {
        console.error("Failed to delete old image:", err);
        // Don't throw, just log error
      }
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user()) return setError("Login dulu 😑");

    const trimmedCaption = caption().trim();
    const totalMedia = existingMediaUrls().length + selectedFiles().length;

    if (!trimmedCaption && totalMedia === 0) {
      setError("Post must have caption or images");
      return;
    }

    // Check if there are any changes
    const captionChanged = trimmedCaption !== originalCaption();
    const mediaChanged = selectedFiles().length > 0 || 
                         existingMediaUrls().length !== (props.originalMediaCount || 0);

    if (!captionChanged && !mediaChanged) {
      setError("Tidak ada perubahan untuk disimpan");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Upload new images if any
      let newMediaUrls = [];
      if (selectedFiles().length > 0) {
        newMediaUrls = await uploadNewImages(selectedFiles());
      }

      // Combine existing (not removed) and new media
      const allMediaUrls = [...existingMediaUrls(), ...newMediaUrls];

      // Update post in database
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          caption: trimmedCaption,
          media: allMediaUrls,
          updated_at: new Date().toISOString(),
        })
        .eq("id", props.postId)
        .eq("account_id", user().id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess(true);
      setSelectedFiles([]);
      setPreviews([]);

      // Navigate after success
      setTimeout(() => {
        if (props.onSuccess) {
          props.onSuccess();
        } else {
          navigate(`/p/${props.postId}`);
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="bg-neutral-950 min-h-screen py-10">
      <div class="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-neutral-50">
            Edit Post
          </h1>
          <p class="text-sm text-neutral-500 mt-2">
            Ubah konten postingan Anda
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} class="space-y-6">
          {/* Error Alert */}
          <Show when={error()}>
            <div class="p-4 rounded-lg border border-red-700/50 bg-red-900/20 text-red-400 text-sm">
              {error()}
            </div>
          </Show>

          {/* Success Alert */}
          <Show when={success()}>
            <div class="p-4 rounded-lg border border-emerald-700/50 bg-emerald-900/20 text-emerald-400 text-sm flex items-center gap-2">
              <span>✓</span>
              <span>Post berhasil diupdate</span>
            </div>
          </Show>

          {/* Caption Field */}
          <div class="space-y-2">
            <label class="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              Caption
            </label>
            <textarea
              value={caption()}
              onInput={(e) => setCaption(e.target.value)}
              rows="4"
              class="w-full bg-neutral-900/50 border border-neutral-800 rounded-md px-4 py-3 text-sm text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/20 resize-none transition-colors"
              placeholder="Apa yang sedang Anda pikirkan?..."
            />
          </div>

          {/* Existing Media Section */}
          <Show when={existingMediaUrls().length > 0}>
            <div class="space-y-3">
              <label class="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                Foto Saat Ini ({existingMediaUrls().length})
              </label>

              <div class="grid grid-cols-2 gap-3">
                <For each={existingMediaUrls()}>
                  {(url, idx) => (
                    <div class="relative group rounded-lg overflow-hidden border border-neutral-700">
                      <img
                        src={url}
                        alt={`Existing media ${idx() + 1}`}
                        class="w-full aspect-video object-cover"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingMedia(idx())}
                        class="absolute top-2 right-2 p-1.5 rounded-md bg-red-900/50 text-red-400 hover:bg-red-900/70 opacity-0 group-hover:opacity-100 transition-all"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>

          {/* Add New Media Section */}
          <Show when={existingMediaUrls().length < 4}>
            <div class="space-y-3">
              <label class="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                Tambah Foto (Max {4 - existingMediaUrls().length} lagi)
              </label>

              {/* Upload Input */}
              <label class="block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading() || loading()}
                  class="hidden"
                />
                <div class="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-600/50 transition-colors">
                  <p class="text-sm text-neutral-400">
                    Klik untuk upload atau drag & drop
                  </p>
                  <p class="text-xs text-neutral-500 mt-1">
                    JPG, PNG, WebP
                  </p>
                </div>
              </label>

              {/* New Previews */}
              <Show when={previews().length > 0}>
                <div class="grid grid-cols-2 gap-3">
                  <For each={previews()}>
                    {(preview, idx) => (
                      <div class="relative group rounded-lg overflow-hidden border border-neutral-700">
                        <img
                          src={preview}
                          alt={`Preview ${idx() + 1}`}
                          class="w-full aspect-video object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewFile(idx())}
                          class="absolute top-2 right-2 p-1.5 rounded-md bg-red-900/50 text-red-400 hover:bg-red-900/70 opacity-0 group-hover:opacity-100 transition-all"
                          title="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </Show>

          {/* Upload Status */}
          <Show when={uploading()}>
            <div class="p-4 rounded-lg border border-neutral-700 bg-neutral-800/50 text-neutral-400 text-sm flex items-center gap-2">
              <Loader2 size={16} class="animate-spin" />
              <span>Mengupload gambar...</span>
            </div>
          </Show>

          {/* Submit Button */}
          <div class="flex justify-end gap-3 pt-6 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading() || uploading()}
              class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-neutral-700 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed h-9 px-6 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading() || uploading()}
              class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-neutral-50 hover:bg-emerald-500 disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed h-9 px-6 transition-colors"
            >
              {loading() ? (
                <>
                  <Loader2 size={16} class="animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
