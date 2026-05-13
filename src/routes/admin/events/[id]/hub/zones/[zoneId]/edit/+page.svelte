<script lang="ts">
  import { enhance } from '$app/forms';
  import { enhanceNoReset } from '$lib/utils/enhance';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ event, zone, counts } = data);

  function deleteConfirm(evt: SubmitEvent) {
    const parts: string[] = [];
    if (counts.activity_count > 0)
      parts.push(`${counts.activity_count} activit${counts.activity_count === 1 ? 'y' : 'ies'}`);
    if (counts.task_count > 0)
      parts.push(`${counts.task_count} task${counts.task_count === 1 ? '' : 's'}`);
    const tail = parts.length ? ` This will leave ${parts.join(' and ')} without a zone.` : '';
    if (!confirm(`Delete zone "${zone.name}"?${tail} Continue?`)) {
      evt.preventDefault();
    }
  }
</script>

<svelte:head><title>Edit {zone.name} | {event.name}</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="events" crumbs={[{ label: event.name, href: `/admin/events/${event.id}` }, { label: 'Hub', href: `/admin/events/${event.id}/hub` }, { label: zone.name }]} />

  <div class="max-w-2xl mx-auto px-6 py-8">
    <h1 class="font-display text-3xl font-bold mb-6">Edit zone</h1>

    {#if form?.error}
      <p class="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    {/if}

    <form method="POST" action="?/save" use:enhance={enhanceNoReset} class="space-y-5">
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="name">Name</label>
        <input id="name" name="name" type="text" required value={zone.name} class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
      </div>
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="description">Description</label>
        <input id="description" name="description" type="text" value={zone.description ?? ''} class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
      </div>
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="display_order">Display order</label>
        <input id="display_order" name="display_order" type="number" step="1" value={zone.display_order} class="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="px-4 py-2 bg-brand-black text-white font-mono text-sm rounded hover:opacity-90 transition-opacity">Save</button>
        <a href={`/admin/events/${event.id}/hub`} class="font-mono text-xs text-gray-500 hover:text-brand-black">Cancel</a>
      </div>
    </form>

    <div class="mt-10 pt-6 border-t border-gray-200">
      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-3">Danger zone</p>
      <form method="POST" action="?/delete" use:enhance={enhanceNoReset} on:submit={deleteConfirm}>
        <button type="submit" class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-colors">Delete zone</button>
        {#if counts.activity_count > 0 || counts.task_count > 0}
          <p class="font-mono text-[10px] text-gray-500 mt-2">
            Deleting leaves
            {#if counts.activity_count > 0}{counts.activity_count} activit{counts.activity_count === 1 ? 'y' : 'ies'}{/if}
            {#if counts.activity_count > 0 && counts.task_count > 0} and {/if}
            {#if counts.task_count > 0}{counts.task_count} task{counts.task_count === 1 ? '' : 's'}{/if}
            without a zone (they are not deleted).
          </p>
        {/if}
      </form>
    </div>
  </div>
</div>
