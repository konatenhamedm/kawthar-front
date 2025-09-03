<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API, BASE_URL_API_UPLOAD } from '$lib/api';
	import * as cookie from 'cookie';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
	import InputTextArea from '$components/inputs/InputTextArea.svelte';
	import InputUserSelect from '$components/inputs/InputUserSelect.svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;

		let token: string | undefined;

	if (typeof window !== 'undefined') {
		const cookies = cookie.parse(document.cookie);
		const auth = JSON.parse(cookies.auth);
		token = auth.token; // Supposant que votre token est stocké dans un cookie nommé "token"
	}


	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	let userdata: any = [];

	// Initializing the user object with only email and status
	let item: any = {
		mission_id: '',
		entreprise: ''
	};

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		item.mission_id = data.id;
		item.entreprise = data.entrepriseMagasin;
	}
	async function SaveFunction() {
		isLoad = true;
		try {
			const response = await fetch(BASE_URL_API+ '/missions/getReport/' + data?.id, {
				method: 'GET',
			 headers: { 
					Accept: 'application/json', 
					Authorization: `Bearer ${token}` 
				},
			});

			if (!response.ok) {
				throw new Error('Erreur lors du téléchargement');
			}

			// Récupérer le blob et le nom du fichier
			const blob = await response.blob();

			// Essayer de récupérer le nom du fichier depuis les headers
			const contentDisposition = response.headers.get('Content-Disposition');
			let filename = 'rapport.xlsx'; // nom par défaut

			if (contentDisposition) {
				const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
				if (filenameMatch && filenameMatch[1]) {
					filename = filenameMatch[1];
				}
			}

			// Créer un URL temporaire pour le blob
			const url = window.URL.createObjectURL(blob);

			// Créer un élément anchor pour déclencher le téléchargement
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();

			// Nettoyer
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

			isLoad = false;
			open = false;
			notificationMessage = 'Téléchargement réussi';
			notificationType = 'success';
			showNotification = true;
		} catch (error) {
			isLoad = false;
			notificationMessage = error?.message || 'Une erreur est survenue';
			notificationType = 'error';
			showNotification = true;
			console.error('Error downloading:', error);
		}
	}

	function handleModalClose(event: Event) {
		if (isLoad) {
			event.preventDefault();
		}
	}
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-6 shadow">
	<!-- Card Body -->
	<div class="space-y-6">
		<form action="#" use:init>
			<!-- Champ Email -->
			<div class="grid grid-cols-1 gap-3">
				<!-- <InputSimple
					type="text"
					fieldName="libelle"
					label="Libelle"
					bind:field={item.libelle}
					placeholder="Entrez le nom entreprise"
				/> -->
				<InputSimple
					type="email"
					fieldName="email"
					label="Email"
					bind:field={item.email}
					placeholder="Entrez email"
				/>
			</div>
		</form>
	</div>

	<!-- Card Footer -->
	<div class="flex justify-end border-t border-gray-200 pt-4">
		{#if isLoad}
			<button
				disabled
				class="cursor-not-allowed rounded bg-blue-500 px-4 py-2 text-white opacity-50"
			>
				<div class="flex items-center space-x-2">
					<div class="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
					<span>Chargement...</span>
				</div>
			</button>
		{:else}
			<button
				on:click={SaveFunction}
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
			>
				Envoyer
			</button>
		{/if}
	</div>
</div>

<!-- Notification Component -->
{#if showNotification}
	<Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}
