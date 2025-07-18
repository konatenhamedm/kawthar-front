<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    export let currentPage: number = 1;
    export let totalPages: number = 1;
    export let startRange: number = 0;
    export let endRange: number = 0;
    export let totalItems: number = 0;
  
    const dispatch = createEventDispatcher();
  
    function goToPage(page: number) {
      if (page < 1) page = 1;
      else if (page > totalPages) page = totalPages;
  
      if (page !== currentPage) {
        dispatch('pageChange', page);
      }
    }
  </script>
  
  <div class="grid grid-cols-12 items-center gap-4">
    <div class="col-span-3 p-2">
      <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
        Affichage
        <span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
        sur un total de
        <span class="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
      </span>
    </div>
  
    <div class="col-span-9">
      <nav aria-label="Pagination">
        <ul class="flex items-center gap-2 justify-end">
          <li>
            <button
              class="btn"
              on:click={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Page précédente"
            >
              ‹
            </button>
          </li>
  
          {#each Array(totalPages).fill(0).map((_, i) => i + 1) as page}
            <li>
              <button
                class="btn {page === currentPage ? 'active' : ''}"
                aria-current={page === currentPage ? 'page' : undefined}
                on:click={() => goToPage(page)}
              >
                {page}
              </button>
            </li>
          {/each}
  
          <li>
            <button
              class="btn"
              on:click={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Page suivante"
            >
              ›
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  
  <style>
    .btn {
      padding: 0.25rem 0.75rem;
      border: 1px solid #ccc;
      background: white;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn.active {
      background: #00baff;
      color: white;
      border-color: #00baff;
      font-weight: bold;
    }
  </style>
  