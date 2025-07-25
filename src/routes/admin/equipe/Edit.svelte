<script lang="ts">

	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API, BASE_URL_API_LOGIN, BASE_URL_API_UPLOAD } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
	import InputTextArea from '$components/inputs/InputTextArea.svelte';
	import InputUserSelect from '$components/inputs/InputUserSelect.svelte';
	import InputMultiSelectUser from '$components/inputs/InputMultiSelectUser.svelte';

	export let open: boolean = false; // modal control
	let isLoad = false;
let userdata :any = [];
	let showNotification = false;
	let notificationMessage = '';
	let notificationType = 'info';

	// Initializing the item object with only email and status
	let item: any = {
		libelle: '',
		description: '',
		chef_equipe_id: '',
		agents: []
	};

	let itemdata : any = [];


	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {

        item.libelle = data?.libelle,
        item.description = data?.description,
        item.chef_equipe_id = data?.chefEquipe.id,
		item.agents = data?.agents
    }

	onMount(() => {});

	interface Item {
		id: any;
		nom: any;
		prenoms: any;
	}
	function agentIds(source:any) {
		return  source.map((item: Item) => item.id);
		
	}

	async function SaveFunction() {
		isLoad = true;
		try {
			const res = await apiFetch(true , '/equipes/update/'+data?.id, "PUT",{
					libelle: item.libelle,
                    description: item.description,
                    chef_equipe_id:item.chef_equipe_id,
					agents: agentIds(item.agents)
					
				});
		
			

			if (res) {
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
	async function getData() {
    try {
      const res = await apiFetch(false,  "/auth/users/all");
      const data = await res.data;
      userdata = data;
    } catch (error) {
      console.error("Error fetching villes:", error);
    }
  }

	onMount(async () => {
      await getData();
  });

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
					placeholder="Entrez le nom de l'équipe"
				/>
				
			
				<InputUserSelect
                label="Chef équipe" 
                bind:selectedId={item.chef_equipe_id}
                datas={userdata}
                id="chef_equipe_id"
            />
			</div>

			<div class="grid grid-cols-1 gap-3">
				<InputMultiSelectUser options={userdata} bind:selected={item.agents} />
			</div>
            
			<div class="grid grid-cols-1 gap-3">
				
				<InputTextArea fieldName="description"
				label="Description"
				bind:field={item.description}
				placeholder="Entrez la description" />
			
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
