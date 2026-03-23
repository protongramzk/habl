<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { accounts } from '$lib/supabase/accounts';
  import { posts } from '$lib/supabase/posts';
  import { interactions } from '$lib/supabase/interactions';
  import PostCard from '../../PostCard.svelte';
  import Card from '$lib/components/Card.svelte';

  let account = $state<any>(null);
  let userPosts = $state<any[]>([]);
  let followers = $state<any[]>([]);
  let following = $state<any[]>([]);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    const idOrUsername = page.params.id;
    if (!idOrUsername) {
      error = 'User not found';
      loading = false;
      return;
    }

    try {
      // Try fetching by username first, then by ID
      let { data: acc, error: accError } = await accounts.getByUsername(idOrUsername);
      if (accError || !acc) {
        ({ data: acc, error: accError } = await accounts.getById(idOrUsername));
      }

      if (accError || !acc) {
        error = 'User not found';
        loading = false;
        return;
      }

      account = acc;

      // Fetch posts, followers, and following
      const [postsRes, followersRes, followingRes] = await Promise.all([
        posts.getByAccountId(account.id),
        interactions.getFollowers(account.id),
        interactions.getFollowing(account.id)
      ]);

      userPosts = postsRes.data ?? [];
      followers = followersRes.data ?? [];
      following = followingRes.data ?? [];

    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  const joinDate = $derived(account?.created_at
    ? new Date(account.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '');
</script>

<main class="profile-container">
  {#if loading}
    <div class="status-message">Loading profile...</div>
  {:else if error}
    <div class="status-message error">{error}</div>
  {:else if account}
    <div class="profile-header">
      <Card class="info-card">
        <div class="info-layout">
          <img
            src={account.pp_url ?? 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
            alt={account.username}
            class="profile-avatar"
          />
          <div class="profile-details">
            <h1>@{account.username}</h1>
            {#if account.bio}
              <p class="bio">{account.bio}</p>
            {/if}
            <div class="stats">
              <div class="stat">
                <span class="count">{userPosts.length}</span>
                <span class="label">posts</span>
              </div>
              <div class="stat">
                <span class="count">{followers.length}</span>
                <span class="label">followers</span>
              </div>
              <div class="stat">
                <span class="count">{following.length}</span>
                <span class="label">following</span>
              </div>
            </div>
            <p class="join-date">Joined {joinDate}</p>
          </div>
        </div>
      </Card>
    </div>

    <div class="profile-feed">
      {#if userPosts.length === 0}
        <div class="status-message">No posts yet.</div>
      {:else}
        {#each userPosts as post}
          <PostCard {post} />
        {/each}
      {/if}
    </div>
  {/if}
</main>

<style>
  .profile-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1rem;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  :global(.info-card) {
    width: 100%;
    padding: 2rem;
  }

  .info-layout {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  .profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: var(--border-width) solid var(--border);
    background: var(--bg);
  }

  .profile-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
    letter-spacing: -0.5px;
  }

  .bio {
    margin: 0;
    color: var(--text);
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .stats {
    display: flex;
    gap: 1.5rem;
  }

  .stat {
    display: flex;
    gap: 0.25rem;
    align-items: baseline;
  }

  .count {
    font-weight: 600;
    color: var(--text);
    font-size: 1rem;
  }

  .label {
    color: var(--text-muted);
    font-size: 0.85rem;
  }

  .join-date {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .status-message {
    text-align: center;
    padding: 2rem;
    color: var(--text-muted);
  }

  .status-message.error {
    color: #ff5252;
  }

  @media (max-width: 480px) {
    .info-layout {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
    }

    .stats {
      justify-content: center;
    }
  }
</style>
