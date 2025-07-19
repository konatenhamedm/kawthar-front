<script lang="ts">
	import { Button, Input, Label, Modal, Textarea } from 'flowbite-svelte';

	export let label: string;
	export let existelabel: boolean = true;
	export let field: any;
	export let type: any;
	export let fieldName: string;
	export let placeholder: string = '';
	export let disabled: boolean = false;
	// export let requis: boolean = false; // Si nécessaire, décommentez et utilisez correctement
</script>

<div class="mb-2 ">
	<label
		for="email"
		class="dark:text-title-dark mb-2 block text-sm font-medium text-gray-900 capitalize"
	>
		{existelabel ? label : ''}
	</label>
	<input
		name={fieldName}
		type={type}
		id={fieldName}
		class="rounded-4 dark:bg-box-dark-up text-body dark:text-subtitle-dark focus:ring-primary focus:border-primary min-h-[50px] w-full border border-black px-[20px] py-[12px] text-[15px] outline-none placeholder:text-[#A0A0A0]"
		{placeholder}
		bind:value={field}
		{disabled}
	/>
</div>
