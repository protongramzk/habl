<script lang="ts">
  import { supabase } from '$lib/supabase/client';
  import { onMount } from 'svelte';
  import type { User } from '@supabase/supabase-js';

  let user = $state<User | null>(null);

  onMount(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      user = session?.user ?? null;
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      user = session?.user ?? null;
    });

    return () => subscription.unsubscribe();
  });

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }
</script>

<nav class="navbar">
  <div class="nav-content">
    <a href="/" class="logo">hvlum</a>

    <div class="nav-links">
      <a href="/">Home</a>
      {#if user}
        <a href="/u/{user.id}">Profile</a>
        <button class="logout-btn" onclick={handleLogout}>Logout</button>
      {:else}
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      {/if}
    </div>
  </div>
</nav>

<style>
  .navbar {
    border-bottom: var(--border-width) solid var(--border);
    background: var(--bg);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-content {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--padding-y) var(--padding-x);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-weight: bold;
    font-size: 1.2rem;
    letter-spacing: -0.5px;
  }

  .nav-links {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  .nav-links a {
    font-size: 0.9rem;
    color: var(--text-muted);
    transition: color var(--motion-normal);
  }

  .nav-links a:hover {
    color: var(--text);
  }

  .logout-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.9rem;
    padding: 0;
    transition: color var(--motion-normal);
  }

  .logout-btn:hover {
    color: var(--text);
  }
</style>
