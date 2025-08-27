<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API, BASE_URL_API_UPLOAD } from '$lib/api';
	
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
	import type { User } from '../../../types';
	import InputTextArea from '$components/inputs/InputTextArea.svelte';
	import InputUserSelect from '$components/inputs/InputUserSelect.svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	let userdata : any = [];

	// Initializing the user object with only email and status
	let item: any = {
		libelle: '',
	};

	export let data: Record<string, string> = {};



	function init(form: HTMLFormElement) {}
	

	async function SaveFunction() {
		isLoad = true;
		try {
			const res = await apiFetch(true,'/natureImmobilisations/create','POST',{
					libelle: item.libelle
				});
			
			if (res) {
				isLoad = false;
				open = false;
				notificationMessage = res.message;
				notificationType = 'success';
				showNotification = true;
			} else  {
				
				notificationMessage = 'Une erreur est ';
				notificationType = 'error';
				showNotification = true;
			}
		} catch (error) {
			isLoad = false;

			// Afficher une notification d'erreur
			notificationMessage = error?.message;
			notificationType = 'error';
			showNotification = true;

			console.error('Error saving:', error);
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
				<InputSimple
					type="text"
					fieldName="libelle"
					label="Libelle"
					bind:field={item.libelle}
					placeholder="Entrez le nom de l'équipe"
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
				Enregistrer
			</button>
		{/if}
	</div>
</div>

<!-- Notification Component -->
{#if showNotification}
	<Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}
