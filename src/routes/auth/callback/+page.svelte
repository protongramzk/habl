<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  onMount(async () => {
    // Supabase otomatis menangani token di URL
    // Kita cuma perlu mastiin user sudah punya session
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      goto('/dashboard'); // Atau ke halaman profil/setup
    }
  });
</script>

<p>Sedang memproses login GitHub...</p>
