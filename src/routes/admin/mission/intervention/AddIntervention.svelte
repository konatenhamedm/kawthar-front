<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API, BASE_URL_API_UPLOAD } from '$lib/api';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
	import InputTextArea from '$components/inputs/InputTextArea.svelte';
	import InputUserSelect from '$components/inputs/InputUserSelect.svelte';
	import InputMultiSelect from '$components/inputs/InputMultiSelect.svelte';
	import InputMultiSelectUser from '$components/inputs/InputMultiSelectUser.svelte';
	import ImageInputNew from '$components/inputs/ImageInputNew.svelte';
	import * as cookie from 'cookie';
	import { createEventDispatcher } from 'svelte';


	const dispatch = createEventDispatcher();

	export let open: boolean = false; // modal control
	let isLoad = false;

	let token: string | undefined;

	if (typeof window !== 'undefined') {
		const cookies = cookie.parse(document.cookie);
		const auth = JSON.parse(cookies.auth);
		token = auth.token;
	}

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	let userdata: any = [];

	let equipes: any = [];
	let entreprises: any = [];
	let natures: any = [];
	let sites: any = [];
	let utilites: any = [];

	let types: any = [];
	let mission : any = "";

	// Initializing the user object with only email and status
	let item: any = {
		libelle: '',
		ref_article: '',
		description: '',
		agent_create: '',
		entreprise: '',
		/* mission_id: '', */
		qr_bar_code: '',
		site: '',
		utilite: '',
		image_url: '',
		quantite: 0,
		observation: '',
		personne_detentrice: '',
		/* entreprise_magasin_id: '' */
	};

	export let data: Record<string, string> = {};
	function init(form: HTMLFormElement) {
		console.log('===', data);
		mission = data.mission
	}

	async function getData() {
		try {
			const res = await apiFetch(true, '/parameters');
			const data = res.data;

			equipes = data.equipes;
			entreprises = data.entreprises;
			types = data.type_missions;
			sites = data.sites;
			utilites = data.utilites;
			console.log('', entreprises);
		} catch (error) {
			console.error('Error fetching villes:', error);
		}
	}

	async function getDataUser() {
		try {
			const res = await apiFetch(false, '/auth/agent/all');
			const data = res.data;

			userdata = data;
		} catch (error) {
			console.error('Error fetching villes:', error);
		}
	}

	onMount(async () => {
		await getData();
		await getDataUser();
	});

	interface Item {
		id: any;
		nom: any;
		prenoms: any;
	}

	async function SaveFunction() {
		isLoad = true;

		try {
			const formData = new FormData();

			// Ajouter tous les champs avec les bons noms
			formData.append('mission_id', mission);

					formData.append(`lignes[0][id]`,'');
				formData.append(`lignes[0][libelle]`, item.libelle ?? '');
				formData.append(`lignes[0][ref_article]`, item.ref_article ?? '');
				formData.append(`lignes[0][agent_create_id]`, item.agent_create_id ?? '');
				formData.append(`lignes[0][description]`, item.description ?? '');
				formData.append(`lignes[0][mission_id]`, mission ?? '');
				formData.append(`lignes[0][entreprise_magasin_id]`, data.entreprise_id ?? '');
				formData.append(`lignes[0][is_site_id]`, item.is_site_id ?? '');
				formData.append(`lignes[0][is_utilite_id]`, item.is_utilite_id ?? '');
				formData.append(`lignes[0][observation]`, item.observation ?? '');
				formData.append(`lignes[0][personne_detentrice]`, item.personne_detentrice ?? '');
				// Envoi du fichier image s'il existe
				if (item.image_url instanceof File) {
					formData.append(`lignes[0][image_url]`, item.image_url);
				}


			// Debug: afficher le contenu de FormData
			for (let [key, value] of formData.entries()) {
				console.log(`${key}: ${value}`);
			}

			const res = await fetch(BASE_URL_API + '/ligneInventaires/stock/multiple/create', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: formData
			});

			const responseData = await res.json();

			if (res.ok) {
				isLoad = false;
				open = false;
				notificationMessage = 'Article enregistré avec succès !';
				notificationType = 'success';
				showNotification = true;
				
				// Émettre un événement pour informer le parent
				dispatch('saved', { success: true, data: responseData });
			} else {
				isLoad = false;
				notificationMessage = responseData.message || 'Erreur lors de l\'enregistrement.';
				notificationType = 'error';
				showNotification = true;
			}
		} catch (error) {
			isLoad = false;
			notificationMessage = error.message || 'Erreur inconnue.';
			notificationType = 'error';
			showNotification = true;
			console.error('Erreur lors de la sauvegarde :', error);
		}
	}



	let selected: any = [];
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-2 shadow">
	<!-- Card Body -->
	<div class="space-y-6">
		<form action="#" use:init>
			<!-- Champ Email -->
			<div class="p-3">
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
					<InputSelect
						label="Site"
						bind:selectedId={item.is_site_id}
						datas={sites}
						id="is_site_id"
					/>
				</div>
				<div class="mb-3 grid grid-cols-3 gap-3">
					<InputSelect
						label="Utilité"
						bind:selectedId={item.is_utilite_id}
						datas={utilites}
						id="is_utilite_id"
					/>

					<InputUserSelect
						label="Agent"
						bind:selectedId={item.agent_create_id}
						datas={userdata}
						id="agent_create_id"
					/>
					<ImageInputNew
						label="Image"
						fieldName="image_url"
						bind:field={item.image_url}
						placeholder="Sélectionnez une image"
						showPreview={true}
						link={item.image_url ? item.image_url : ''}
					/>
				</div>
				<div class="mb-3 grid grid-cols-3 gap-3">
					<InputSimple
						type="text"
						fieldName="quantite"
						label="Quantité"
						bind:field={item.quantite}
						placeholder="Entrez la quantite"
					/>
					<InputSimple
						type="text"
						fieldName="description"
						label="Description"
						bind:field={item.description}
						placeholder="Entrez une description"
					/>
					<InputSimple
						type="text"
						fieldName="personne_detentrice"
						label="Personne detentrice"
						bind:field={item.personne_detentrice}
						placeholder="Entrez une personne detentrice"
					/>
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
