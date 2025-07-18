<script lang="ts">
    import { Button, Input, Label, Modal, Textarea } from 'flowbite-svelte';

export let label: string;
export let field: any;
export let fieldName: string;
export let placeholder: string = "";
export let disabled: boolean = false;
</script>


<Label class="col-span-6 space-y-1 sm:col-span-3">
    <span>{label}</span>

    <input type="date"  name={fieldName}   disabled={disabled}  class="select2 w-full  bg-gray-50 border border-gray-300
 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block" placeholder="{placeholder}"
 id="startDate"
  bind:value={field}
   />

  
</Label>


