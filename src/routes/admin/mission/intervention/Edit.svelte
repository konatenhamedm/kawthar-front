<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { BASE_URL_API } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;

	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	// Initializing the user object with only email and status

	interface Intervention {
		id: any;
		idF: any;
		description: string;
		technicien: string;
		duree: string;
		prix: number; // Changé en number
	}

	interface Mission {
		libelle: string;
		date_debut: string;
		entreprise_id: string;
		description: any;
		adresse_mission: any;
		date_fin: string;
		type_mission_id: string;
		interventions: Intervention[];
	}

	// Initialisation des données avec les types
	let mission: Mission = {
		titre: '',
		date_debut: '',
		date_fin: '',
		interventions: [
			/* {
				id: '1',
				idF: '1',
				description: 'string',
				technicien: 'string',
				duree: 'string',
				prix: 25000 // Changé en number
			},
			{
				id: '2',
				idF: '2',
				description: 'djkhddjkhd',
				technicien: 'KONATE',
				duree: '2 jour',
				prix: 25000 // Changé en number
			} */
		]
	};

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {
		((user.nom = data?.nom),
			(user.prenoms = data?.prenoms),
			(user.tel = data?.tel),
			(user.email = data?.email),
			(user.d_type = data?.d_type));
	}

	async function SaveFunction() {
		//isLoad = true;
		try {
			const res = await fetch(BASE_URL_API + '/auth/upfate/' + data?.id, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: user.email,
					tel: user.tel,
					login: user.login,
					nom: user.nom,
					prenoms: user.prenoms,
					d_type: user.d_type,
					fcm_token: ''
				})
			});
			console.log('content res', res);

			if (res.ok) {
				isLoad = false;
				open = false;
				notificationMessage = 'Utilisateur modifié avec succès!';
				notificationType = 'success';
				showNotification = true;
			} else if (res.status === 400) {
				notificationMessage = 'Utilisateur déjà inscrit';
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
		mission.interventions = [
			...mission.interventions,
			{
				id: null,
				idF: Date.now(),
				description: '',
				technicien: '',
				duree: '',
				prix: 0 // Initialisé à 0 plutôt que '0'
			}
		];
	}

	// Supprimer une ligne d'intervention
	function supprimerIntervention(id: number): void {
		mission.interventions = mission.interventions.filter((i) => i.id !== id);
	}
</script>

<!-- Modal Content Wrapper -->
<div class="space-y-4 rounded-lg bg-white p-2 ">
	<!-- Card Body -->

	
	<div class="space-y-6">
		<form action="#" use:init>
			<!-- Champ Email -->
			<div class="grid grid-cols-2 gap-3">
				<InputSimple
					type="text"
					fieldName="nom"
					label="Nom"
					bind:field={user.nom}
					placeholder="Entrez le nom"
				/>
				<InputSimple
					type="text"
					fieldName="prenoms"
					label="Prénoms"
					bind:field={user.prenoms}
					placeholder="Entrez les prénoms"
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
						<h4 class="text-white dark:text-title-dark mb-0 text-lg font-medium">
							Liste des interventions
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
					<div class="flex items-center gap-[15px] p-[20px]">
						<div
							class="bg-gray dark:bg-box-dark text-body dark:text-subtitle-dark dark:border-box-dark-up rounded-10 m-0 w-full border-0 border-black p-0 text-[15px]"
						>
							<div>
								{#each mission.interventions as intervention, index (intervention.idF)}
									<div class="grid grid-cols-12 items-end gap-3 border-b-2  border-black">
										<!-- Durée - 3 colonnes -->
										<div class="col-span-3">
											<InputSimple
												type="text"
												fieldName="duree"
												label="Durée"
												bind:field={intervention.duree}
												placeholder="Heures"
											/>
										</div>

										<!-- Description - 4 colonnes -->
										<div class="col-span-4">
											<InputSimple
												type="text"
												fieldName="description"
												label="Description"
												bind:field={intervention.description}
												placeholder="Description de l'intervention"
											/>
										</div>

										<!-- Technicien - 3 colonnes -->
										<div class="col-span-3">
											<InputSimple
												type="text"
												fieldName="technicien"
												label="Technicien"
												bind:field={intervention.technicien}
												placeholder="Nom du technicien"
											/>
										</div>

										<!-- Prix - 1 colonne -->
										<div class="col-span-1">
											<InputSimple
												type="text"
												fieldName="prix"
												label="Prix (€)"
												bind:field={intervention.prix}
												placeholder="0.00"
											/>
										</div>

										<!-- Bouton suppression - 1 colonne -->
										<div class="col-span-1 flex h-[42px] items-center justify-center">
											<button style="margin-top: -21px;"
												on:click={() => supprimerIntervention(intervention.idF)}
												class={`hover:bg-danger border-primary text-primary bg-danger inline-flex h-[30px] items-center justify-center gap-[6px] rounded-[4px] border-1 border-solid px-[10px] text-[6px] text-white leading-[22px] font-semibold capitalize transition duration-300 ease-in-out hover:text-white`}
												title={`delete`}
											>
												<i class={`uil uil-trash-alt`}></i>
											</button>
										</div>
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
