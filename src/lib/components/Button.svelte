<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?: 'default' | 'primary';
  }

  let { children, type = 'button', variant = 'default', onclick, disabled = false, ...props }: Props = $props();
</script>

<button {type} {onclick} {disabled} class="btn {variant}" {...props}>
  {@render children?.()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--padding-y) var(--padding-x);
    border-radius: var(--radius);
    border: var(--border-width) solid var(--border);
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
    font-weight: 500;
    transition: border-color var(--motion-normal), opacity var(--motion-normal);
  }

  .btn:hover:not(:disabled) {
    border-color: var(--border-hover);
  }

  .btn:active:not(:disabled) {
    opacity: var(--opacity-active);
  }

  .btn:focus {
    outline: none;
    border-color: var(--border-focus);
  }

  .btn:disabled {
    opacity: var(--opacity-disabled);
    color: var(--text-muted);
    pointer-events: none;
  }

  .btn.primary {
    background: var(--primary-bg);
    color: var(--primary-text);
    border-color: var(--primary-bg);
  }
</style>
