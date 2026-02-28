<script>
	import '$lib/styles/agnonion.css';
	import '$lib/styles/default.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>Habl Ecosystem</title>
</svelte:head>

{@render children()}
