<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    label?: string;
  }

  let { value = $bindable(), type = 'text', placeholder = '', id = '', label = '', required = false, ...props }: Props = $props();
</script>

<div class="input-container">
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <input
    {id}
    {type}
    {placeholder}
    {required}
    bind:value
    class="input-field"
    {...props}
  />
</div>

<style>
  .input-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  label {
    font-size: 0.9rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .input-field {
    background: var(--surface);
    color: var(--text);
    border: var(--border-width) solid var(--border);
    padding: var(--padding-y) var(--padding-x);
    border-radius: var(--radius);
    transition: border-color var(--motion-normal);
    width: 100%;
  }

  .input-field:focus {
    outline: none;
    border-color: var(--border-focus);
  }

  .input-field::placeholder {
    color: var(--text-muted);
    opacity: 0.6;
  }
</style>
