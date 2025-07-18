<script>
    import { Button, Input, Label, Modal, Textarea } from 'flowbite-svelte';
export let label;
export let field = "";
export let fieldName;
export let rows = 4;
export let placeholder = "";

</script>
<Label class="col-span-6 space-y-2">
    <span>{label}</span>
    <Textarea
        id="{fieldName}" bind:value={field}
        rows="{rows}"
        class=" outline-noneform-input font-normal rounded block w-full border-gray-200 text-sm focus:border-gray-300 focus:ring-0 bg-white"
        placeholder="{placeholder}"
    >
        
    </Textarea>
</Label>