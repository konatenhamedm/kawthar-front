<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API, BASE_URL_API_UPLOAD } from '$lib/api';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
	import type { User } from '../../../types';
	import InputTextArea from '$components/inputs/InputTextArea.svelte';
	import InputUserSelect from '$components/inputs/InputUserSelect.svelte';
	import InputMultiSelect from '$components/inputs/InputMultiSelect.svelte';
	import InputMultiSelectUser from '$components/inputs/InputMultiSelectUser.svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	let userdata: any = [];

	// Initializing the user object with only email and status
	let item: any = {
		libelle: '',
		description: '',
		chef_equipe_id: '',
		agents: []
	};

	// Ajout des messages d'erreur
	let errors: any = {
		libelle: '',
		chef_equipe_id: '',
		agents: '',
		description: ''
	};

	export let data: Record<string, string> = {};
	function init(form: HTMLFormElement) {}

	async function getData() {
		try {
			const res = await apiFetch(false, '/auth/agent/all');
			const data = res.data;

			console.log("====",data)

			userdata = data;
		} catch (error) {
			console.error('Error fetching villes:', error);
		}
	}

	onMount(async () => {
		await getData();
	});

	interface Item {
		id: any;
		nom: any;
		prenoms: any;
	}
	function agentIds(source:any) {
		return  source.map((item: Item) => item.id);
		
	}

	// Fonction de validation
	function validateForm() {
		let isValid = true;
		errors = { chef_equipe_id: '', agents: '', description: '' };

		/* if (!item.libelle.trim()) {
			errors.libelle = 'Le libellé est requis';
			isValid = false;
		} */

		if (!item.chef_equipe_id) {
			errors.chef_equipe_id = 'Le chef d\'équipe est requis';
			isValid = false;
		}

		if (!item.agents || item.agents.length === 0) {
			errors.agents = 'Au moins un agent doit être sélectionné';
			isValid = false;
		}

		return isValid;
	}

	async function SaveFunction() {
		// Validation avant envoi
		if (!validateForm()) {
			notificationMessage = 'Veuillez renseigner  les champs requis du formulaire';
			notificationType = 'error';
			showNotification = true;
			return;
		}

		console.log(agentIds(item.agents))
		isLoad = true;
		try {
			const res = await apiFetch(true, '/equipes/create', 'POST', {
				libelle: item.libelle,
				description: item.description,
				chef_equipe_id: item.chef_equipe_id,
				agents: agentIds(item.agents)
			});

			if (res) {
				isLoad = false;
				open = false;
				notificationMessage = res.message;
				notificationType = 'success';
				showNotification = true;
			} else {
				notificationMessage = 'Une erreur est survenue';
				notificationType = 'error';
				showNotification = true;
			}
		} catch (error) {
			isLoad = false;

			// Afficher une notification d'erreur
			notificationMessage = 'Veuillez renseigner  les champs requis du formulaire';
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

	let selected: any = [];
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-6 shadow">
	<!-- Card Body -->
	<div class="space-y-6">
		<form action="#" use:init>
			<!-- Champ Email -->
			<div class="grid grid-cols-2 gap-3">
				<InputSimple
					type="text"
					fieldName="libelle"
					label="Libelle"
					bind:field={item.libelle}
					required={true}
					error={errors.libelle}
					placeholder="Entrez le nom de l'équipe"
				/>

				<InputUserSelect
					label="Chef équipe"
					bind:selectedId={item.chef_equipe_id}
					datas={userdata}
					id="chef_equipe_id"
					required={true}
					error={errors.chef_equipe_id}
					
				/>
			</div>
			<div class="grid grid-cols-1 gap-3">
				<InputMultiSelectUser 
					options={userdata} 
					bind:selected={item.agents} 
					
				/>
				{#if errors.agents}
					<p class="mt-1 text-sm text-red-500">{errors.agents}</p>
				{/if}
			</div>

			<div class="grid grid-cols-1 gap-3">
				<InputTextArea
					fieldName="description"
					label="Description"
					bind:field={item.description}
					placeholder="Entrez la description"
					
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