<script lang="ts">
	import Abercrome from '$components/_includes/Abercrome.svelte';
	import CardStat from '$components/CardStat.svelte';
	import { apiFetch } from '$lib/api';
	import { getAuthCookie, logout } from '$lib/auth';
	import { onMount } from 'svelte';

	let main_data: any = [];
	let loading = false;

	let userData :any = getAuthCookie();
	

	async function fetchData() {
		loading = true; // Active le spinner de chargement
		try {
			const res = await apiFetch(true, '/dashboard');
			if (res) {
				main_data = res.data ;
				console.log('Données récupérées avec succès:', main_data);
			} else {
				console.error('Erreur lors de la récupération des données:', res.statusText);
			}
		} catch (error) {
			console.error('Erreur lors de la récupération des données:', error);
		} finally {
			loading = false; // Désactive le spinner de chargement
		}
	}

	onMount(async () => {
		await fetchData();
	});
</script>

<div class=" ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]">
	<Abercrome titre="Tableau de bord" parent="Dashbord" current="statistques" />
	<!-- Responsive Toggler -->
	<div class="col-span-12">
		<!-- <h1>{JSON.stringify(userData.token)}</h1> -->
	
		<div class="grid grid-cols-12 gap-[25px]">
			<CardStat title="Total missions" total={main_data.nb_missions}  icon="uil uil-arrow-growth" />
			<CardStat title="Total missions immobilisation" total={main_data.nb_missions_immo}  icon="uil uil-arrow-growth" />
			<CardStat title="Total missions stock" total={main_data.nb_missions_stock}  icon="uil uil-arrow-growth" />
			<CardStat title="Montant acquisition total" total={main_data.total_immo_acquisition_amount}  icon="uil uil-usd-circle" />
			
		</div>
	</div>
</div>
