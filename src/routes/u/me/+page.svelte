<script lang="ts">
import "$lib/styles/tokens.css"

import { supabase } from "$lib/supabase"
import { onMount } from "svelte"
import { goto } from "$app/navigation"

let user = null

onMount(async () => {

  const { data } = await supabase.auth.getSession()

  if(!data.session){

    goto("/auth/login")
    return

  }

  user = data.session.user

})

</script>
<div class="page">

<div class="card">

<h2>My Account</h2>

<p>Email</p>

<strong>{data.user.email}</strong>

</div>

</div>

<style>
:root{
--bg-primary:#000;
--text-primary:#fff;}
.page{

min-height:100vh;

background:var(--bg-primary);

color:var(--text-primary);

display:flex;

justify-content:center;

padding:40px;

}

.card{

width:500px;

background:var(--bg-surface);

padding:24px;

border-radius:10px;

border:1px solid var(--border-subtle);

}

</style>
