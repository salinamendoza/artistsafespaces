<script lang="ts">
  import { enhance } from '$app/forms';
  import { enhanceNoReset } from '$lib/utils/enhance';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: backUrl = `/events/${data.event.id}/hub?token=${data.token}`;
</script>

<svelte:head>
  <title>Add task | {data.event.name}</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-gray-50 text-brand-black">
  <div class="max-w-2xl mx-auto px-4 md:px-6 py-8">
    <a href={backUrl} class="font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-brand-black">← back to hub</a>
    <h1 class="font-display text-3xl font-bold mt-3 mb-6">Add task</h1>

    {#if form?.error}
      <p class="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    {/if}

    <form method="POST" use:enhance={enhanceNoReset} class="space-y-5">
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="title">Title</label>
        <input id="title" name="title" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black bg-white" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="owner">Owner</label>
          <input id="owner" name="owner" type="text" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black bg-white" />
        </div>
        <div>
          <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="status">Status</label>
          <select id="status" name="status" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black bg-white">
            <option value="open" selected>Open</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="zone_id">Zone</label>
        <select id="zone_id" name="zone_id" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black bg-white">
          <option value="" selected={data.preZone == null}>— none —</option>
          {#each data.zones as z}
            <option value={z.id} selected={data.preZone === z.id}>{z.name}</option>
          {/each}
        </select>
      </div>
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="activity_id">Activity</label>
        <select id="activity_id" name="activity_id" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black bg-white">
          <option value="" selected={data.preActivity == null}>— none —</option>
          {#each data.activities as a}
            <option value={a.id} selected={data.preActivity === a.id}>{a.title}</option>
          {/each}
        </select>
      </div>
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="due_date">Due date</label>
        <input id="due_date" name="due_date" type="date" class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black bg-white" />
      </div>
      <div>
        <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="notes">Notes</label>
        <textarea id="notes" name="notes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black bg-white"></textarea>
      </div>
      <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="px-4 py-2 bg-brand-black text-white font-mono text-sm rounded hover:opacity-90 transition-opacity">Add task</button>
        <a href={backUrl} class="font-mono text-xs text-gray-500 hover:text-brand-black">Cancel</a>
      </div>
    </form>
  </div>
</div>
