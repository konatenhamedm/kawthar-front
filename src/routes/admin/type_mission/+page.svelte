<script lang="ts">
	import InputSimple from '$components/inputs/InputSimple.svelte';
	import { apiFetch, BASE_URL_API } from '$lib/api';
	import { Button, Modal, Select } from 'flowbite-svelte';
	import Notification from '$components/_includes/Notification.svelte';
	import InputSelect from '$components/inputs/InputSelect.svelte';
	import Modale from '$components/Modales/Modale.svelte';
	import { onMount } from 'svelte';
	import Edit from './Edit.svelte';
	import Abercrome from '$components/_includes/Abercrome.svelte';
	import Pagination from '$components/Pagination.svelte';
	import { pageSize } from '../../../store';
	import { get } from 'svelte/store';
	import type { Equipe, User } from '../../../types';
	import Add from './Add.svelte';
	import Show from './Show.svelte';
	import Delete from './Delete.svelte';
	import Menu from '$components/_includes/Menu.svelte';

	let main_data: Equipe[] = [];
	let searchQuery = ''; // Pour la recherche par texte
	let currentPage = 1;
	let loading = false;
	let openDelete = false;
	let openEdit = false;
	let openAdd = false;
	let openShow = false;
	let current_data = {};

	async function fetchData() {
		loading = true; // Active le spinner de chargement
		try {
			const res = await apiFetch(true, '/typeMissions');
			if (res) {
				main_data = res.data as Equipe[];
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

	$: filteredData = main_data.filter((item) => {
		return (
			item.libelle.toLowerCase().includes(searchQuery.toLowerCase()) 
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
	$: if (!openAdd || !openEdit || !openDelete) {
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
		}
	};

	const actions =[
		{
			action: 'view',
			title: 'Voir',
			icon: 'eye',
			color: 'primary'
		},
		{
			action: 'edit',
			title: 'Modifier',
			icon: 'edit',
			color: 'warning'
		}
		,{
			action: 'delete',
			title: 'Supprimer',
			icon: 'trash-alt',
			color: 'danger'
		}
	];

	function handlePageChange(event: CustomEvent) {
		currentPage = event.detail;
	}
</script>

<div class=" ssm:mt-[30px] mx-[30px] mt-[15px] mb-[30px] min-h-[calc(100vh-195px)]">
	<Abercrome titre="typeMissions" parent="Dashbord" current="typeMissions" />
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
					Liste des typeMissions
				</h1>

				<button
					class="bg-secondary border-secondary hover:bg-secondary-hbr inline-flex h-[40px] items-center justify-center gap-[6px] rounded-[6px] border-1 border-solid px-[20px] text-[14px] leading-[22px] font-semibold whitespace-nowrap text-white capitalize transition duration-300 ease-in-out"
					data-te-ripple-init=""
					data-te-ripple-color="light"
					style=""
					on:click={() => ((current_data = {}), (openAdd = true))}
				>
					<i class="uil uil-plus text-[18px]"></i>
					Nouveau
				</button>
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
					<table
						class="table-border min-w-full border-b border-gray-300 text-start text-sm font-light"
					>
						<thead class="font-medium">
							<tr class="bg-[#00baff]">
								<th style="width: 2px;"
									scope="col"
									class="dark:bg-box-dark-up text-body-header dark:text-title-white rounded-s-[6px] border-none bg-[#f8f9fb] px-[25px] py-3.5 text-start text-[15px] font-medium capitalize before:hidden"
								>
									<div class="mb-[0.125rem] block min-h-[1.5rem]">
										<input
											class="border-normal checked:border-primary checked:bg-primary dark:border-dark-border dark:checked:border-primary dark:checked:bg-primary dark:indeterminate:border-primary dark:indeterminate:bg-primary indeterminate:border-primary indeterminate:bg-primary relative me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] cursor-none appearance-none rounded-[0.25rem] border-1 border-solid outline-none before:pointer-events-none before:absolute before:h-[10px] before:w-[0.5px] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:content-[''] after:top-[2px] checked:before:opacity-[0.16] checked:after:absolute checked:after:ms-[5px] checked:after:mt-0 checked:after:block checked:after:h-[10px] checked:after:w-[5px] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] indeterminate:after:absolute indeterminate:after:ms-[4px] indeterminate:after:mt-[5px] indeterminate:after:w-[0.5rem] indeterminate:after:border-[0.05rem] indeterminate:after:border-solid indeterminate:after:border-white hover:cursor-pointer hover:before:opacity-[0.04] indeterminate:focus:after:w-[0.5rem] indeterminate:focus:after:rounded-none indeterminate:focus:after:border-[0.125rem] indeterminate:focus:after:border-r-0 indeterminate:focus:after:border-b-0 indeterminate:focus:after:border-l-0 ltr:ltr:float-left rtl:float-right rtl:ltr:float-right"
											type="checkbox"
											id="checkAllExport"
											value
											aria-label="..."
										/>
									</div>
								</th>

								{#each ['Libelle'] as title}
									<th
										scope="col"
										class="dark:bg-box-dark-up text-body-header white:text-title-white border-none bg-[#f8f9fb] px-4 py-3.5 text-start text-[15px] font-medium uppercase before:hidden"
									>
										{title}</th
									>
								{/each}

								<th
									scope="col" style="width: 200px;text-align: center;"
									class="dark:bg-box-dark-up text-body-header dark:text-title-dark rounded-e-[6px] border-none bg-[#f8f9fb] px-4 py-3.5 text-end text-[15px] font-medium uppercase before:hidden"
								>
									Action</th
								>
							</tr>
						</thead>
						<tbody>
							{#if loading && paginatedData.length === 0}
								<tr>
									<td colspan="6" class="py-4 text-center">
										<!--  <div class="flex flex-row gap-2 items-center justify-center"> -->
										<div class="grid w-full grid-cols-1">
											<div
												class="flex flex-col flex-wrap items-center justify-center gap-[15px] p-[25px] py-[16px]"
											>
												<div
													class="text-primary inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
													role="status"
												>
													<span
														class="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]"
														>Loading...</span
													>
												</div>
											</div>
										</div>
										<!-- </div> -->
									</td>
								</tr>
							{:else if paginatedData.length === 0}
								<tr>
									<td colspan="6" class="py-4 text-center">
										Aucun résultat trouvé avec les critères de filtrage actuels
									</td>
								</tr>
							{:else}
								{#each paginatedData as item, i}
									<tr class="group">
										<td 
											class="text-dark dark:text-title-dark text-15 w-[60px] rounded-s-[6px] border-none px-[25px] py-2.5 pt-[15px] text-start font-medium group-hover:bg-transparent before:hidden last:text-end"
										>
											<div class="mb-[0.125rem] block min-h-[1.5rem]">
												<input
													class="border-normal checked:border-primary checked:bg-primary dark:border-box-dark-up dark:checked:border-primary dark:checked:bg-primary checkboxItemExport relative me-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-1 border-solid outline-none before:pointer-events-none before:absolute before:h-[10px] before:w-[0.5px] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:content-[''] after:top-[2px] checked:before:opacity-[0.16] checked:after:absolute checked:after:ms-[5px] checked:after:mt-0 checked:after:block checked:after:h-[10px] checked:after:w-[5px] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-t-0 checked:after:border-l-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] ltr:float-left rtl:float-right"
													type="checkbox"
													value=""
													aria-label="..."
												/>
											</div>
										</td>
										<td
											class="text-dark dark:text-title-dark border-none px-4 py-2.5 text-[14px] font-normal whitespace-nowrap capitalize group-hover:bg-transparent last:text-start"
										>
											{item.libelle}</td
										>
										
										
										<td
											class="text-dark dark:text-title-dark rounded-e-[6px] border-none py-2.5 ps-4 pe-4 text-[14px] font-normal capitalize group-hover:bg-transparent last:text-end"
										>
                                        <Menu item={item} onAction={handleAction} {actions}/>
											
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

<Modale bind:open={openAdd} size="xl" title="Créer un type mission">
	<Add bind:open={openAdd} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openEdit} size="xl" title="Modifier un type mission">
	<Edit bind:open={openEdit} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openShow} size="xl" title="Détails de type mission">
	<Show bind:open={openShow} data={current_data} on:updated={fetchData} />
</Modale>
<Modale bind:open={openDelete} size="xl" title="Supprimer un type mission">
	<Delete bind:open={openDelete} data={current_data} on:updated={fetchData} />
</Modale>
