<script lang="ts">
  import { onMount } from 'svelte';
  import { posts } from '$lib/supabase/posts';
  import PostCard from './PostCard.svelte';

  let postList = $state<any[]>([]);
  let loading = $state(true);
  let error = $state('');

  onMount(async () => {
    try {
      const { data, error: fetchError } = await posts.getAll(20, 0);
      if (fetchError) {
        error = fetchError.message;
      } else {
        postList = data ?? [];
      }
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<main class="feed-container">
  {#if loading}
    <div class="status-message">Loading feed...</div>
  {:else if error}
    <div class="status-message error">{error}</div>
  {:else if postList.length === 0}
    <div class="status-message">No posts found.</div>
  {:else}
    <div class="feed">
      {#each postList as post}
        <PostCard {post} />
      {/each}
    </div>
  {/if}
</main>

<style>
  .feed-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1rem;
    width: 100%;
    flex: 1;
  }

  .feed {
    display: flex;
    flex-direction: column;
  }

  .status-message {
    text-align: center;
    padding: 2rem;
    color: var(--text-muted);
  }

  .status-message.error {
    color: #ff5252;
  }
</style>
