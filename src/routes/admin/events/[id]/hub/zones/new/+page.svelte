<script lang="ts">
  import { enhance } from '$app/forms';
  import { enhanceNoReset } from '$lib/utils/enhance';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;
</script>

<svelte:head><title>Add zone | {data.event.name}</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="events" crumbs={[{ label: data.event.name, href: `/admin/events/${data.event.id}` }, { label: 'Hub', href: `/admin/events/${data.event.id}/hub` }, { label: 'Add zone' }]} />

  <div class="max-w-2xl mx-auto px-6 py-8">
    <h1 class="font-display text-3xl font-bold mb-6">Add zone</h1>

    {#if form?.error}
      <p class="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    {/if}

    <form method="POST" use:enhance={enhanceNoReset} class="space-y-5">
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="name">Name</label>
        <input id="name" name="name" type="text" required placeholder="Outside" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
      </div>
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="description">Description</label>
        <input id="description" name="description" type="text" placeholder="Mural wall + check-in table on the patio." class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
      </div>
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="display_order">Display order</label>
        <input id="display_order" name="display_order" type="number" step="1" placeholder="auto" class="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
        <p class="font-mono text-[10px] text-gray-500 mt-1">Leave blank to append to the end.</p>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="px-4 py-2 bg-brand-black text-white font-mono text-sm rounded hover:opacity-90 transition-opacity">Add zone</button>
        <a href={`/admin/events/${data.event.id}/hub`} class="font-mono text-xs text-gray-500 hover:text-brand-black">Cancel</a>
      </div>
    </form>
  </div>
</div>
