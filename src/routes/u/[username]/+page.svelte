<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import PostCard from '$lib/components/PostCard.svelte';

  export let data;
  const { profile, stats, posts } = data;
  
  let currentUser: any = null;
  let activeTab = 'post'; // post | media | group

  // DiceBear Avatar Fallback
  $: avatarSrc = profile.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.username}`;

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    currentUser = session?.user;
  });
</script>

<div class="profile-layout">
  <div class="banner" style="background-color: var(--accent); opacity: 0.2;"></div>

  <div class="profile-content">
    <div class="header-section">
      <img src={avatarSrc} alt="avatar" class="avatar" />
      
      {#if currentUser && currentUser.id === profile.auth_id}
        <button class="edit-btn">Edit Profil</button>
      {/if}
    </div>

    <div class="info-section">
      <div class="name-row">
        <h1>{profile.display_name || profile.username}</h1>
        {#if profile.is_verified}<span class="material-icons" style="color: var(--accent); font-size: 20px;">verified</span>{/if}
      </div>
      <p class="username">@{profile.username}</p>
      <p class="bio">{profile.bio || 'Belum ada bio.'}</p>

      <div class="meta-info">
        <span class="material-icons" style="font-size: 16px;">calendar_today</span> 
        Joined {new Date(profile.created_at).toLocaleDateString()}
      </div>

      <div class="stats">
        <p><strong>{stats.friends}</strong> Teman</p>
        <p><strong>{stats.followers}</strong> Pengikut</p>
      </div>
    </div>

    <div class="tabs">
      <button class="tab" class:active={activeTab === 'post'} on:click={() => activeTab = 'post'}>Postingan</button>
      <button class="tab" class:active={activeTab === 'media'} on:click={() => activeTab = 'media'}>Media</button>
      <button class="tab" class:active={activeTab === 'group'} on:click={() => activeTab = 'group'}>Grup</button>
    </div>

    <div class="feed">
      {#if activeTab === 'post'}
        {#each posts as post}
          <PostCard {post} />
        {/each}
      {:else}
        <p class="empty">Konten {activeTab} segera hadir!</p>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Tambahkan style tab button */
  .tab {
    background: none;
    border: none;
    flex: 1;
    padding: var(--space-lg) 0;
    color: var(--text-secondary);
    font-weight: bold;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: 0.2s;
  }
  .tab.active {
    color: var(--text-primary);
    border-bottom: 2px solid var(--accent);
  }

  .profile-layout {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    font-family: var(--font-main);
  }

  .banner {
    height: 150px;
    background-color: var(--border-subtle); /* Placeholder banner */
  }

  .profile-content {
    max-width: 600px;
    margin: 0 auto;
    padding: 0 var(--space-lg);
  }

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: -50px;
    margin-bottom: var(--space-lg);
  }

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid var(--bg-primary);
    background-color: var(--bg-surface);
  }

  .edit-btn {
    padding: var(--space-sm) var(--space-lg);
    border: 1px solid var(--border-subtle);
    background: transparent;
    color: var(--text-primary);
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
  }

  .name-row {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  h1 { font-size: 1.4rem; margin: 0; }
  .username { color: var(--text-secondary); margin: 0; }
  .bio { margin: var(--space-md) 0; line-height: 1.4; }

  .meta-info {
    color: var(--text-secondary);
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .stats {
    display: flex;
    gap: var(--space-lg);
    margin: var(--space-lg) 0;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border-subtle);
    margin-bottom: var(--space-md);
  }

  .tab {
    flex: 1;
    text-align: center;
    padding: var(--space-lg) 0;
    color: var(--text-secondary);
    font-weight: bold;
    cursor: pointer;
  }

  .tab.active {
    color: var(--text-primary);
    border-bottom: 3px solid var(--accent);
  }

  .post-card {
    padding: var(--space-lg);
    border-bottom: 1px solid var(--border-subtle);
  }

  .post-media img {
    width: 100%;
    border-radius: var(--radius-md);
    margin-top: var(--space-sm);
  }

  .post-footer {
    display: flex;
    gap: var(--space-xl);
    margin-top: var(--space-md);
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .badge {
    background: var(--bg-surface);
    color: var(--accent);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-right: 5px;
  }
</style>
