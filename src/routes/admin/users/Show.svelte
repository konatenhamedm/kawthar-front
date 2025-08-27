<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { BASE_URL_API } from '$lib/api';
	
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import { onMount } from 'svelte';
    function cancelDelete() {
        open = false;
    }
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

	export let data: Record<string, string> = {};

	function init(form: HTMLFormElement) {

        user.nom = data?.nom,
        user.prenoms = data?.prenoms,
        user.tel = data?.tel,
        user.email = data?.email,
        user.d_type = data?.d_type
    }

	onMount(() => {});

	async function SaveFunction() {
		isLoad = true;
		try {
			const res = await fetch(BASE_URL_API + '/auth/upfate/'+data?.id, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: user.email,
                    tel: user.tel,
                    login:user.login,
                    nom:user.nom,
                    prenoms:user.prenoms,
                    d_type:user.d_type,
                    fcm_token:''
					
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
</script>




<!-- Modal Content Wrapper -->
<div class="bg-white rounded-lg shadow p-6 space-y-4">

    <!-- Card Body -->
    <div class="space-y-6">
        <form action="#" use:init>
			<div class="grid grid-cols-2 gap-1 mb-1">
				<div class="flex flex-col items-start">
					<label class="font-semibold text-gray-700">Nom</label>
					<div class="bg-white px-3 py-2 w-full border border-gray-300 rounded-md text-gray-700">
						{user.nom || "Non spécifié"}
					</div>
				</div>

                <div class="flex flex-col items-start">
					<label class="font-semibold text-gray-700">Prénoms</label>
					<div class="bg-white px-3 py-2 w-full border border-gray-300 rounded-md text-gray-700">
						{user.prenoms || "Non spécifié"}
					</div>
				</div>
				<div class="flex flex-col items-start">
					<label class="font-semibold text-gray-700">Téléphone</label>
					<div class="bg-white px-3 py-2 w-full border border-gray-300 rounded-md text-gray-700">
						{user.tel || "Non spécifié"}
					</div>
				</div>

                <div class="flex flex-col items-start">
					<label class="font-semibold text-gray-700">Email</label>
					<div class="bg-white px-3 py-2 w-full border border-gray-300 rounded-md text-gray-700">
						{user.email || "Non spécifié"}
					</div>
				</div>

			</div>
            <div class="grid grid-cols-1 gap-1 mb-1">
                <div class="flex flex-col items-start">
					<label class="font-semibold text-gray-700">Type utilisateur</label>
					<div class="bg-white px-3 py-2 w-full border border-gray-300 rounded-md text-gray-700">
						{user.d_type || "Non spécifié"}
					</div>
				</div>
            </div>
			

		</form>
    </div>

    <!-- Card Footer -->
    <div class="flex justify-end pt-4 border-t border-gray-200">
        <button style="margin-right: 9px;"
        on:click={cancelDelete}
        disabled={isLoad}
        class="px-4 py-2  mr-[9px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
        Annuler
    </button>
    </div>

</div>

<!-- Notification Component -->
{#if showNotification}
    <Notification message={notificationMessage} type={notificationType} duration={5000} />
{/if}

