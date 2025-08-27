<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API } from '$lib/api';
	
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
	import InputDateSimple from '$components/inputs/InputDateSimple.svelte';
	import InputTextArea from '$components/inputs/InputTextArea.svelte';
	import InputUserSelect from '$components/inputs/InputUserSelect.svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';
	let equipes: any = [];
	let entreprises: any = [];
	let types: any = [];
	// Initializing the user object with only email and status

	interface LigneEquipe {
		id: any;
		idF: any;
		mission_id: any;
		equipe_id: any;
		date_fin_intervention: any;
		date_debut_intervention: string;
		description: string;
	}

	interface Mission {
		libelle: string;
		date_debut: string;
		entreprise_id: string;
		description: any;
		mission_id: any;
		adresse_mission: any;
		date_fin: string;
		type_mission_id: string;
		ligneEquipes: LigneEquipe[];
	}

	// Initialisation des données avec les types
	let mission: Mission = {
		libelle: '',
		date_debut: '',
		entreprise_id: '',
		mission_id : "",
		description: '',
		adresse_mission: '',
		date_fin: '',
		type_mission_id: '',
		ligneEquipes: []
	};

	function formatDate(dateString: string): string {
		return new Date(dateString).toISOString().split('T')[0];
	}
	function formatMissionEquipes(source = []) {
		return source.map((item, index) => ({
			id: item.id, // id d’origine
			idF: item.id, // ou item.id si tu veux une copie exacte
			date_debut_intervention: formatDate(item.date_debut_intervention),
			date_fin_intervention: formatDate(item.date_fin_intervention),
			description: item.description,
			mission_id: item.id,
			equipe_id: item.equipe?.id ?? null // on garde seulement l’id
		}));
	}

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		console.log('LOLOLOLOO', data);
		((mission.libelle = data?.libelle),
			(mission.date_debut = data?.date_debut),
			(mission.entreprise_id = data?.entrepriseMagasin != null ? data?.entrepriseMagasin.id : null),
			(mission.type_mission_id = data?.typeMission != null ? data?.typeMission.id : null),
			(mission.description = data?.description),
			(mission.date_fin = data?.date_fin),
			(mission.adresse_mission = data?.adresse_mission),
			(mission.ligneEquipes = formatMissionEquipes(data?.mission_equipes)));
	}

	async function getData() {
		try {
			const res = await apiFetch(true, '/parameters');
			const data = res.data;

			equipes = data.equipes;
			entreprises = data.entreprises;
			types = data.type_missions;
			console.log('', entreprises);
		} catch (error) {
			console.error('Error fetching villes:', error);
		}
	}

	onMount(async () => {
		await getData();
	});

	async function SaveFunction() {
		isLoad = true;
		try {
			const res = await apiFetch(true, '/missions/update/'+data?.id, 'PUT', {
				libelle: mission.libelle,
				date_debut: mission.date_debut,
				entreprise_id: mission.entreprise_id,
				description: mission.description,
				adresse_mission: mission.adresse_mission,
				date_fin: mission.date_fin,
				type_mission_id: mission.type_mission_id,
				ligneEquipes: mission.ligneEquipes
			});

			console.log(res)

			if (res) {
				isLoad = false;
				open = false;
				notificationMessage = 'Utilisateur modifié avec succès!';
				notificationType = 'success';
				showNotification = true;
			} else {
				notificationMessage = res.message;
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

	// Ajouter une nouvelle ligne d'intervention
	function ajouterIntervention(): void {
		mission.ligneEquipes = [
			...mission.ligneEquipes,
			{
				id: null,
				idF: Date.now(),
				mission_id: data.id,
				description: '',
				equipe_id: '',
				date_debut_intervention: '',
				date_fin_intervention: ''
			}
		];
	}

	async function deleteFonction(mission:any,equipe:any) {
        isLoad = true;
        try {
            const res = await apiFetch(true,'/missions/delete/equipe','DELETE',{
				mission_id:mission,
				equipe_id:equipe

			});
			
            if (res) {
                notificationMessage = 'Utilisateur supprimé avec succès!';
                notificationType = 'success';
                open = false;
            } else {
                notificationMessage = res.data.message;
                notificationType = 'error';
            }
            showNotification = true;
        } catch (error) {
            notificationMessage = error?.message || 'Une erreur est survenue';
            notificationType = 'error';
            showNotification = true;
            console.error("Error deleting:", error);
        } finally {
            isLoad = false;
        }
    }

	// Supprimer une ligne d'intervention
	async function supprimerIntervention(id: number) {
		await deleteFonction(data?.id,id);
		
		mission.ligneEquipes = mission.ligneEquipes.filter((i) => i.idF !== id);
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
			<div class="mb-3 grid grid-cols-3 gap-3 border-b-2 border-black">
				<InputTextArea
					fieldName="description"
					label="Description"
					bind:field={mission.description}
					placeholder="Entrez une description"
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
							Liste des lignes équipe
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
								{#each mission.ligneEquipes as ligne, index (ligne.idF)}
									<div class="grid grid-cols-12 items-end gap-3 border-b-2 border-black shadow bg-white  shadow rounded-md p-2">
										<!-- Durée - 3 colonnes -->
										<div class="col-span-3">
											<InputSelect
												label="Equipe"
												bind:selectedId={ligne.equipe_id}
												datas={equipes}
												id="equipe_id"
											/>
										</div>

										<!-- Description - 4 colonnes -->
										<div class="col-span-3">
											<InputDateSimple
												fieldName="date_debut_intervention"
												label="Date début"
												bind:field={ligne.date_debut_intervention}
												placeholder="Entrez la date début"
											/>
										</div>

										<!-- Technicien - 3 colonnes -->
										<div class="col-span-3">
											<InputDateSimple
												fieldName="date_fin_intervention"
												label="Date fin"
												bind:field={ligne.date_fin_intervention}
												placeholder="Entrez la date fin"
											/>
										</div>

										<!-- Prix - 1 colonne -->
										<div class="col-span-2">
											<InputSimple
												type="text"
												fieldName="description"
												label="Description"
												bind:field={ligne.description}
												placeholder="Entrez un commentaire"
											/>
										</div>

										<!-- Bouton suppression - 1 colonne -->
										<div class="col-span-1 flex h-[42px] items-center justify-center">
											<button
												style="margin-top: -21px;"
												on:click={() => supprimerIntervention(ligne.idF)}
												class={`hover:bg-danger border-primary text-primary bg-danger inline-flex h-[30px] items-center justify-center gap-[6px] rounded-[4px] border-1 border-solid px-[10px] text-[6px] leading-[22px] font-semibold text-white capitalize transition duration-300 ease-in-out hover:text-white`}
												title={`delete`}
											>
												<i class={`uil uil-trash-alt`}></i>
											</button>
										</div>
									</div><div class="h-2 border-b-2 border-black">

									</div>
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
