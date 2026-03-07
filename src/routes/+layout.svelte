<svelte:head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"/>
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
</svelte:head>
<script lang="ts">
import Navbar from '$lib/components/Navbar.svelte';
  import '../lib/styles/tokens.css';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { page } from '$app/stores';
  import { logout } from '$lib/auth';
  import { goto } from '$app/navigation';

  let user: any = null;
  let loading = true;

  onMount(() => {
    // 1. Cek session saat pertama kali load
    supabase.auth.getSession().then(({ data: { session } }) => {
      user = session?.user ?? null;
      loading = false;
    });

    // 2. Listen perubahan auth (login/logout) secara real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      user = session?.user ?? null;
      loading = false;
    });

    return () => subscription.unsubscribe();
  });

  async function handleLogout() {
    await logout();
    goto('/auth/login');
  }
</script>

<div class="app-layout">
  <Navbar />
  <main>
    <slot />
  </main>
</div>

<style>
  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
    padding-bottom: 70px; /* Space for mobile navbar */
  }

  @media (min-width: 768px) {
    .app-layout { flex-direction: row; }
    main { padding-bottom: 0; padding-left: 250px; }
  }

  :global(body) {
    margin: 0;
    padding: 0;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    font-family: var(--font-main);
  }

  .app-container {
    display: grid;
    grid-template-columns: 250px 1fr 350px;
    min-height: 100vh;
    max-width: 1300px;
    margin: 0 auto;
  }

  /* Sidebar Styling */
  .sidebar {
    border-right: 1px solid var(--border-subtle);
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .logo {
    font-size: 2rem;
    padding-left: var(--space-sm);
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .nav-links a, .logout-btn {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    text-decoration: none;
    color: var(--text-primary);
    border-radius: var(--radius-md);
    transition: background 0.2s;
    font-size: 1.1rem;
    background: transparent;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }

  .nav-links a:hover, .logout-btn:hover {
    background-color: var(--bg-surface);
  }

  .nav-links a.active {
    font-weight: bold;
    color: var(--accent);
  }

  /* Main Content */
  .main-content {
    border-right: 1px solid var(--border-subtle);
    min-width: 0; /* Mencegah flex-item meluber */
  }

  /* Right Sidebar */
  .right-sidebar {
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .search-bar input {
    width: 100%;
    padding: var(--space-md);
    background-color: var(--bg-surface);
    border: 1px solid transparent;
    border-radius: 20px;
    color: var(--text-primary);
  }

  .trending-box {
    background-color: var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-md);
  }

  .trending-box h3 {
    margin-top: 0;
    font-size: 1.1rem;
    border-bottom: 1px solid var(--border-subtle);
    padding-bottom: var(--space-sm);
  }

  /* Responsive (Mobile) */
  @media (max-width: 1000px) {
    .right-sidebar { display: none; }
    .app-container { grid-template-columns: 80px 1fr; }
    .text { display: none; }
  }

  @media (max-width: 600px) {
    .app-container { 
      grid-template-columns: 1fr; 
      padding-bottom: 60px; /* Space for bottom nav */
    }
    .sidebar {
      position: fixed;
      bottom: 0;
      top: auto;
      height: 60px;
      width: 100%;
      flex-direction: row;
      border-right: none;
      border-top: 1px solid var(--border-subtle);
      padding: 0;
      justify-content: space-around;
      background: var(--bg-primary);
      z-index: 100;
    }
    .nav-links { flex-direction: row; width: 100%; justify-content: space-around; }
    .logo { display: none; }
  }
</style>
