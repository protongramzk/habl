<script>
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let name = '', description = '', is_public = true;
  let fileInput;
  let loading = false;

  async function handleSubmit() {
    loading = true;
    const file = fileInput?.files[0];
    let banner_url = null;

    try {
      // 1. Ambil user Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // 2. Ambil account di tabel accounts
      const { data: accounts, error: accountError } = await supabase
        .from('accounts')
        .select('*')
        .eq('auth_id', user.id)
        .single();
      if (accountError) throw accountError;
      const account = accounts;

      // 3. Upload banner ke storage jika ada
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('groups_cover')
          .upload(`banners/${fileName}`, file);

        if (uploadError) throw uploadError;

        // Ambil public URL
        const { data: publicData } = supabase
          .storage
          .from('groups_cover')
          .getPublicUrl(`banners/${fileName}`);
        banner_url = publicData.publicUrl;
      }

      // 4. Insert ke tabel groups
      const { error: insertError } = await supabase.from('groups').insert([{
        name,
        description,
        is_public,
        avatar_url: banner_url,
        level: 2, // Default level 2 (Group)
        owner_id: account.id
      }]);
      if (insertError) throw insertError;

      // 5. Redirect ke halaman grup
      goto('/g');
    } catch (err) {
      alert(err.message);
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="group-form">
  <input type="text" bind:value={name} placeholder="Nama Grup" required />
  <textarea bind:value={description} placeholder="Deskripsi"></textarea>
  <input type="file" bind:this={fileInput} accept="image/*" />
  <button type="submit" disabled={loading}>
    {loading ? 'Memproses...' : 'Buat Grup'}
  </button>
</form>
