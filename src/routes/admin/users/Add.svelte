<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API } from '$lib/api';
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
		login: '',
		password: '',
		fcm_token: '',
		d_type: ''
	};

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {}

	onMount(() => {});

	async function SaveFunction() {
		isLoad = true;
		try {
			const res = await  apiFetch(false,'/auth/register',"POST",{
					email: user.email,
                    tel: user.tel,
                    login:user.login,
                    nom:user.nom,
                    prenoms:user.prenoms,
                    password:user.password,
                    d_type:user.d_type,
                    fcm_token:''
					
				})
			
			if (res) {
				isLoad = false;
				open = false;
				notificationMessage = 'Utilisateur créé avec succès!';
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
				<InputSimple
					type="text"
					fieldName="tel"
					label="Télephone"
					bind:field={user.tel}
					placeholder="Entrez le télephone"
				/>
				<InputSimple
					type="email"
					fieldName="email"
					label="Email"
					bind:field={user.email}
					placeholder="Entrez l'email"
				/>
				<InputSimple
					type="text"
					fieldName="login"
					label="Login"
					bind:field={user.login}
					placeholder="Entrez le login"
				/>
                
				<InputSimple
					type="password"
					fieldName="password"
					label="Mot de passe"
					bind:field={user.password}
					placeholder="Entrez le mot de passe"
				/>
			</div>
            <div class="grid grid-cols-1 gap-3">
                <InputSelect
                label="Type utilisateur" 
                bind:selectedId={user.d_type}
                datas={[
                    { id: "agent", libelle: "Agent" },
                    { id: "client", libelle: "Client" },
                    { id: "admin", libelle: "Admin" },
                    
                ]}
                id="role"
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
