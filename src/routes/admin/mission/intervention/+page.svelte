<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API } from '$lib/api';
	
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import Modale from '$components/Modales/Modale.svelte';
	import { onMount } from 'svelte';
	import Edit from './Edit.svelte';
	import Abercrome from '$components/_includes/Abercrome.svelte';
	import Pagination from '$components/Pagination.svelte';
	import { pageSize } from '../../../../store';
	import { get } from 'svelte/store';
	
	import Menu from '$components/_includes/Menu.svelte';
	import type { Mission } from '../../../../types';
	import EditStock from './EditStock.svelte';
	import MenuInventaire from '$components/_includes/MenuInventaire.svelte';
	import SendMail from './SendMail.svelte';

	let main_data: Mission[] = [];
	let searchQuery = ''; // Pour la recherche par texte
	let currentPage = 1;
	let loading = false;
	let openDelete = false;
	let send = false;
	let openEdit = false;
	let openAdd = false;
	let openShow = false;
	let current_data = {};

	async function fetchData() {
		loading = true; // Active le spinner de chargement
		try {
			const res = await apiFetch(true, '/missions/inventaires');
			if (res) {
				main_data = res.data as Mission[];
				console.log('Données récupérées avec succèsTTTT:', main_data);
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

	$: filteredData = main_data.filter((item) => {
		return (
			item.libelle.toLowerCase().includes(searchQuery.toLowerCase()) 
			/* ||
			item.prenoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.tel.toLowerCase().includes(searchQuery.toLowerCase()) */
		);
	});

	$: totalPages = Math.max(1, Math.ceil(filteredData.length / get(pageSize)));

	$: paginatedData =
		filteredData.length > 0
			? filteredData.slice((currentPage - 1) * get(pageSize), currentPage * get(pageSize))
			: [];

	$: startRange = filteredData.length === 0 ? 0 : (currentPage - 1) * get(pageSize) + 1;
	$: endRange = Math.min(currentPage * get(pageSize), filteredData.length);

	$: if (currentPage > totalPages) {
		currentPage = totalPages;
	}

	$: if (filteredData.length === 0) {
		currentPage = 1;
	}

	// Calcul des indices affichés pour l’info pagination

	// Fonction pour rafraîchir les données après certaines actions
	async function refreshDataIfNeeded() {
		await fetchData();
	}

	// Rafraîchir les données après fermeture des modales
	$: if (!openAdd || !openEdit || !openShow || !send) {
		refreshDataIfNeeded();
	}

	// Fonction de callback pour gérer les actions
	const handleAction = (action: any, item: any) => {
		current_data = item;
		if (action === 'view') {
			openShow = true;
		} else if (action === 'edit') {
			openEdit = true;
		} else if (action === 'delete') {
			openDelete = true;
		
		} else if (action === 'send') {
			send = true;
		}
	};

	const actions =[
		
		{
			action: 'edit',
			title: 'Modifier',
			icon: 'book',
			color: 'warning'
		},
		{
			action: 'view',
			title: 'Modifier',
			icon: 'book',
			color: 'warning'
		},
		{
			action: 'send',
			title: 'Send mail',
			icon: 'book',
			color: 'warning'
		}
		
	];

	function handlePageChange(event: CustomEvent) {
		currentPage = event.detail;
	}
</script>

<div class=" ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]">
	<Abercrome titre="Missions" parent="Dashbord" current="liste missions" />
	<!-- Responsive Toggler -->
	<div class="col-span-12">
		<div
			class="dark:bg-box-dark text-body dark:text-subtitle-dark rounded-10 relative m-0 bg-white p-0 text-[15px]"
		>
			<div
				class=" text-dark dark:text-title-dark border-regular dark:border-box-dark-up flex flex-wrap items-center justify-between border-b px-[25px] text-[17px] font-medium max-sm:h-auto max-sm:flex-col"
			>
				<h1
					class="text-dark dark:text-title-dark mb-0 inline-flex items-center overflow-hidden py-[16px] text-[18px] font-semibold text-ellipsis whitespace-nowrap "
				>
					Liste des missons pour inventaires
				</h1>

				
			</div>
			<div
				class=" text-dark dark:text-title-dark border-regular dark:border-box-dark-up flex flex-wrap items-center justify-between border-b px-[15px] text-[17px] font-medium max-sm:h-auto max-sm:flex-col"
			>
				<div class="grid w-full grid-cols-4">
					<InputSimple
						type="text"
						existelabel={false}
						bind:field={searchQuery}
						label="Rechercher"
						fieldName="search"
						placeholder="Recherche"
					/>
				</div>
			</div>
			<div class="p-[20px]">
				<div class="scrollbar overflow-x-auto">
					<table class="min-w-full border border-gray-300 border-collapse text-start text-sm font-light">
						<thead class="font-medium text-white ">
						  <tr class="bg-[#00baff]">
							<th style="width: 2px;"
							  class="border border-gray-300 bg-[#f8f9fb] px-[25px] py-3.5 text-start text-[15px] font-medium capitalize">
							  <div class="mb-[0.125rem] block min-h-[1.5rem]">
								<input
								  class="relative me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border border-solid border-gray-300 checked:border-primary checked:bg-primary"
								  type="checkbox"
								  id="checkAllExport"
								  value=""
								  aria-label="..."
								/>
							  </div>
							</th>
					  
							{#each ['Libelle', 'Date début', 'Date fin', 'Entreprise','Type mission'] as title}
							  <th class="border border-gray-300 bg-[#f8f9fb] px-4 py-3.5 text-start text-[15px] font-medium uppercase">
								{title}
							  </th>
							{/each}
					  
							<th style="width: 10px;text-align: center;"
							  class="border border-gray-300 bg-[#f8f9fb] px-4 py-3.5 text-end text-[15px] font-medium uppercase">
							  Nbre inventaire
							</th>
							<th style="width: 10px;text-align: center;"
							  class="border border-gray-300 bg-[#f8f9fb] px-4 py-3.5 text-end text-[15px] font-medium uppercase">
							  Action
							</th>
						  </tr>
						</thead>
						<tbody>
						  {#if loading && paginatedData.length === 0}
							<tr>
							  <td colspan="7" class="border border-gray-300 py-4 text-center">
								<div class="grid w-full grid-cols-1">
								  <div class="flex flex-col flex-wrap items-center justify-center gap-[15px] p-[25px] py-[16px]">
									<div
									  class="text-primary inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em]"
									  role="status">
									  <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]">
										Loading...
									  </span>
									</div>
								  </div>
								</div>
							  </td>
							</tr>
						  {:else if paginatedData.length === 0}
							<tr>
							  <td colspan="7" class="border border-gray-300 py-4 text-center">
								Aucun résultat trouvé avec les critères de filtrage actuels
							  </td>
							</tr>
						  {:else}
							{#each paginatedData as item, i}
							  <tr class="group">
								<td class="border border-gray-300 w-[60px] px-[25px] py-2.5 text-start font-medium">
								  <div class="mb-[0.125rem] block min-h-[1.5rem]">
									<input
									  class="checkboxItemExport relative me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border border-gray-300 checked:border-primary checked:bg-primary"
									  type="checkbox"
									  value=""
									  aria-label="..."
									/>
								  </div>
								</td>
								<td class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize">
								  {item.libelle}
								</td>
								<td class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize">
								  {item.date_debut}
								</td>
								<td class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize">
								  {item.date_fin}
								</td>
								<td class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize">
								  {item.entrepriseMagasin ? item.entrepriseMagasin.libelle : ''}
								</td>
								<td class="border border-gray-300 px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize">
								  {item.typeMission ? item.typeMission.libelle : ''}
								</td>
								<td class="border border-gray-300 px-4 py-2.5 text-[14px] text-bold font-normal whitespace-nowrap capitalize" style="text-align: center;">
								  {item.inventaires.length }
								</td>
								
								<td class="border border-gray-300 text-dark dark:text-title-dark rounded-e-[6px] px-4 py-2.5 text-[14px] font-normal capitalize text-end" style="text-align: center;">
									<MenuInventaire item={item} onAction={handleAction} {actions} type={item.typeMission?.code} />

								  </td>
							  </tr>
							{/each}
						  {/if}
						</tbody>
					  </table>
					  
					{#if filteredData.length > 0 && totalPages > 1}
						<Pagination
							{currentPage}
							{totalPages}
							{startRange}
							{endRange}
							totalItems={filteredData.length}
							on:pageChange={handlePageChange}
						/>
					{/if}

				</div>
			</div>
		</div>
	</div>
</div>


<Modale bind:open={openEdit} size="full" title="Inventaires immobilisation">
	<Edit bind:open={openEdit} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={send} size="xl" title="Envoi un rapport">
	<SendMail bind:open={send} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openShow} size="full" title="Inventaires stock">
	<EditStock bind:open={openShow} data={current_data} on:updated={fetchData} />
</Modale>

