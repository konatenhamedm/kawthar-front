<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  export let user: any;

  // Constantes pour les chemins
  const BASE_PATH = '/admin';

  // Configuration du menu
  const menuItems = [
    {
      title: "Dashboard",
      icon: "uil uil-apps",
      path: BASE_PATH,
      exact: true
    },
    {
      isSectionTitle: true,
      title: "Configuration"
    },
    {
      title: "Paramétrage",
      icon: "uil uil-apps",
      subItems: [
        { title: "Equipes", path: `${BASE_PATH}/equipe` },
        { title: "Sites", path: `${BASE_PATH}/site` },
        { title: "Etats", path: `${BASE_PATH}/etat` },
        { title: "Utilité", path: `${BASE_PATH}/utilite` },
      ]
    },
    {
      title: "Utilisateurs",
      icon: "uil uil-user",
      path: `${BASE_PATH}/users`
    },
    {
      isSectionTitle: true,
      title: "Gestion Missions"
    },
    {
      title: "Parametres",
      icon: "uil uil-layer-group",
      subItems: [
        { title: "Types mission", path: `${BASE_PATH}/type_mission` },
      ]
    },
    {
      title: "Missions",
      icon: "uil uil-chart",
      path: `${BASE_PATH}/mission`
    },
    {
      title: "Interventions",
      icon: "uil uil-chart",
      path: `${BASE_PATH}/mission/intervention`
    },
    {
      isSectionTitle: true,
      title: "Reporting"
    },
    {
      title: "Statistiques",
      icon: "uil uil-chart",
      path: `${BASE_PATH}/mission/statistique`
    }
  ];

  // Classes CSS réutilisables
  const BASE_LINK_CLASS = 'rounded-e-[20px] hover:bg-primary/10 focus:bg-primary/10 active:bg-primary/10 dark:text-subtitle-dark flex h-12 cursor-pointer items-center gap-[16px] truncate px-6 py-4 text-[14px] font-medium text-body outline-none transition duration-300 ease-linear hover:text-primary dark:hover:text-title-dark hover:outline-none focus:text-primary dark:focus:text-title-dark focus:outline-none active:text-primary active:outline-none [&.active]:text-primary dark:[&.active]:text-title-dark motion-reduce:transition-none dark:hover:bg-box-dark-up dark:focus:bg-box-dark-up dark:active:bg-box-dark-up group capitalize';
  const SUB_LINK_CLASS = 'rounded-e-[20px] hover:bg-primary/10 hover:text-primary dark:hover:text-title-dark focus:bg-primary/10 focus:text-inherit active:bg-primary/10 active:text-inherit [&.active]:text-primary focus:text-primary dark:focus:text-title-dark dark:[&.active]:text-title-dark dark:text-subtitle-dark flex cursor-pointer items-center truncate py-[10px] pe-6 ps-[60px] text-[14px] text-body outline-none transition duration-300 ease-linear hover:outline-none focus:outline-none active:outline-none motion-reduce:transition-none dark:hover:bg-box-dark-up dark:focus:bg-box-dark-up dark:active:bg-box-dark-up capitalize';
  const SECTION_TITLE_CLASS = 'slug dark:text-white/40 mb-[10px] mt-[30px] block px-6 text-[12px] font-medium uppercase text-light';

  // Fonction améliorée pour vérifier l'état actif
  const isActive = (path: string, exact = false) => {
    if (exact) {
      return $page.url.pathname === path;
    }
    // Vérifie que le chemin commence par le path et que le caractère suivant est / ou la fin
    return $page.url.pathname.startsWith(path) && 
           ($page.url.pathname === path || $page.url.pathname[path.length] === '/');
  };

  // Vérifie si un sous-menu a un enfant actif (avec vérification exacte)
  const hasActiveChild = (subItems: Array<{path: string}>) => 
    subItems?.some(item => isActive(item.path, true));

  onMount(() => {
    // Initialisation si nécessaire
  });
</script>

<aside id="asideBar" class="asidebar dark:bg-box-dark fixed start-0 top-0 z-[1035] h-screen overflow-hidden bg-white xl:!w-[280px] xl:[&.collapsed]:!w-[80px] [&.collapsed]:!w-[250px] xl:[&.TopCollapsed]:!w-[0px] [&.TopCollapsed]:!w-[250px] !transition-all !duration-[0.2s] ease-linear delay-[0s] !w-0 xl:[&.collapsed>.logo-wrapper]:w-[80px]">
  <!-- Logo -->
  <div class="flex w-[280px] border-e border-[#edf2f9] dark:border-box-dark-up logo-wrapper items-center h-[71px] dark:bg-box-dark-up max-xl:hidden">
     <a href="index.html" class="block text-center">
        <div class="logo-full">
           <img class="ps-[27px] dark:hidden" src="/images/logos/logo.png" alt="Logo" style="height: 70px">
           <img class="ps-[27px] hidden dark:block" src="/images/logos/logo.png" alt="Logo">
        </div>
        <div class="hidden logo-fold">
           <img class="p-[27px] max-w-[80px]" src="/images/logos/logo_mini.png" alt="Logo">
        </div>
     </a>
  </div>

  <!-- Navigation -->
  <nav id="navBar" class="navBar dark:bg-box-dark start-0 max-xl:top-[80px] z-[1035] h-full overflow-y-auto bg-white xl:!w-[280px] xl:[&.collapsed]:!w-[80px] [&.collapsed]:!w-[250px] xl:[&.TopCollapsed]:!w-[0px] [&.TopCollapsed]:!w-[250px] !transition-all !duration-[0.2s] ease-linear delay-[0s] !w-0 pb-[100px] scrollbar xl:[&.collapsed]:ps-[7px] relative">
     <ul class="relative m-0 list-none px-[0.2rem]">
        {#each menuItems as item}
          {#if item.isSectionTitle}
            <!-- Titre de section -->
            <li class="relative">
              <span class={SECTION_TITLE_CLASS}>
                {item.title}
              </span>
            </li>
          {:else if item.subItems}
            <!-- Item avec sous-menu -->
            <li class="relative sub-item-wrapper group" class:open={hasActiveChild(item.subItems)}>
              <a class={BASE_LINK_CLASS + ' group-[.open]:bg-primary/10'}
                 class:active={hasActiveChild(item.subItems)}>
                <span class="nav-icon dark:text-subtitle-dark text-[18px] text-light-extra group-hover:text-current group-[&.active]:text-current group-focus:text-current">
                  <i class={item.icon}></i>
                </span>
                <span class="capitalize title">{item.title}</span>
                <span class="arrow-down text-gray-600 dark:text-subtitle-dark absolute end-0 me-[0.8rem] ms-auto text-[18px] transition-transform duration-300 ease-linear motion-reduce:transition-none group-hover:text-current">
                  <i class="uil uil-angle-down"></i>
                </span>
              </a>
              <ul class="sub-item !visible m-0 hidden list-none p-0 [&.show]:block scrollbar overflow-y-scroll" class:show={hasActiveChild(item.subItems)}>
                {#each item.subItems as subItem}
                  <li class="relative">
                    <a href={subItem.path} 
                       class={SUB_LINK_CLASS}
                       class:active={isActive(subItem.path, true)}>
                      {subItem.title}
                    </a>
                  </li>
                {/each}
              </ul>
            </li>
          {:else}
            <!-- Item simple -->
            <li class="relative">
              <a href={item.path} 
                 class={BASE_LINK_CLASS}
                 class:active={isActive(item.path, item.exact)}>
                <span class="nav-icon dark:text-subtitle-dark text-[18px] text-light-extra group-hover:text-current group-[&.active]:text-current group-focus:text-current">
                  <i class={item.icon}></i>
                </span>
                <span class="capitalize title">{item.title}</span>
              </a>
            </li>
          {/if}
        {/each}
     </ul>
  </nav>
</aside>