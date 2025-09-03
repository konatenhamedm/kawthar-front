<script lang="ts">
	import { BASE_URL_API } from "$lib/api";
	import * as cookie from 'cookie';

	export let item: any;
	export let type: any;
	export let actions: any = [];
	export let onAction: (a: string, i: any) => void;

	let token: string | undefined;

	if (typeof window !== 'undefined') {
		const cookies = cookie.parse(document.cookie);
		const auth = JSON.parse(cookies.auth);
		token = auth.token; // Supposant que votre token est stocké dans un cookie nommé "token"
	}
	async function SaveFunction() {

    try {
      	const response = await fetch(BASE_URL_API+ '/missions/getReport/' + item?.id, {
				method: 'GET',
			 headers: { 
					Accept: 'application/json', 
					Authorization: `Bearer ${token}` 
				},
			});

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur serveur:', errorText);
            throw new Error('Erreur lors du téléchargement: ' + response.status);
        }

        // Vérifier le type de contenu
        const contentType = response.headers.get('Content-Type');
        console.log('Content-Type reçu:', contentType);

        const blob = await response.blob();
        console.log('Taille du blob:', blob.size, 'bytes');

        // Vérifier si le blob n'est pas vide
        if (blob.size === 0) {
            throw new Error('Le fichier reçu est vide');
        }

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'rapport.xlsx';
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename\*?=["']?(?:UTF-8'')?([^;"']+)["']?/i);
            if (filenameMatch && filenameMatch[1]) {
                filename = decodeURIComponent(filenameMatch[1]);
            }
        }

        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        // Nettoyer après un délai
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 100);

       

    } catch (error) {
        
        console.error('Error downloading:', error);
    }
}
</script>

<div class="inline-flex gap-1">
	<!-- {#if ()} -->


	{#if type == 'immo'}
		<button
			on:click={() => onAction(`edit`, item)}
			class={`hover:bg-warning border-primary text-primary inline-flex h-[30px] items-center justify-center gap-[6px] rounded-[4px] border-1 border-solid px-[10px] text-[6px] leading-[22px] font-semibold capitalize transition duration-300 ease-in-out hover:text-white`}
			title={`inventaire immobilisation`}
		>
			<i class={`uil uil-book`}></i>
		</button>

	

	{:else}	
	<button
			on:click={() => onAction(`view`, item)}
			class={`hover:bg-warning border-primary text-primary inline-flex h-[30px] items-center justify-center gap-[6px] rounded-[4px] border-1 border-solid px-[10px] text-[6px] leading-[22px] font-semibold capitalize transition duration-300 ease-in-out hover:text-white`}
			title={`inventaire stock`}
		>
			<i class={`uil uil-book`}></i>
		</button>
	{/if}	
	
	<button
	on:click={() => SaveFunction()}
	class={`hover:bg-primary border-primary text-primary inline-flex h-[30px] items-center justify-center gap-[6px] rounded-[4px] border-1 border-solid px-[10px] text-[6px] leading-[22px] font-semibold capitalize transition duration-300 ease-in-out hover:text-white`}
	title={`inventaire stock`}
>
	<i class={`uil uil-message`}></i>
</button>
</div>
