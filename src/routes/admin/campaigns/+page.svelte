<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import { formatDate as fmtDate } from '$lib/utils/date';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ campaigns } = data);

  let showNew = false;

  function formatDate(iso: string | null): string {
    return fmtDate(iso, { month: 'short', day: 'numeric', year: 'numeric' }) || '—';
  }
</script>

<svelte:head><title>Campaigns | Admin</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="campaigns" />

  <div class="max-w-6xl mx-auto px-6 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold text-brand-black">Campaigns</h1>
      <button
        on:click={() => (showNew = !showNew)}
        class="px-3 py-1.5 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors"
      >
        {showNew ? 'Cancel' : '+ New Campaign'}
      </button>
    </div>

    {#if showNew}
      <form
        method="POST"
        action="?/create"
        use:enhance={() =>
          async ({ update, result }) => {
            await update({ reset: true });
            if (result.type === 'success') showNew = false;
          }}
        class="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4"
      >
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label for="c-title" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Title</label>
            <input id="c-title" name="title" required class="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-black" />
          </div>
          <div>
            <label for="c-slug" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Slug (auto if blank)</label>
            <input id="c-slug" name="slug" placeholder="live-muralists-2026-art-therapy" class="w-full px-3 py-2 border border-gray-200 rounded text-sm font-mono focus:outline-none focus:border-brand-black" />
          </div>
          <div>
            <label for="c-date" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Event date</label>
            <input id="c-date" type="date" name="event_date" class="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-black" />
          </div>
          <div>
            <label for="c-loc" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Location</label>
            <input id="c-loc" name="location" class="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-black" />
          </div>
        </div>
        <div>
          <label for="c-desc" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Short public description</label>
          <textarea id="c-desc" name="description" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-black"></textarea>
        </div>
        {#if form?.error}<p class="font-mono text-xs text-red-600">{form.error}</p>{/if}
        <button type="submit" class="px-4 py-2 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors">Create</button>
      </form>
    {/if}

    {#if campaigns.length === 0}
      <div class="text-center py-20 border border-gray-200 rounded-lg">
        <p class="font-mono text-gray-400 text-sm">No campaigns yet.</p>
      </div>
    {:else}
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="w-full font-mono text-sm">
          <thead class="bg-gray-50">
            <tr class="text-left text-[10px] uppercase tracking-widest text-gray-500">
              <th class="px-4 py-3">Campaign</th>
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Location</th>
              <th class="px-4 py-3 text-right">Artists</th>
              <th class="px-4 py-3 text-right">Entries</th>
              <th class="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {#each campaigns as c (c.id)}
              <tr class="border-t border-gray-100 hover:bg-gray-50">
                <td class="px-4 py-3">
                  <a href={`/admin/campaigns/${c.id}`} class="text-brand-black font-bold hover:underline">{c.title}</a>
                  <div class="text-[10px] text-gray-500 mt-0.5">{c.slug}</div>
                </td>
                <td class="px-4 py-3 text-gray-600">{formatDate(c.event_date)}</td>
                <td class="px-4 py-3 text-gray-600">{c.location ?? '—'}</td>
                <td class="px-4 py-3 text-right text-gray-600">{c.artist_count}</td>
                <td class="px-4 py-3 text-right text-gray-600">{c.entry_count}</td>
                <td class="px-4 py-3">
                  {#if c.is_active}
                    <span class="px-2 py-0.5 rounded-full border bg-green-50 border-green-200 text-green-700 text-[10px] uppercase tracking-widest">active</span>
                  {:else}
                    <span class="px-2 py-0.5 rounded-full border bg-gray-50 border-gray-200 text-gray-500 text-[10px] uppercase tracking-widest">off</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
