// src/components/UserForm.jsx
import { createSignal, onMount, Show } from "solid-js";
import { supabase } from "../utils/supabase";
import { user } from "../utils/auth";
import { updateUserProfile } from "../utils/user";
import { uploadToProfilePics } from "../utils/storageHelper";

export default function UserForm(props) {
  const [username, setUsername] = createSignal("");
  const [bio, setBio] = createSignal("");
  const [ppUrl, setPpUrl] = createSignal("");
  const [preview, setPreview] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal(false);
  const [originalData, setOriginalData] = createSignal({});
  const [uploading, setUploading] = createSignal(false);

  onMount(async () => {
    if (user()) {
      const { data, error: fetchError } = await supabase
        .from("accounts")
        .select("username, pp_url, bio")
        .eq("id", user().id)
        .single();

      if (!fetchError && data) {
        setUsername(data.username || "");
        setBio(data.bio || "");
        setPpUrl(data.pp_url || "");
        setPreview(data.pp_url || "/default.png");

        setOriginalData({
          username: data.username || "",
          bio: data.bio || "",
          ppUrl: data.pp_url || "",
        });
      }
    }
  });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result || "");
      setPpUrl(file);
    };
    reader.readAsDataURL(file);
  };

  const hasChanges = () => {
    const original = originalData();

    if (username() !== original.username || bio() !== original.bio) {
      return true;
    }

    if (ppUrl instanceof File) {
      return true;
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user()) return setError("Login dulu 😑");

    if (!hasChanges()) {
      setError("Tidak ada perubahan untuk disimpan");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      let ppUrlToSave = null;

      // Upload image jika ada file baru
      if (ppUrl instanceof File) {
        setUploading(true);
        try {
          ppUrlToSave = await uploadToProfilePics(
            ppUrl,
            user().id,
            "avatars"
          );
        } finally {
          setUploading(false);
        }
      }

      // Update profile
      await updateUserProfile(user().id, {
        username: username() !== originalData().username ? username() : null,
        bio: bio() !== originalData().bio ? bio() : null,
        ppUrl: ppUrlToSave,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Update original data
      setOriginalData({
        username: username(),
        bio: bio(),
        ppUrl: ppUrlToSave || ppUrl,
      });

      if (props.onSuccess) props.onSuccess();
    } catch (err) {
      setError(err.message || "Gagal update profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section class="bg-neutral-950 py-10 min-h-screen">
      <div class="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-neutral-50">
            Edit Profil
          </h1>
          <p class="text-sm text-neutral-500 mt-2">
            Update informasi profil Anda
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
              <span>Profil berhasil diupdate</span>
            </div>
          </Show>

          {/* Profile Picture Section */}
          <div class="space-y-3">
            <label class="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              Foto Profil
            </label>

            <div class="flex items-center gap-6">
              <img
                src={preview()}
                alt="Profile preview"
                class="h-16 w-16 rounded-full border border-neutral-700 object-cover flex-shrink-0"
              />

              <div class="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading() || loading()}
                  class="text-sm text-neutral-500 file:mr-3 file:px-3 file:py-1.5 file:bg-neutral-800 file:text-neutral-300 file:border file:border-neutral-700 file:rounded-md file:text-xs file:font-medium file:cursor-pointer hover:file:bg-neutral-700 disabled:file:opacity-50 disabled:file:cursor-not-allowed transition-colors"
                />
                <p class="text-xs text-neutral-500 mt-2">
                  JPG, PNG, WebP • Max 5MB
                </p>
              </div>
            </div>

            {/* Upload Progress */}
            <Show when={uploading()}>
              <div class="p-3 rounded-lg border border-neutral-700 bg-neutral-800/50 text-neutral-400 text-xs">
                Mengupload gambar...
              </div>
            </Show>
          </div>

          {/* Username Field */}
          <div class="space-y-2">
            <label class="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              Username
            </label>
            <input
              type="text"
              value={username()}
              onInput={(e) => setUsername(e.target.value)}
              class="w-full bg-neutral-900/50 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/20 transition-colors"
              placeholder="john_doe"
              required
            />
          </div>

          {/* Bio Field */}
          <div class="space-y-2">
            <label class="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              Bio
            </label>
            <textarea
              value={bio()}
              onInput={(e) => setBio(e.target.value)}
              rows="4"
              class="w-full bg-neutral-900/50 border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-600/50 focus:ring-1 focus:ring-emerald-600/20 resize-none transition-colors"
              placeholder="Ceritakan tentang dirimu..."
              maxlength="160"
            />
            <div class="flex justify-between items-center">
              <p class="text-xs text-neutral-500">
                Cerita singkat tentang Anda
              </p>
              <p class="text-xs text-neutral-500">
                {bio().length}/160
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div class="flex justify-end gap-3 pt-6 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => window.history.back()}
              disabled={loading() || uploading()}
              class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-neutral-700 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed h-9 px-4 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading() || uploading() || !hasChanges()}
              class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-neutral-50 hover:bg-emerald-500 disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed h-9 px-6 transition-colors"
            >
              {loading() || uploading() ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

