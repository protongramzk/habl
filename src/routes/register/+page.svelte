<svelte:head>
  <title>Register</title>
</svelte:head>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase/client';
  import { accounts } from '$lib/supabase/accounts';

  let email = '';
  let password = '';
  let username = '';
  let error = '';
  let success = '';

  async function handleRegister() {
    error = '';
    success = '';

    // Create user in Supabase Auth
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      error = authError.message;
      return;
    }

    // Create account in Supabase DB
    const { error: dbError } = await accounts.create({
      username,
      email,
    });

    if (dbError) {
      error = dbError.message;
      return;
    }

    success = 'Registration successful! Redirecting to login...';
    setTimeout(() => goto('/login'), 1000);
  }
</script>

<div class="register-container">
  <h1>Register</h1>
  
  {#if error}
    <p class="error">{error}</p>
  {/if}
  
  {#if success}
    <p class="success">{success}</p>
  {/if}
  
  <form on:submit|preventDefault={handleRegister}>
    <label for="email">Email</label>
    <input type="email" id="email" bind:value={email} required />

    <label for="username">Username</label>
    <input type="text" id="username" bind:value={username} required />

    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} required />

    <button type="submit">Register</button>
  </form>
  
  <p>
    Already have an account? <a href="/login">Login here</a>
  </p>
</div>

<style>
  .register-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .register-container h1 {
    text-align: center;
  }
  
  .register-container form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .register-container label {
    font-weight: bold;
  }
  
  .register-container input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .register-container button {
    padding: 10px;
    background-color: #0077b6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .register-container button:hover {
    background-color: #023e8a;
  }
  
  .error {
    color: red;
  }
  
  .success {
    color: green;
  }
</style>