<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let username = '';
  let loading = false;

  async function setUsername() {
    loading = true;
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase.from('accounts').insert([
        { 
          auth_id: user.id, 
          username: username, 
          email: user.email 
        }
      ]);
      
      if (!error) goto('/');
      else alert('Username sudah ada atau error: ' + error.message);
    }
    loading = false;
  }
</script>

<div class="onboarding">
  <h2>Pilih Username Kamu</h2>
  <input type="text" bind:value={username} placeholder="Username unik..." />
  <button on:click={setUsername} disabled={loading}>Lanjut</button>
</div>
