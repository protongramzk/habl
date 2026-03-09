<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase/supabase';
  import GroupCard from '$lib/components/GroupCard.svelte';

  let groups = [];
  let filter = 0; // 0 = Semua

  async function fetchGroups() {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) groups = data;
  }

  onMount(fetchGroups);
</script>

<div class="page-container">
  <header>
    <h2>Komunitas</h2>
    <a href="/g/new" class="create-btn">Buat Grup</a>
  </header>

  <div class="filters">
    <button on:click={() => filter = 0}>Semua</button>
    <button on:click={() => filter = 2}>Group</button>
    <button on:click={() => filter = 3}>Federasi</button>
  </div>

  <div class="grid">
    {#each groups.filter(g => filter === 0 || g.level === filter) as group}
      <GroupCard {group} />
    {/each}
  </div>
</div>
