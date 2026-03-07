<script>
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  
  export let group_id = null; // Opsional: kalau posting di dalam grup
  
  let content = '';
  let loading = false;
  let fileInput;

  async function handleSubmit() {
    loading = true;
    const { data: { user } } = await supabase.auth.getUser();
    
    // Ambil author_id dari tabel accounts (kita cari berdasarkan auth_id)
    const { data: account } = await supabase
      .from('accounts')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    const { error } = await supabase.from('posts').insert([
      { 
        author_id: account.id, 
        group_id, 
        content,
        privacy: group_id ? 'group_only' : 'public'
      }
    ]);

    if (!error) goto('/');
    loading = false;
  }
</script>

<form class="post-form" on:submit|preventDefault={handleSubmit}>
  <textarea 
    bind:value={content} 
    placeholder="Apa yang sedang terjadi?" 
    required 
  />
  
  <div class="actions">
    <button type="button" class="icon-btn" on:click={() => fileInput.click()}>
      <span class="material-icons">image</span>
    </button>
    <input type="file" bind:this={fileInput} hidden accept="image/*" />
    
    <button type="submit" disabled={loading || !content}>
      {loading ? 'Mengirim...' : 'Posting'}
    </button>
  </div>
</form>

<style>
  .post-form {
    padding: var(--space-md);
    border-bottom: 1px solid var(--border-subtle);
  }
  textarea {
    width: 100%;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 1.2rem;
    resize: none;
    min-height: 100px;
    font-family: var(--font-main);
  }
  textarea:focus { outline: none; }
  
  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--space-sm);
  }
  
  .icon-btn { background: none; border: none; color: var(--accent); cursor: pointer; }
  
  button[type="submit"] {
    background: var(--accent);
    color: white;
    border: none;
    padding: var(--space-xs) var(--space-xl);
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
  }
  button[type="submit"]:disabled { opacity: 0.5; }
</style>
