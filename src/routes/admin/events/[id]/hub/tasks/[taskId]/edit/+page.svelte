<script lang="ts">
  import { enhance } from '$app/forms';
  import { enhanceNoReset } from '$lib/utils/enhance';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ event, task, zones, activities } = data);

  function deleteConfirm(evt: SubmitEvent) {
    if (!confirm(`Delete task "${task.title}"? This cannot be undone.`)) {
      evt.preventDefault();
    }
  }
</script>

<svelte:head><title>Edit {task.title} | {event.name}</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="events" crumbs={[{ label: event.name, href: `/admin/events/${event.id}` }, { label: 'Hub', href: `/admin/events/${event.id}/hub` }, { label: task.title }]} />

  <div class="max-w-2xl mx-auto px-6 py-8">
    <h1 class="font-display text-3xl font-bold mb-6">Edit task</h1>

    {#if form?.error}
      <p class="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    {/if}

    <form method="POST" action="?/save" use:enhance={enhanceNoReset} class="space-y-5">
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="title">Title</label>
        <input id="title" name="title" type="text" required value={task.title} class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="owner">Owner</label>
          <input id="owner" name="owner" type="text" value={task.owner ?? ''} class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
        </div>
        <div>
          <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="status">Status</label>
          <select id="status" name="status" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black bg-white">
            <option value="open" selected={task.status === 'open'}>Open</option>
            <option value="blocked" selected={task.status === 'blocked'}>Blocked</option>
            <option value="done" selected={task.status === 'done'}>Done</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="zone_id">Zone</label>
        <select id="zone_id" name="zone_id" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black bg-white">
          <option value="" selected={task.zone_id == null}>— none —</option>
          {#each zones as z}
            <option value={z.id} selected={task.zone_id === z.id}>{z.name}</option>
          {/each}
        </select>
      </div>

      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="activity_id">Activity</label>
        <select id="activity_id" name="activity_id" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black bg-white">
          <option value="" selected={task.activity_id == null}>— none —</option>
          {#each activities as a}
            <option value={a.id} selected={task.activity_id === a.id}>{a.title}</option>
          {/each}
        </select>
      </div>

      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="due_date">Due date</label>
        <input id="due_date" name="due_date" type="date" value={task.due_date ?? ''} class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
      </div>

      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="notes">Notes</label>
        <textarea id="notes" name="notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black">{task.notes ?? ''}</textarea>
      </div>

      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="display_order">Display order</label>
        <input id="display_order" name="display_order" type="number" step="1" value={task.display_order} class="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="px-4 py-2 bg-brand-black text-white font-mono text-sm rounded hover:opacity-90 transition-opacity">Save</button>
        <a href={`/admin/events/${event.id}/hub`} class="font-mono text-xs text-gray-500 hover:text-brand-black">Cancel</a>
      </div>
    </form>

    <div class="mt-10 pt-6 border-t border-gray-200">
      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-3">Danger zone</p>
      <form method="POST" action="?/delete" use:enhance={enhanceNoReset} on:submit={deleteConfirm}>
        <button type="submit" class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-colors">Delete task</button>
      </form>
    </div>
  </div>
</div>
