<script lang="ts">
	import { BASE_URL_API_UPLOAD } from './../../../../lib/api.ts';
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
	import InputDateSimple from '$components/inputs/InputDateSimple.svelte';
	import InputTextArea from '$components/inputs/InputTextArea.svelte';
	import InputUserSelect from '$components/inputs/InputUserSelect.svelte';
	import InputMultiSelect from '$components/inputs/InputMultiSelect.svelte';
	import AutreInputSimple from '$components/inputs/AutreInputSimple.svelte';
	import type { MissionEdit } from '../../../../types';
	import ImageInputNew from '$components/inputs/ImageInputNew.svelte';
	import QrCode from '$components/inputs/QrCode.svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';
	let equipes: any = [];
	let entreprises: any = [];
	let natures: any = [];
	let etats: any = [];
	let emplacements: any = [];
	let userdata: any = [];
	let types: any = [];
	// Initializing the user object with only email and status

	interface LigneInventaireFormatee {
		id: any;
		idF: any;
		libelle: string;
		ref_article: string;
		description: string;
		agent_create_id: any;
		entreprise_id: any;
		qr_bar_code:any,
		missions_id: any;
		emplacement_id: any;
		nature_id: any;
		etat_id: any;
		date_acquisition: string; // ISO yyyy‑MM‑dd
		date_mise_en_service: string; // ISO yyyy‑MM‑dd
		cout_acquisition: any;
		image_url: any;
	}

	interface Mission {
		id: any;
		libelle: string;
		date_debut: string;
		entreprise_id: string | null;
		entrepriseMagasin: any[]; // → remplacez `any` par votre vrai type
		ligneEquipes: any[]; // idem
		typeMission: any[]; // idem
		description: string;
		mission_id: any;
		adresse_mission: string;
		date_fin: string;
		type_mission_id: string | null;
		inventaires: LigneInventaireFormatee[];
	}

	let mission: Mission = {
		id: '',
		libelle: '',
		date_debut: '',
		mission_id: '',
		entreprise_id: null,
		entrepriseMagasin: [],
		ligneEquipes: [],
		typeMission: [],
		description: '',
		adresse_mission: '',
		date_fin: '',
		type_mission_id: null,
		inventaires: []
	};

	function formatDate(value: any): string {
		if (!value || typeof value !== 'string') return '';
		const date = new Date(value);
		if (isNaN(date.getTime())) return '';
		return date.toISOString().split('T')[0];
	}

	/* 	function formatDate(dateString: string): string {
		return new Date(dateString).toISOString().split('T')[0];
	} */
	function formatLignesInventaire(source = []) {
		return source.map((item: any) => ({
			id: item.id,
			idF: item.id, // ou un autre identifiant si différent
			libelle: item.libelle,
			ref_article: item.ref_article,
			description: item.description,
			missions_id: data?.id,
			agent_create_id: item.agent_create.id,
			entreprise_id: item.entreprise?.id,
			emplacement_id: item.emplacement ? item.emplacement.id : null,
			nature_id: item.nature ? item.nature.id : null,
			etat_id: item.etat ? item.etat.id : null,
			qr_bar_code: item.qr_bar_code,
			date_acquisition: formatDate(item.date_acquisition),
			date_mise_en_service: formatDate(item.date_mise_en_service),
			cout_acquisition: item.cout_acquisition,
			image_url: BASE_URL_API_UPLOAD + item.image_url
		}));
	}

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		((mission.libelle = data?.libelle),
			(mission.date_debut = data?.date_debut),
			(mission.entreprise_id = data?.entrepriseMagasin != null ? data?.entrepriseMagasin.id : null),
			(mission.type_mission_id = data?.typeMission != null ? data?.typeMission.id : null),
			(mission.description = data?.description),
			(mission.date_fin = data?.date_fin),
			(mission.adresse_mission = data?.adresse_mission),
			(mission.inventaires = formatLignesInventaire(data?.inventaires)));
	}

	async function getData() {
		try {
			const res = await apiFetch(true, '/parameters');
			const data = res.data;

			equipes = data.equipes;
			entreprises = data.entreprises;
			types = data.type_missions;
			natures = data.natures;
			emplacements = data.emplacements;
			etats = data.etats;
			console.log('', entreprises);
		} catch (error) {
			console.error('Error fetching villes:', error);
		}
	}

	async function getDataUser() {
		try {
			const res = await apiFetch(false, '/auth/users/all');
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

	/* 	function formatDate(dateString: string | null | undefined): string {
	if (!dateString) return '';
	const date = new Date(dateString);
	return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
} */

	async function SaveFunction() {
		isLoad = true;

		try {
			const formData = new FormData();

			// Champs mission principaux
			formData.append('mission_id', data?.id ?? '');

			// Champs des lignes d'inventaire
			mission.inventaires.forEach((item: LigneInventaireFormatee, index) => {
				formData.append(`lignes[${index}][id]`, item.id ?? '');
				formData.append(`lignes[${index}][libelle]`, item.libelle ?? '');
				formData.append(`lignes[${index}][ref_article]`, item.ref_article ?? '');
				formData.append(`lignes[${index}][description]`, item.description ?? '');
				formData.append(`lignes[${index}][agent_create_id]`, item.agent_create_id ?? '');
				formData.append(`lignes[${index}][missions_id]`, data?.id ?? '');
				formData.append(`lignes[${index}][entreprise_magasin_id]`, item.entreprise_id ?? '');
				formData.append(`lignes[${index}][ii_emplacement_id]`, item.emplacement_id ?? '');
				formData.append(`lignes[${index}][ii_nature_id]`, item.nature_id ?? '');
				formData.append(`lignes[${index}][ii_etat_id]`, item.etat_id ?? '');
				formData.append(`lignes[${index}][ii_date_acquisition]`, formatDate(item.date_acquisition));
				formData.append(
					`lignes[${index}][ii_date_mise_en_service]`,
					formatDate(item.date_mise_en_service)
				);
				formData.append(`lignes[${index}][ii_cout_acquisition]`, item.cout_acquisition ?? '');

				// Envoi du fichier image s'il existe
				if (item.image_url instanceof File) {
					formData.append(`lignes[${index}][image_url]`, item.image_url);
				}
			});

			for (const [key, value] of formData.entries()) {
				console.log(`${key}:`, value);
			}
			// Appel API avec FormData
			/* 		const res = await apiFetch(true, '/ligneInventaires/immo/multiple/create', 'POST', formData, {
			headers: {
				Accept: 'application/json'
			}
		}); */

			const res = await fetch(BASE_URL_API + '/ligneInventaires/immo/multiple/create', {
				method: 'POST',
				headers: { Accept: 'application/json' },
				body: formData
			});

			if (res.ok) {
				isLoad = false;
				open = false;
				notificationMessage = 'Mission enregistrée avec succès !';
				notificationType = 'success';
				showNotification = true;
			} else {
				isLoad = false;
				notificationMessage = res.message || 'Erreur lors de l’enregistrement.';
				notificationType = 'error';
				showNotification = true;
			}
		} catch (error) {
			isLoad = false;
			notificationMessage = error?.message ?? 'Erreur inconnue.';
			notificationType = 'error';
			showNotification = true;
			console.error('Erreur lors de la sauvegarde :', error);
		}
	}

	function handleModalClose(event: Event) {
		if (isLoad) {
			event.preventDefault();
		}
	}

	// Ajouter une nouvelle ligne d'intervention
	function ajouterIntervention(): void {
		mission.inventaires = [
			...mission.inventaires,
			{
				idF: Date.now(),
				id: '',
				qr_bar_code: '',
				libelle: '',
				ref_article: '',
				etat_id: '',
				emplacement_id: '',
				missions_id: mission.id,
				entreprise_id: mission.entreprise_id,

				nature_id: '',
				cout_acquisition: '',
				date_acquisition: '',
				agent_create_id: '',
				date_mise_en_service: '',
				image_url: '',

				description: ''
			}
		];
	}

	async function confirmDelete(id: any) {
		try {
			const res = await apiFetch(true, '/ligneInventaires/delete/' + id, 'DELETE');

			return res;
		} catch (error) {
			console.error('Error deleting:', error);
		} finally {
		}
	}
	// Supprimer une ligne d'intervention
	async function supprimerIntervention(id: number, idF: any) {
		

		if(id == idF){
			const resultat = await confirmDelete(id);

			if(resultat)
				mission.inventaires = mission.inventaires.filter((i) => i.idF !== id);
		}else{

			mission.inventaires = mission.inventaires.filter((i) => i.idF !== id);
		}

	}
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-2">
	<!-- Card Body -->

	<div class="space-y-6">
		<form action="#" use:init>
			<!-- Champ Email -->
			<!-- libelle: string; date_debut: string; date_fin: string; entreprise_id: string; type_mission_id:
			string; adresse_mission: any; description: any; -->

			<div class="grid grid-cols-3 gap-3">
				<!-- <InputMultiSelect options={equipes} bind:selected />
				<AutreInputSimple options={equipes} bind:selected={selected2}/> -->
				<InputSimple
					type="text"
					fieldName="libelle"
					label="Libellé"
					bind:field={mission.libelle}
					placeholder="Entrez le libelle"
				/>

				<InputDateSimple
					fieldName="date_debut"
					label="Date début"
					bind:field={mission.date_debut}
					placeholder="Date debut"
				/>
				<InputDateSimple
					fieldName="date_fin"
					label="Date fin"
					bind:field={mission.date_fin}
					placeholder="Date fin"
				/>
			</div>
			<div class="grid grid-cols-3 gap-3">
				<InputSelect
					label="Entreprise"
					bind:selectedId={mission.entreprise_id}
					datas={entreprises}
					id="entreprise_id"
				/>

				<InputSelect
					label="Type mission"
					bind:selectedId={mission.type_mission_id}
					datas={types}
					id="type_mission_id"
				/>
				<InputSimple
					type="text"
					fieldName="adresse_mission"
					label="Addresse mission"
					bind:field={mission.adresse_mission}
					placeholder="Entrez l'addresse"
				/>
			</div>

			<div class="shadow-gray col-span-12 shadow">
				<div
					class="bg-blue dark:bg-box-dark text-body dark:text-subtitle-dark rounded-10 m-0 p-0 text-[15px]"
				>
					<div
						style="background-color:rgb(254 162 3)"
						class="text-dark dark:text-title-dark dark:border-box-dark-up flex flex-wrap items-center justify-between border-b border-black px-[25px] py-[16px] text-[17px] font-medium"
					>
						<h4 class="dark:text-title-dark mb-0 text-lg font-medium text-white">
							Liste des inventaires
						</h4>

						<button
							class="border-secondary inline-flex h-[40px] items-center justify-center gap-[6px] rounded-[6px] border-1 border-solid bg-black px-[20px] text-[14px] leading-[22px] font-semibold whitespace-nowrap text-white capitalize transition duration-300 ease-in-out hover:bg-black"
							data-te-ripple-init=""
							data-te-ripple-color="light"
							style=""
							on:click={ajouterIntervention}
						>
							<i class="uil uil-plus text-[18px]"></i>
						</button>
					</div>
					<div class="flex items-center gap-[15px] p-[20px]" style="background-color: #d8cccc;">
						<div
							class="bg-gray dark:bg-box-dark text-body dark:text-subtitle-dark dark:border-box-dark-up rounded-10 m-0 w-full border-0 border-black p-0 text-[15px]"
						>
							<div>
								{#each mission.inventaires as item, index (item.idF)}
									<div
										class="text-surface shadow-secondary-1 dark:bg-surface-dark block rounded-lg bg-white dark:text-white"
									>
										<div
											class="flex flex-wrap items-center justify-between border-b-2 border-neutral-100 px-6 py-3 dark:border-white/10"
										>
											<h2>Agent {item.agent_create_id} (équipe 7 )</h2>

											<button
												on:click={() => supprimerIntervention(item.id, item.idF)}
												class={`hover:bg-danger border-primary text-primary bg-danger inline-flex h-[30px] items-center justify-center gap-[6px] rounded-[4px] border-1 border-solid px-[10px] text-[6px] leading-[22px] font-semibold text-white capitalize transition duration-300 ease-in-out hover:text-white`}
												title={`delete`}
											>
												<i class={`uil uil-trash-alt`}></i>
											</button>
										</div>
										<div class="p-3">
											<QrCode text={item.qr_bar_code}/><br>
											<div class="mb-3 grid grid-cols-4 gap-3">
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
													label="Etats"
													bind:selectedId={item.etat_id}
													datas={etats}
													id="etat_id"
												/>
												<InputSelect
													label="Emplacement"
													bind:selectedId={item.emplacement_id}
													datas={emplacements}
													id="emplacement_id"
												/>
											</div>
											<div class="mb-3 grid grid-cols-4 gap-3">
												<InputSelect
													label="Nature"
													bind:selectedId={item.nature_id}
													datas={natures}
													id="nature_id"
												/>
												<InputSimple
													type="text"
													fieldName="cout_acquisition"
													label="Coût acquisition"
													bind:field={item.cout_acquisition}
													placeholder="Entrez le coût d'acquisition"
												/>
												<InputDateSimple
													fieldName="date_acquisition"
													label="Date acquisition"
													bind:field={item.date_acquisition}
													placeholder="Date aqquisition"
												/>

												<InputUserSelect
													label="Agent"
													bind:selectedId={item.agent_create_id}
													datas={userdata}
													id="agent_create_id"
												/>
											</div>
											<div class="mb-3 grid grid-cols-2 gap-3">
												<InputDateSimple
													fieldName="date_mise_en_service"
													label="Date mise en oeuvre"
													bind:field={item.date_mise_en_service}
													placeholder="Entrez la date mise en oeuvre"
												/>
												<ImageInputNew 
													label="Image"
													fieldName="image_url"
													bind:field={item.image_url}
													placeholder="Sélectionnez une image"
													showPreview={true}
													link={item.image_url ? item.image_url : ''}
												/>
												<!-- <InputSimple
													type="text"
													fieldName="image_url"
													label="Image"
													bind:field={item.image_url}
													placeholder="Entrez l'image"
												/> -->
											</div>
											<div class="mb-3 grid grid-cols-3 gap-3 border-b-2 border-black">
												<InputTextArea
													fieldName="description"
													label="Description"
													bind:field={item.description}
													placeholder="Entrez une description"
												/>
											</div>
										</div>
									</div>
									<div class="mb-[7px] h-2 border-b-2 border-black"></div>
								{/each}
							</div>
						</div>
					</div>
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
