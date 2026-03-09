<script>
  import { supabase } from '$lib/supabase'; // Sesuaikan path import kamu
  import { goto } from '$app/navigation';
  
  export let group_id = null; // Opsional: kalau posting di dalam grup [cite: 2]
  
  let content = '';
  let loading = false;
  let fileInput;
  
  // State untuk multiple images
  let files = [];
  let previews = [];

  // Handle saat user milih gambar
  function handleFileSelect(event) {
    const selectedFiles = Array.from(event.target.files);
    files = [...files, ...selectedFiles];
    
    // Bikin URL lokal untuk preview
    previews = files.map(file => URL.createObjectURL(file));
  }

  // Handle hapus gambar dari preview
  function removeImage(index) {
    files = files.filter((_, i) => i !== index);
    previews = previews.filter((_, i) => i !== index);
  }

  async function handleSubmit() {
    loading = true;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Ambil author_id dari tabel accounts [cite: 4]
      const { data: account } = await supabase
        .from('accounts')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      let uploaded_urls = [];

      // 1. Upload file ke Supabase Storage (kalau ada file)
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `${account.id}/${fileName}`; // Kelompokkan berdasarkan ID user

          // Upload ke bucket bernama 'posts'
          const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          // Dapatkan URL publik dari gambar yang baru diupload
          const { data: { publicUrl } } = supabase.storage
            .from('posts')
            .getPublicUrl(filePath);

          uploaded_urls.push(publicUrl);
        }
      }

      // 2. Insert ke database tabel posts
      const { error } = await supabase.from('posts').insert([
        { 
          author_id: account.id, 
          group_id, 
          content,
          media_urls: uploaded_urls, // Masukkan array URL gambar ke DB
          privacy: group_id ? 'group_only' : 'public'
        }
      ]);

      if (error) throw error;
      
      // Reset form & navigasi
      content = '';
      files = [];
      previews = [];
      goto('/'); // [cite: 6]
      
    } catch (err) {
      alert('Gagal memposting: ' + err.message);
    } finally {
      loading = false;
    }
  }
</script>

<form class="post-form" on:submit|preventDefault={handleSubmit}>
  <textarea 
    bind:value={content} 
    placeholder="Apa yang sedang terjadi?" 
    required={files.length === 0} 
  />

  {#if previews.length > 0}
    <div class="preview-container">
      {#each previews as src, i}
        <div class="preview-box">
          <img {src} alt="Preview" />
          <button type="button" class="remove-btn" on:click={() => removeImage(i)}>
            <span class="material-icons">close</span>
          </button>
        </div>
      {/each}
    </div>
  {/if}
  
  <div class="actions">
    <button type="button" class="icon-btn" on:click={() => fileInput.click()}>
      <span class="material-icons">image</span>
    </button>
    <input type="file" bind:this={fileInput} hidden accept="image/*" multiple on:change={handleFileSelect} />
    
    <button type="submit" disabled={loading || (!content && files.length === 0)}>
      {loading ? 'Mengirim...' : 'Posting'}
    </button>
  </div>
</form>

<style>
  .post-form {
    padding: var(--space-lg);
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
    margin-bottom: var(--space-lg);
  }

  textarea {
    width: 100%;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 1.2rem;
    resize: none;
    min-height: 80px;
    font-family: var(--font-main);
  }
  
  textarea:focus { outline: none; }

  /* Styling Preview Gambar */
  .preview-container {
    display: flex;
    overflow-x: auto;
    gap: var(--space-md);
    padding: var(--space-sm) 0;
    margin-top: var(--space-sm);
    /* Sembunyikan scrollbar agar lebih estetik */
    scrollbar-width: none; 
  }
  .preview-container::-webkit-scrollbar { display: none; }

  .preview-box {
    position: relative;
    flex: 0 0 auto; /* Supaya ga menyusut */
  }

  .preview-box img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
  }

  .remove-btn {
    position: absolute;
    top: var(--space-xs);
    right: var(--space-xs);
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    backdrop-filter: blur(4px);
  }
  
  .remove-btn .material-icons { font-size: 18px; }

  /* Styling Actions */
  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--space-md);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--border-subtle);
  }
  
  .icon-btn { 
    background: none; 
    border: none; 
    color: var(--accent); 
    cursor: pointer; 
    padding: var(--space-xs);
    border-radius: 50%;
    transition: background 0.2s;
  }
  
  .icon-btn:hover { background: rgba(29, 155, 240, 0.1); }
  
  button[type="submit"] {
    background: var(--accent);
    color: white;
    border: none;
    padding: var(--space-sm) var(--space-xl);
    border-radius: 50px; /* Bentuk pill/kapsul Material 3 */
    font-weight: bold;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  button[type="submit"]:hover:not(:disabled) {
    background: var(--accent-hover);
  }
  
  button[type="submit"]:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
  }
</style>
