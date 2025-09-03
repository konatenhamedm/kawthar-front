<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { BASE_URL_API, BASE_URL_API_UPLOAD } from '$lib/api';

	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
	import QrCode from '$components/inputs/QrCode.svelte';
	import ImageInputNew from '$components/inputs/ImageInputNew.svelte';
	import InputTextArea from '$components/inputs/InputTextArea.svelte';
	
	function cancelDelete() {
		open = false;
	}
	export let open: boolean = false; // modal control
	let isLoad = false;

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	// Initializing the user object with only email and status
	let item: any = {
		libelle: '',
		id: '',
		ref_article: '',
		description: '',
		missions_id: '',
		agent_create_id: '',
		nom_agent: '',
		entreprise_id: '',
		is_site_id: '',
		is_utilite_id: '',
		qr_bar_code: '',
		image_url: ''
	};

	export let data: Record<string, string> = {};

	// Variable pour contrôler l'affichage de l'image en grand
	let showLargeImage = false;
	let largeImageUrl = '';

	function init(form: HTMLFormElement) {
		((item.id = data?.id),
			(item.libelle = data?.libelle),
			(item.ref_article = data?.ref_article),
			(item.description = data?.description),
			(item.missions_id = data?.id),
			(item.nom_agent = data?.nom_agent),
			(item.agent_create_id = data?.agent_create),
			(item.entreprise_id = data?.entreprise),
			(item.is_site_id = data?.is_site_id),
			(item.is_utilite_id = data?.is_utilite_id),
			(item.qr_bar_code = data?.qr_bar_code),
			(item.image_url = data?.image_url));
	}

	onMount(() => {});

	function handleModalClose(event: Event) {
		if (isLoad) {
			event.preventDefault();
		}
	}

	// Fonction pour afficher l'image en grand
	function openLargeImage(url: string) {
		largeImageUrl = url;
		showLargeImage = true;
	}

	// Fonction pour fermer l'image en grand
	function closeLargeImage() {
		showLargeImage = false;
	}
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-[#d8cccc] p-2 shadow">
	<!-- Card Body -->
	<form action="#" use:init>
		<div class="space-y-6">
			<div
				class="text-surface shadow-secondary-1 dark:bg-surface-dark block rounded-lg bg-white dark:text-white"
			>
				<div
					class="flex flex-wrap items-center justify-between border-b-2 border-neutral-100 px-6 py-3 dark:border-white/10"
				>
					<h2>Agent <strong>({item.nom_agent})</strong></h2>
				</div>
				<div class="p-3">
					<!-- Nouvelle section pour afficher QR code et image côte à côte -->
					{#if item.qr_bar_code || item.image_url}
					<div class="flex flex-wrap items-start justify-between mb-6 gap-4">
						{#if item.qr_bar_code}
						<div class="flex flex-col items-center">
							<QrCode text={item.qr_bar_code} />
							<!-- <p class="mt-2 text-sm text-gray-600">Code QR</p> -->
						</div>
						{/if}
						
						{#if item.image_url}
						<div class="flex flex-col items-center">
							<div class="border rounded-lg p-2 bg-white shadow-sm cursor-pointer" on:click={() => openLargeImage(item.image_url)}>
								<img 
									src={BASE_URL_API_UPLOAD + item.image_url} 
									alt="Image de l'article" 
									class="max-w-[150px] max-h-[150px] object-contain"
								/>
							</div>
							<!-- <p class="mt-2 text-sm text-gray-600">Cliquez pour agrandir</p> -->
						</div>
						{/if}
					</div>
					{/if}
					
					<div class="mb-3 grid grid-cols-3 gap-3">
						<InputSimple
							type="text"
							fieldName="libelle"
							label="Libellé"
							bind:field={item.libelle}
							placeholder="Entrez le libelle"
						/>
						<InputSimple
							type="text"
							fieldName="ref_article"
							label="Ref article"
							bind:field={item.ref_article}
							placeholder="Entrez la ref article"
						/>
						<InputSimple
							type="text"
							fieldName="is_site_id"
							label="Site"
							bind:field={item.is_site_id}
							placeholder="Entrez la ref article"
						/>
					</div>
					<div class="mb-3 grid grid-cols-3 gap-3">
						<InputSimple
							type="text"
							fieldName="is_utilite_id"
							label="Utilité"
							bind:field={item.is_utilite_id}
							placeholder="Entrez la ref article"
						/>
						<InputSimple
							type="text"
							fieldName="is_site_id"
							label="Site"
							bind:field={item.is_site_id}
							placeholder="Entrez la ref article"
						/>
							<InputSimple
							type="text"
							fieldName="description"
							label="Description"
							bind:field={item.description}
							placeholder="Entrez une description"
						/>
					<!-- 	<ImageInputNew
							label="Image"
							fieldName="image_url"
							bind:field={item.image_url}
							placeholder="Sélectionnez une image"
							showPreview={true}
							link={item.image_url ? item.image_url : ''}
						/> -->
					</div>

					<div class="mb-3 grid grid-cols-3 gap-3 border-b-2 border-black">
						<InputTextArea
						fieldName="observation"
						label="Observation"
						bind:field={item.observation}
						placeholder="Entrez une observation"
					/>
					</div>
				</div>
			</div>
		</div>
	</form>
	<!-- Card Footer -->
	<div class="flex justify-end border-t border-gray-200 pt-4">
		<button
			style="margin-right: 9px;"
			on:click={cancelDelete}
			disabled={isLoad}
			class="mr-[9px] rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
		>
			Annuler
		</button>
	</div>
</div>

<!-- Overlay pour l'image en grand -->
{#if showLargeImage}
<div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" on:click={closeLargeImage}>
	<div class="max-w-4xl max-h-screen p-4" on:click|stopPropagation>
		<button 
			class="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 z-10"
			on:click={closeLargeImage}
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
		<img 
			src={BASE_URL_API_UPLOAD + largeImageUrl} 
			alt="Image agrandie" 
			class="max-w-full max-h-screen object-contain"
		/>
	</div>
</div>
{/if}

<!-- Notification Component -->
{#if showNotification}
	<Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}

<style>
	.fixed {
		position: fixed;
	}
	.absolute {
		position: absolute;
	}
	.inset-0 {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	.z-50 {
		z-index: 50;
	}
	.z-10 {
		z-index: 10;
	}
	.max-h-screen {
		max-height: 100vh;
	}
	.object-contain {
		object-fit: contain;
	}
</style>