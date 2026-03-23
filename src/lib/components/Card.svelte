<script lang="ts">
  let { children, class: className = '', padding = true, ...props } = $props();
</script>

<div class="card {className}" class:no-padding={!padding} {...props}>
  {@render children()}
</div>

<style>
  .card {
    background: var(--surface);
    border: var(--border-width) solid var(--border);
    border-radius: var(--radius);
    padding: var(--padding-y) var(--padding-x);
    transition: border-color var(--motion-normal);
  }

  .card.no-padding {
    padding: 0;
  }
</style>
