<script lang="ts">
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import { formatDate as fmtDate } from '$lib/utils/date';
  import type { PageData } from './$types';

  export let data: PageData;

  $: ({ entries, events, artists, filter } = data);

  function formatDate(iso: string): string {
    return fmtDate(iso, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) || iso;
  }

  function setFilter(key: 'event' | 'artist' | 'view', value: string | null) {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    if (key === 'event') {
      url.searchParams.delete('artist');
      url.searchParams.delete('giveaway');
    }
    if (key === 'artist') url.searchParams.delete('giveaway');
    goto(url.pathname + url.search, { replaceState: true });
  }

  function clearGiveawayFilter() {
    const url = new URL(window.location.href);
    url.searchParams.delete('giveaway');
    goto(url.pathname + url.search, { replaceState: true });
  }

  function exportCsv() {
    const headers = ['Created', 'Name', 'Email', 'Phone', 'Instagram', 'Event', 'Brief', 'Artist', 'Giveaway', 'Winner', 'Contacted', 'Contact Note', 'Archived', 'Archive Note'];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = entries.map((e) => [
      e.created_at,
      esc(e.name),
      esc(e.email),
      esc(e.phone),
      esc(e.instagram_handle ?? ''),
      esc(e.event_name),
      esc(e.brief_title),
      esc(e.artist_name),
      esc(e.giveaway_title),
      e.is_winner ? '1' : '0',
      e.contacted_at ? '1' : '0',
      esc(e.contacted_note ?? ''),
      e.archived ? '1' : '0',
      esc(e.archived_note ?? '')
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `giveaway-entries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head><title>Giveaway Entries | Admin</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="giveaway-entries" />

  <div class="max-w-6xl mx-auto px-6 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold">Giveaway Entries</h1>
      <button
        on:click={exportCsv}
        class="px-4 py-2 border border-gray-200 rounded-lg font-mono text-xs text-gray-500 hover:text-brand-black hover:border-gray-400 transition-colors"
      >Export CSV</button>
    </div>

    <div class="flex flex-wrap items-end gap-4 mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div>
        <label for="f-event" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Event</label>
        <select
          id="f-event"
          value={filter.eventId ?? ''}
          on:change={(e) => setFilter('event', e.currentTarget.value || null)}
          class="px-3 py-2 border border-gray-200 rounded text-sm min-w-[220px]"
        >
          <option value="">All events</option>
          {#each events as ev (ev.id)}<option value={ev.id}>{ev.name}</option>{/each}
        </select>
      </div>
      <div>
        <label for="f-artist" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Artist</label>
        <select
          id="f-artist"
          value={filter.artistId ?? ''}
          on:change={(e) => setFilter('artist', e.currentTarget.value || null)}
          class="px-3 py-2 border border-gray-200 rounded text-sm min-w-[200px]"
        >
          <option value="">All artists</option>
          {#each artists as a (a.id)}<option value={a.id}>{a.name}</option>{/each}
        </select>
      </div>
      {#if filter.giveawayId}
        <button
          on:click={clearGiveawayFilter}
          class="px-3 py-2 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded"
          title="Clear giveaway filter"
        >Giveaway #{filter.giveawayId} ×</button>
      {/if}
      <div class="flex gap-1 bg-white border border-gray-200 rounded p-1 ml-auto">
        <button
          on:click={() => setFilter('view', null)}
          class="px-3 py-1.5 rounded font-mono text-xs {filter.view === 'active' ? 'bg-brand-yellow text-brand-black font-bold' : 'text-gray-500 hover:text-brand-black'}"
        >Active</button>
        <button
          on:click={() => setFilter('view', 'archived')}
          class="px-3 py-1.5 rounded font-mono text-xs {filter.view === 'archived' ? 'bg-brand-yellow text-brand-black font-bold' : 'text-gray-500 hover:text-brand-black'}"
        >Archived</button>
      </div>
    </div>

    {#if entries.length === 0}
      <div class="text-center py-20 border border-gray-200 rounded-lg">
        <p class="font-mono text-gray-400 text-sm">No entries {filter.view === 'archived' ? 'archived' : 'yet'}.</p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each entries as e (e.id)}
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <div class="flex items-start justify-between gap-4 mb-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-mono text-brand-black font-bold text-sm">{e.name}</h3>
                  {#if e.is_winner}
                    <span class="px-2 py-0.5 bg-brand-yellow text-brand-black font-bold font-mono text-[10px] rounded-full border border-yellow-400">winner</span>
                  {/if}
                  {#if e.contacted_at}
                    <span class="px-2 py-0.5 bg-green-50 text-green-700 font-mono text-[10px] rounded-full border border-green-200">contacted</span>
                  {/if}
                </div>
                <div class="font-mono text-xs text-gray-500 mt-0.5">
                  <a href="mailto:{e.email}" class="hover:text-brand-black">{e.email}</a>
                  · {e.phone}
                  {#if e.instagram_handle}
                    · <a href={`https://instagram.com/${e.instagram_handle}`} target="_blank" rel="noopener" class="hover:text-brand-black">@{e.instagram_handle}</a>
                  {/if}
                </div>
                <p class="font-mono text-[10px] text-gray-400 mt-1">
                  {e.event_name} · {e.artist_name} · {e.giveaway_title}
                </p>
              </div>
              <time class="font-mono text-[10px] text-gray-400 whitespace-nowrap">{formatDate(e.created_at)}</time>
            </div>

            {#if e.contacted_note}
              <p class="font-mono text-[10px] text-gray-400 mb-1">contact note: <span class="text-gray-500">{e.contacted_note}</span></p>
            {/if}
            {#if e.archived_note}
              <p class="font-mono text-[10px] text-gray-400 mb-1">archive note: <span class="text-gray-500">{e.archived_note}</span></p>
            {/if}

            <div class="flex items-end flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
              {#if !e.archived}
                <form method="POST" action="?/toggleWinner" use:enhance>
                  <input type="hidden" name="id" value={e.id} />
                  <button type="submit" class="px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors {e.is_winner ? 'bg-brand-yellow text-brand-black border border-yellow-400' : 'bg-white text-gray-500 border border-gray-200 hover:text-brand-black'}">
                    {e.is_winner ? 'Unset Winner' : 'Mark Winner'}
                  </button>
                </form>

                {#if e.contacted_at}
                  <form method="POST" action="?/undoContacted" use:enhance>
                    <input type="hidden" name="id" value={e.id} />
                    <button type="submit" class="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 font-mono text-xs font-bold rounded hover:bg-white">Undo Contact</button>
                  </form>
                {:else}
                  <form method="POST" action="?/markContacted" use:enhance class="flex items-end gap-2 flex-1 min-w-[220px]">
                    <input type="hidden" name="id" value={e.id} />
                    <input type="text" name="contacted_note" placeholder="Note (required)" required class="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-mono focus:outline-none focus:border-brand-black" />
                    <button type="submit" class="px-3 py-1.5 bg-white text-gray-500 border border-gray-200 font-mono text-xs font-bold rounded hover:text-brand-black hover:border-gray-400">Mark Contacted</button>
                  </form>
                {/if}

                <form method="POST" action="?/archive" use:enhance class="flex items-end gap-2">
                  <input type="hidden" name="id" value={e.id} />
                  <input type="text" name="archived_note" placeholder="Reason (required)" required class="w-40 px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-mono focus:outline-none focus:border-red-400/30" />
                  <button type="submit" class="px-3 py-1.5 bg-white border border-gray-200 font-mono text-xs text-gray-400 rounded hover:text-red-500 hover:border-red-400/30">Archive</button>
                </form>
              {:else}
                <form method="POST" action="?/unarchive" use:enhance>
                  <input type="hidden" name="id" value={e.id} />
                  <button type="submit" class="px-3 py-1.5 bg-white border border-gray-200 font-mono text-xs text-gray-500 rounded hover:text-brand-black hover:border-gray-400">Unarchive</button>
                </form>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
