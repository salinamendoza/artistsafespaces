<script lang="ts">
  import { enhance } from '$app/forms';
  import { enhanceNoReset } from '$lib/utils/enhance';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ event, zones } = data);
</script>

<svelte:head><title>Add activity | {event.name}</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="events" crumbs={[{ label: event.name, href: `/admin/events/${event.id}` }, { label: 'Hub', href: `/admin/events/${event.id}/hub` }, { label: 'Add activity' }]} />

  <div class="max-w-2xl mx-auto px-6 py-8">
    <h1 class="font-display text-3xl font-bold mb-6">Add activity</h1>

    {#if form?.error}
      <p class="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    {/if}

    <form method="POST" use:enhance={enhanceNoReset} class="space-y-5">
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="title">Title</label>
        <input id="title" name="title" type="text" required placeholder="Doors open + check-in" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="start_time">Start time</label>
          <input id="start_time" name="start_time" type="datetime-local" required class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
        </div>
        <div>
          <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="end_time">End time</label>
          <input id="end_time" name="end_time" type="datetime-local" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
        </div>
      </div>

      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="zone_id">Zone</label>
        <select id="zone_id" name="zone_id" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black bg-white">
          <option value="">— none —</option>
          {#each zones as z}
            <option value={z.id}>{z.name}</option>
          {/each}
        </select>
      </div>

      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="notes">Notes</label>
        <textarea id="notes" name="notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black"></textarea>
      </div>

      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="display_order">Display order</label>
        <input id="display_order" name="display_order" type="number" step="1" placeholder="auto" class="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
        <p class="font-mono text-[10px] text-gray-500 mt-1">Leave blank to append. Activities also sort by start time.</p>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="px-4 py-2 bg-brand-black text-white font-mono text-sm rounded hover:opacity-90 transition-opacity">Add activity</button>
        <a href={`/admin/events/${event.id}/hub`} class="font-mono text-xs text-gray-500 hover:text-brand-black">Cancel</a>
      </div>
    </form>
  </div>
</div>
