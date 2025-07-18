<script lang="ts">
	import { clamp } from './../../../../../node_modules/date-fns/fp/clamp.js';
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
	let user: any = {
		nom: '',
		prenoms: '',
		tel: '',
		email: '',
		d_type: ''
	};

	interface Intervention {
		id: any;
		description: string;
		technicien: string;
		duree: string;
		prix: number; // Changé en number
	}

	interface Mission {
		titre: string;
		date_debut: string;
		date_fin: string;
		interventions: Intervention[];
	}

	// Initialisation des données avec les types
	let mission: Mission = {
		titre: '',
		date_debut: '',
		date_fin: '',
		interventions: [
			{
				id: '1',
				description: 'string',
				technicien: 'string',
				duree: 'string',
				prix: 25000 // Changé en number
			},
			{
				id: '2',
				description: 'djkhddjkhd',
				technicien: 'KONATE',
				duree: '2 jour',
				prix: 25000 // Changé en number
			}
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

	onMount(() => {});

	async function SaveFunction() {
		console.log('Mission à enregistrer:', mission);
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
				id: Date.now(),
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
<div class="space-y-4 rounded-lg bg-white p-6 shadow">
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
			<div class="col-span-12 shadow shadow-gray">
				<div class="bg-blue dark:bg-box-dark m-0 p-0 text-body dark:text-subtitle-dark text-[15px] rounded-10">
				   <div class="py-[16px] px-[25px] text-dark dark:text-title-dark font-medium text-[17px] border-b border-black dark:border-box-dark-up">
					  <h4 class="mb-0 text-lg font-medium capitalize text-dark dark:text-title-dark">Liste des interventions</h4>
				   </div>
				   <div class="p-[25px] flex items-center gap-[15px]">
					  <div class="bg-gray dark:bg-box-dark m-0 p-0 text-body dark:text-subtitle-dark border-1 border-black dark:border-box-dark-up text-[15px] rounded-10 w-full">
						
						 <div>
							<table class="min-w-full text-sm font-light text-center">
							   <tbody>
								 
								  <tr>
									 <td class="px-6 py-4 font-medium border-e border-black whitespace-nowrap dark:border-box-dark-up">
										2
									 </td>
									 <td class="px-6 py-4 border-e border-regular whitespace-nowrap dark:border-box-dark-up">
										Jacob
									 </td>
									 <td class="px-6 py-4 border-e border-black whitespace-nowrap dark:border-box-dark-up">
										Thornton
									 </td>
									 <td class="px-6 py-4 whitespace-nowrap">@fat</td>
								  </tr>
							   </tbody>
							</table>
						 </div>
					  </div>
				   </div>
				</div>
			 </div>


			<div class="interventions-container">
				<h3>Lignes d'intervention</h3>
				<button type="button" class="add-btn" on:click={ajouterIntervention}>
					+ Ajouter une intervention
				</button>
				{#each mission.interventions as intervention, index (intervention.id)}
					<div class="grid grid-cols-12 items-end gap-3">
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
							<button
								type="button"
								class="rounded-full p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
								on:click={() => supprimerIntervention(intervention.id)}
								aria-label="Supprimer cette intervention"
								title="Supprimer"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>

					<div class="intervention-card">
						<div class="card-header">
							<span>Intervention #{index + 1}</span>
							<button
								type="button"
								class="delete-btn"
								on:click={() => supprimerIntervention(intervention.id)}
								aria-label="Supprimer cette intervention"
							>
								×
							</button>
						</div>
					</div>
				{/each}
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
