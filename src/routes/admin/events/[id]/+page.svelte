<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ event, briefs, eventStats } = data);

  function formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso.length <= 10 ? iso : iso + 'Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function money(n: number): string {
    return '$' + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
</script>

<svelte:head><title>{event.name} | Admin</title></svelte:head>

<div class="min-h-screen bg-brand-black text-white">
  <AdminHeader section="events" crumbs={[{ label: event.name }]} />

  <div class="max-w-5xl mx-auto px-6 py-8 space-y-8">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl font-bold text-white">{event.name}</h1>
        <div class="mt-2 flex items-center gap-4 font-mono text-xs text-white/50">
          {#if event.client_name}<span>{event.client_name}</span>{/if}
          <span>{formatDate(event.event_date)}</span>
          {#if event.location}<span>{event.location}</span>{/if}
          <span class="px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-widest
            {event.status === 'confirmed' ? 'bg-brand-yellow/10 border-brand-yellow/20 text-brand-yellow' :
             event.status === 'live' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
             event.status === 'wrapped' ? 'bg-white/5 border-white/10 text-white/40' :
             event.status === 'cancelled' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
             'bg-white/5 border-white/10 text-white/60'}">{event.status}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <a href={`/admin/events/${event.id}/edit`} class="px-3 py-1.5 bg-white/5 border border-white/10 rounded font-mono text-xs text-white/70 hover:border-brand-yellow/30 hover:text-brand-yellow transition-colors">Edit</a>
        <form method="POST" action="?/delete" use:enhance>
          <button type="submit" class="px-3 py-1.5 bg-white/5 border border-white/10 rounded font-mono text-xs text-white/50 hover:text-red-400 hover:border-red-400/30 transition-colors">Delete</button>
        </form>
      </div>
    </div>

    {#if form?.error}
      <p class="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    {/if}

    {#if event.internal_notes}
      <div class="border border-white/10 rounded-lg p-5">
        <p class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">Internal Notes</p>
        <p class="text-sm text-white/70 whitespace-pre-wrap">{event.internal_notes}</p>
      </div>
    {/if}

    <!-- At-a-glance stats -->
    {#if eventStats.breakdown.length > 0}
      <div class="grid grid-cols-2 gap-4">
        <div class="relative group bg-white/5 border border-white/10 rounded-lg px-5 py-4 cursor-default">
          <p class="font-mono text-3xl font-bold text-white">{eventStats.artistCount}</p>
          <p class="font-mono text-xs text-white/40 mt-1">artist{eventStats.artistCount === 1 ? '' : 's'} booked</p>
          <!-- Hover breakdown -->
          <div class="absolute left-0 top-full mt-2 z-20 w-80 bg-brand-black border border-white/20 rounded-lg p-4 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
            <p class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">Breakdown</p>
            <div class="space-y-2">
              {#each eventStats.breakdown as b}
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <p class="font-mono text-xs text-white font-bold truncate">{b.artist_name}</p>
                    <p class="font-mono text-[10px] text-white/40">{b.activation_type_name}</p>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <p class="font-mono text-xs text-white">{money(b.rate)}</p>
                    {#if b.materials_allowance}
                      <p class="font-mono text-[10px] text-white/40">+{money(b.materials_allowance)} mat.</p>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
        <div class="relative group bg-white/5 border border-white/10 rounded-lg px-5 py-4 cursor-default">
          <p class="font-mono text-3xl font-bold text-brand-yellow">{money(eventStats.totalCost)}</p>
          <p class="font-mono text-xs text-white/40 mt-1">total cost</p>
          <!-- Hover breakdown -->
          <div class="absolute right-0 top-full mt-2 z-20 w-80 bg-brand-black border border-white/20 rounded-lg p-4 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
            <div class="space-y-2 mb-3">
              {#each eventStats.breakdown as b}
                <div class="flex items-center justify-between gap-3">
                  <p class="font-mono text-xs text-white truncate">{b.artist_name}</p>
                  <p class="font-mono text-xs text-white/70">{money(b.rate + (b.materials_allowance ?? 0))}</p>
                </div>
              {/each}
            </div>
            <div class="pt-2 border-t border-white/10 flex justify-between">
              <p class="font-mono text-[10px] text-white/40">Rates: {money(eventStats.totalRate)}</p>
              {#if eventStats.totalMaterials > 0}
                <p class="font-mono text-[10px] text-white/40">Materials: {money(eventStats.totalMaterials)}</p>
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Briefs -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-display text-xl font-bold text-white">Briefs</h2>
        <a href={`/admin/events/${event.id}/briefs/new`} class="px-3 py-1.5 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors">+ New Brief</a>
      </div>
      {#if briefs.length === 0}
        <p class="font-mono text-xs text-white/30 py-6 text-center border border-white/10 rounded-lg">No briefs yet.</p>
      {:else}
        <div class="space-y-2">
          {#each briefs as b}
            <a href={`/admin/events/${event.id}/briefs/${b.id}`} class="block border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="font-mono text-sm text-white font-bold">{b.title}</p>
                  <p class="font-mono text-xs text-white/50 mt-0.5">{b.activation_type_name}</p>
                </div>
                <div class="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest">
                  <span class="text-white/50">{b.booking_count} booking{b.booking_count === 1 ? '' : 's'}</span>
                  <span class="px-2 py-0.5 rounded-full border
                    {b.status === 'sent' ? 'bg-brand-yellow/10 border-brand-yellow/20 text-brand-yellow' :
                     b.status === 'ready' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                     'bg-white/5 border-white/10 text-white/60'}">{b.status}</span>
                </div>
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
