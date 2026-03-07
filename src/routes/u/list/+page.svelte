<script lang="ts">

import { onMount } from "svelte"
import { supabase } from "$lib/supabase"
import "$lib/styles/tokens.css"

let users = []
let loading = true
let error = ""

async function loadUsers(){

  loading = true

  const { data, error:err } = await supabase
    .from("accounts")
    .select("id, username, display_name, avatar_url, created_at")

  if(err){

    console.error(err)
    error = err.message

  }else{

    users = data

  }

  loading = false
}

onMount(loadUsers)

</script>

<div class="page">

  <div class="container">

    <h1>Users</h1>

    {#if loading}
      <p>Loading users...</p>
    {/if}

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <div class="list">

      {#each users as user}

        <div class="user">

          <img
            src={user.avatar_url || "https://api.dicebear.com/7.x/identicon/svg?seed="+user.username}
            alt="avatar"
          />

          <div class="info">

            <strong>{user.display_name || user.username}</strong>

            <span>@{user.username}</span>

          </div>

        </div>

      {/each}

    </div>

  </div>

</div>

<style>

.page{

  min-height:100vh;

  background:var(--bg-primary);
  color:var(--text-primary);

  display:flex;
  justify-content:center;

}

.container{

  width:600px;

  padding:32px;

}

h1{

  margin-bottom:20px;

}

.list{

  display:flex;
  flex-direction:column;

  gap:12px;

}

.user{

  display:flex;
  align-items:center;

  gap:12px;

  padding:12px;

  background:var(--bg-surface);

  border:1px solid var(--border-subtle);

  border-radius:10px;

}

img{

  width:40px;
  height:40px;

  border-radius:50%;

}

.info{

  display:flex;
  flex-direction:column;

}

span{

  font-size:13px;
  color:var(--text-secondary);

}

.error{

  color:#ff5555;

}

</style>
