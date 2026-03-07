<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  
  let userProfile = null;

  onMount(async () => {
    // Ambil session user untuk dapetin username
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from('accounts')
        .select('username')
        .eq('auth_id', session.user.id)
        .maybeSingle();
      userProfile = data;
    }
  });
</script>

<nav class="navbar">
  <div class="nav-content">
    <a href="/" class="nav-item">
      <span class="material-icons">home</span>
      <span class="label">Home</span>
    </a>
    
    <a href="/p/new" class="nav-item">
      <span class="material-icons">add_circle_outline</span>
      <span class="label">Post</span>
    </a>
    
    <a href="/g" class="nav-item">
      <span class="material-icons">groups</span>
      <span class="label">Groups</span>
    </a>

    {#if userProfile}
      <a href="/u/{userProfile.username}" class="nav-item">
        <span class="material-icons">person_outline</span>
        <span class="label">Profile</span>
      </a>
    {:else}
      <a href="/auth/login" class="nav-item">
        <span class="material-icons">login</span>
        <span class="label">Login</span>
      </a>
    {/if}
  </div>
</nav>

<style>
  .navbar {
    background: var(--bg-surface);
    border-top: 1px solid var(--border-subtle);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: var(--space-sm) 0;
    z-index: 1000;
  }

  .nav-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    max-width: 600px;
    margin: 0 auto;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.7rem;
    gap: var(--space-xs);
    transition: color 0.2s;
  }

  .nav-item:hover, .nav-item:active {
    color: var(--accent);
  }

  .label { font-weight: 500; }

  /* Desktop View */
  @media (min-width: 768px) {
    .navbar {
      top: 0;
      bottom: auto;
      height: 100vh;
      width: 250px;
      border-top: none;
      border-right: 1px solid var(--border-subtle);
      padding: var(--space-xl);
    }
    .nav-content {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-xl);
    }
    .nav-item {
      flex-direction: row;
      font-size: 1.1rem;
      gap: var(--space-lg);
    }
  }
</style>
