// src/components/Profile.jsx
import { createSignal, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { supabase } from "../utils/supabase";
import { user } from "../utils/auth";

export default function Profile(props) {
  const [profile, setProfile] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");

  const isOwnProfile = () => {
    return user() && user().id === profile()?.id;
  };

  onMount(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("accounts")
        .select("id, username, pp_url, bio, created_at")
        .eq("username", props.username)
        .single();

      if (fetchError) {
        setError("Pengguna tidak ditemukan");
      } else {
        setProfile(data);
      }
    } catch (err) {
      setError("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  });

  return (
    <section class="bg-neutral-950 py-12 min-h-screen">
      <div class="max-w-2xl mx-auto px-4">
        {/* Loading State */}
        <Show when={loading()}>
          <div class="flex items-center justify-center py-20">
            <div class="animate-pulse space-y-4 w-full max-w-md">
              <div class="h-20 w-20 rounded-full bg-neutral-800" />
              <div class="h-4 bg-neutral-800 rounded w-3/4" />
              <div class="h-4 bg-neutral-800 rounded w-1/2" />
            </div>
          </div>
        </Show>

        {/* Error State */}
        <Show when={!loading() && error()}>
          <div class="py-20 text-center space-y-4">
            <div class="p-4 rounded-lg border border-red-700/50 bg-red-900/20 text-red-400 text-sm inline-block">
              {error()}
            </div>
            <A
              href="/"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-neutral-50 hover:bg-emerald-500 h-9 px-4 transition-colors"
            >
              Kembali ke Home
            </A>
          </div>
        </Show>

        {/* Profile Content */}
        <Show when={!loading() && profile() && !error()}>
          <div class="space-y-8">
            {/* Profile Header */}
            <div class="flex items-start gap-6">
              {/* Avatar */}
              <img
                src={profile()?.pp_url || "/default.png"}
                alt={profile()?.username}
                class="h-20 w-20 rounded-full border border-neutral-700 object-cover flex-shrink-0"
                loading="lazy"
              />

              {/* Info */}
              <div class="flex-1 space-y-4">
                <div class="space-y-1">
                  <h1 class="text-3xl font-bold tracking-tight text-neutral-50">
                    @{profile()?.username}
                  </h1>
                  <p class="text-xs text-neutral-500 uppercase tracking-wider">
                    Bergabung{" "}
                    {new Date(profile()?.created_at).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>

                {/* Bio */}
                <Show when={profile()?.bio}>
                  <p class="text-sm text-neutral-400 leading-relaxed max-w-md">
                    {profile()?.bio}
                  </p>
                </Show>

                {/* Edit Button */}
                <Show when={isOwnProfile()}>
                  <A
                    href="/useredit"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-neutral-50 hover:bg-emerald-500 h-9 px-6 transition-colors"
                  >
                    Edit Profil
                  </A>
                </Show>
              </div>
            </div>

            {/* Divider */}
            <div class="border-t border-neutral-800" />

            {/* Posts Section */}
            <div class="space-y-4">
              <div class="flex items-baseline gap-3">
                <h2 class="text-lg font-bold tracking-tight text-neutral-50">
                  Postingan
                </h2>
                <span class="px-2.5 py-0.5 inline-flex items-center rounded-full border border-neutral-700 bg-neutral-800/50 text-xs font-medium text-neutral-400">
                  0
                </span>
              </div>

              <div class="rounded-lg border border-neutral-800 bg-neutral-900/50 p-8 text-center">
                <p class="text-sm text-neutral-500">
                  Belum ada postingan dari pengguna ini
                </p>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </section>
  );
}
