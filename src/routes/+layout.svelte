<script>
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="stylesheet" href="agnonion.css"/>
</svelte:head>

{@render children()}
