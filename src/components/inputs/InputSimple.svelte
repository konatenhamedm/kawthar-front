<script lang="ts">
	export let label: string;
	export let existelabel: boolean = true;
	export let field: any;
	export let type: any;
	export let fieldName: string;
	export let placeholder: string = '';
	export let disabled: boolean = false;
	// export let requis: boolean = false; // Si nécessaire, décommentez et utilisez correctement
</script>

<div class="mb-2">
	<label
		for="email"
		class="dark:text-title-dark mb-2 block text-sm font-medium text-gray-900 capitalize"
	>
		{existelabel ? label : ''}
	</label>
	<input
		name={fieldName}
		{type}
		id={fieldName}
		class="min-h-[50px] w-full rounded-md border !border-black bg-white
        px-5 py-3 text-[15px] text-black
        ring-0 outline-none
        placeholder:text-[#A0A0A0] focus:border-black focus:ring-0"
		{placeholder}
		bind:value={field}
		{disabled}
	/>
</div>
