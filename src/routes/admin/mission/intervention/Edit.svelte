<script lang="ts">
	import * as cookie from 'cookie';

	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API } from '$lib/api';

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
	import Modale from '$components/Modales/Modale.svelte';
	import AddInterventionImmo from './AddInterventionImmo.svelte';
	import ShowInterventionImmo from './ShowInterventionImmo.svelte';
	import DeleteInterventionImmo from './DeleteInterventionImmo.svelte';
	import Menu from '$components/_includes/Menu.svelte';
	import Pagination from '$components/Pagination.svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;
	let token: string | undefined;

	if (typeof window !== 'undefined') {
		const cookies = cookie.parse(document.cookie);
		const auth = JSON.parse(cookies.auth);
		token = auth.token; // Supposant que votre token est stocké dans un cookie nommé "token"
	}

	function cancelDelete() {
		open = false;
	}

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

	let currentPage = 1;
	let openDelete = false;
	let openEdit = false;
	let openAdd = false;
	let openShow = false;
	let current_data = {};
	// Initializing the user object with only email and status

	interface LigneInventaireFormatee {
		id: any;
		idF: any;
		nom_agent: string;
		libelle: string;
		ref_article: string;
		description: string;
		agent_create_id: any;
		entreprise_id: any;
		qr_bar_code: any;
		missions_id: any;
		emplacement_id: any;
		nature_id: any;
		etat_id: any;
		date_acquisition: string; // ISO yyyy‑MM‑dd
		date_mise_en_service: string; // ISO yyyy‑MM‑dd
		cout_acquisition: any;
		image_url: any;
		date_scan: any;
		personne_detentrice: any;
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
			observation: item?.observation,
			agent_create_id: item.agent_create.libelle,
			entreprise_id: item.entreprise?.id,
			emplacement_id: item.emplacement ? item.emplacement.libelle : null,
			nom_agent: item.agent_create.nom + ' ' + item.agent_create.prenoms,
			nature_id: item.nature ? item.nature.libelle : null,
			etat_id: item.etat ? item.etat.libelle : null,
			qr_bar_code: item.qr_bar_code,
			date_acquisition: formatDate(item.date_acquisition),
			date_mise_en_service: formatDate(item.date_mise_en_service),
			cout_acquisition: item.cout_acquisition,
			image_url: item.image_url,
			date_scan: item.date_scan,
			personne_detentrice: item.personne_detentrice
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

	$: totalPages = Math.max(1, Math.ceil(mission.inventaires.length / 5));

	$: startRange = mission.inventaires.length === 0 ? 0 : (currentPage - 1) * 5 + 1;
	$: endRange = Math.min(currentPage * 5, mission.inventaires.length);

	$: if (currentPage > totalPages) {
		currentPage = totalPages;
	}

	$: if (mission.inventaires.length === 0) {
		currentPage = 1;
	}

	// Fonction pour rafraîchir les données d'inventaire
	async function refreshDataIfNeeded() {
		try {
			// Récupérer uniquement les inventaires depuis l'API
			const res = await apiFetch(true, `/ligneInventaires/mission/${data?.id}`);
			const updatedInventaires = res.data;

			// Mettre à jour uniquement les inventaires
			mission.inventaires = formatLignesInventaire(updatedInventaires);
		} catch (error) {
			console.error('Error fetching inventaires:', error);
		}
	}

	$: if (!openAdd && !openEdit && !openShow && !openDelete) {
		refreshDataIfNeeded();
	}

	// Fonction pour gérer les événements de mise à jour des modales
	function handleUpdated(event: CustomEvent) {
		const { action, data: updatedData } = event.detail;

		if (action === 'add' || action === 'edit') {
			// Ajouter ou mettre à jour l'élément dans la liste
			if (action === 'add') {
				mission.inventaires = [...mission.inventaires, updatedData];
			} else if (action === 'edit') {
				mission.inventaires = mission.inventaires.map((item) =>
					item.id === updatedData.id ? updatedData : item
				);
			}

			// Afficher une notification
			notificationMessage =
				action === 'add' ? 'Intervention ajoutée avec succès' : 'Intervention modifiée avec succès';
			notificationType = 'success';
			showNotification = true;
		} else if (action === 'delete') {
			// Supprimer l'élément de la liste
			mission.inventaires = mission.inventaires.filter((item) => item.id !== updatedData.id);

			// Afficher une notification
			notificationMessage = 'Intervention supprimée avec succès';
			notificationType = 'success';
			showNotification = true;
		}

		// Rafraîchir la pagination
		currentPage = 1;
	}

	// Fonction de callback pour gérer les actions
	const handleAction = (action: any, item: any) => {
		current_data = item;
		if (action === 'view') {
			openShow = true;
		} else if (action === 'add') {
			openAdd = true;
		} else if (action === 'delete') {
			openDelete = true;
		}
	};

	const actions = [
		{
			action: 'view',
			title: 'Voir',
			icon: 'eye',
			color: 'primary'
		},
		{
			action: 'delete',
			title: 'Supprimer',
			icon: 'trash-alt',
			color: 'danger'
		}
	];

	function handlePageChange(event: CustomEvent) {
		currentPage = event.detail;
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
		if (id == idF) {
			const resultat = await confirmDelete(id);

			if (resultat) mission.inventaires = mission.inventaires.filter((i) => i.idF !== id);
		} else {
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

			<div class="shadow-gray col-span-12 mt-8 shadow">
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
							on:click={() => (
								(current_data = {
									type: 'immo',
									mission: data?.id,
									entreprise_id: mission.entreprise_id
								}),
								(openAdd = true)
							)}
						>
							<i class="uil uil-plus text-[18px]"></i>
						</button>
					</div>
					<div class="flex items-center gap-[15px] p-[10px]" style="background-color: #d8ccccf;">
						<div
							class="bg-gray dark:bg-box-dark text-body dark:text-subtitle-dark dark:border-box-dark-up rounded-10 m-0 w-full border-0 border-black p-0 text-[15px]"
						>
							<table
								class="min-w-full border-collapse border border-gray-300 text-start text-sm font-light"
							>
								<thead class="font-medium text-white">
									<tr class="" style="background-color:rgb(254 162 3)">
										{#each ['Libelle', 'Ref article', 'Emplacement', 'Nom agent', 'Entreprise', 'Nature', 'Etat'] as title}
											<th
												class="border border-gray-300 bg-[#f8f9fb] px-4 py-3.5 text-start text-[15px] font-medium uppercase"
											>
												{title}
											</th>
										{/each}
										<th
											style="width: 10px;text-align: center;"
											class="border border-gray-300 bg-[#f8f9fb] px-4 py-3.5 text-start text-[15px] font-medium uppercase"
										>
											Vérifié
										</th>
										<th
											style="width: 10px;text-align: center;"
											class="border border-gray-300 bg-[#f8f9fb] px-4 py-3.5 text-end text-[15px] font-medium uppercase"
										>
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{#if mission.inventaires.length === 0}
										<tr>
											<td colspan="7" class="border border-gray-300 py-4 text-center">
												Aucun résultat trouvé avec les critères de filtrage actuels
											</td>
										</tr>
									{:else}
										{#each mission.inventaires as item, i}
											<tr class="group">
												<td
													class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
												>
													{item.libelle}
												</td>
												<td
													class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
												>
													{item.ref_article}
												</td>
												<td
													class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
												>
													{item.emplacement_id}
												</td>
												<td
													class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
												>
													{item.nom_agent}
												</td>
												<td
													class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
												>
													{item.entreprise_id}
												</td>
												<td
													class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
												>
													{item.nature_id}
												</td>
												<td
													class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
												>
													{item.etat_id}
												</td>
												<td
													class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize"
												>
													{#if item.date_scan}
														<svg
															width="30"
															height="30"
															viewBox="0 0 200 200"
															xmlns="http://www.w3.org/2000/svg"
														>
															<circle cx="100" cy="100" r="90" fill="url(#gradient)" />
															<path
																d="M50,100 L85,135 L150,70"
																fill="none"
																stroke="white"
																stroke-width="12"
																stroke-linecap="round"
																stroke-linejoin="round"
															/>
															<defs>
																<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
																	<stop offset="0%" stop-color="#32CD32" />
																	<stop offset="100%" stop-color="#32CD32" />
																</linearGradient>
															</defs>
														</svg>
													{:else}
														<svg
															width="30"
															height="30"
															viewBox="0 0 200 200"
															xmlns="http://www.w3.org/2000/svg"
														>
															<circle cx="100" cy="100" r="90" fill="url(#redGradient)" />
															<path
																d="M70,70 L130,130 M70,130 L130,70"
																fill="none"
																stroke="white"
																stroke-width="12"
																stroke-linecap="round"
															/>
															<defs>
																<linearGradient
																	id="redGradient"
																	x1="0%"
																	y1="0%"
																	x2="100%"
																	y2="100%"
																>
																	<stop offset="0%" stop-color="#FF3333" />
																	<stop offset="100%" stop-color="#CC0000" />
																</linearGradient>
															</defs>
														</svg>
													{/if}
												</td>

												<td
													class="text-dark dark:text-title-dark rounded-e-[6px] border border-gray-300 px-4 py-2.5 text-end text-[14px] font-normal capitalize"
													style="text-align: center;"
												>
													<Menu {item} onAction={handleAction} {actions} />
												</td>
											</tr>
										{/each}
									{/if}
								</tbody>
							</table>

							{#if mission.inventaires.length > 0 && totalPages > 1}
								<Pagination
									{currentPage}
									{totalPages}
									{startRange}
									{endRange}
									totalItems={mission.inventaires.length}
									on:pageChange={handlePageChange}
								/>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>

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

<!-- Notification Component -->
{#if showNotification}
	<Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}

<Modale bind:open={openAdd} size="2xl" title="Créer une intervention">
	<AddInterventionImmo
		bind:open={openAdd}
		data={current_data}
		on:updated={handleUpdated}
		on:close={() => (openAdd = false)}
	/>
</Modale>

<Modale bind:open={openShow} size="2xl" title="Détails interventions">
	<ShowInterventionImmo
		bind:open={openShow}
		data={current_data}
		on:updated={handleUpdated}
		on:close={() => (openShow = false)}
	/>
</Modale>
<Modale bind:open={openDelete} size="xl" title="Supprimer une équipe">
	<DeleteInterventionImmo
		bind:open={openDelete}
		data={current_data}
		on:updated={handleUpdated}
		on:close={() => (openDelete = false)}
	/>
</Modale>
