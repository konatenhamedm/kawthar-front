<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import Side from '../components/_includes/Side.svelte';
	import Footer from '../components/_includes/Footer.svelte';
	import { onMount } from 'svelte';
	import type { User } from '../types';
	import { getAuthCookie } from '$lib/auth';
	import Header from '../components/_includes/Header.svelte';

	let { children } = $props();
	let currentYear = new Date().getFullYear();
</script>

{#if $page.url.pathname.startsWith('/admin')}
	<Side user={"data"} />
	<div
		class="bg-normalBG dark:bg-main-dark relative flex flex-1 flex-col !transition-all delay-[0s] !duration-[0.2s] ease-linear xl:ps-[280px] xl:[&.TopExpanded]:ps-[0px] xl:[&.expanded]:ps-[80px]"
		id="content"
	>
		<Header user={"data"} />
		<main class="bg-normalBG dark:bg-main-dark">
			{@render children()}

			<Footer />
		</main>		
	</div>
{:else}
{@render children()}

{/if}
