<script lang="ts">
  import type { Event } from '$lib/types/db-types';
  import type { HubActor } from '$lib/types/db-types';
  export let event: Pick<Event, 'id' | 'name' | 'client_name' | 'event_date' | 'location' | 'status'>;
  export let mode: HubActor;
  export let stats: {
    artistCount: number;
    totalCost: number;
    partnerSpend: number;
    openTaskCount: number;
  };
  export let shareExpiresAt: string | null = null;

  function fmtDate(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function money(n: number): string {
    return '$' + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
</script>

<div class="border border-gray-200 rounded-2xl px-6 py-5 space-y-5 bg-white">
  <div class="flex items-start justify-between gap-4">
    <div class="min-w-0">
      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">
        artistsafespaces.org · {(mode === 'admin') ? 'admin view' : 'partner view'}
      </p>
      <h1 class="font-display text-3xl md:text-4xl font-bold leading-tight">{event.name}</h1>
      <div class="mt-2 flex items-center gap-3 flex-wrap font-mono text-xs text-gray-600">
        {#if event.client_name}<span>{event.client_name}</span><span class="text-gray-300">·</span>{/if}
        {#if event.event_date}<span>{fmtDate(event.event_date)}</span><span class="text-gray-300">·</span>{/if}
        {#if event.location}<span>{event.location}</span>{/if}
        <span class="px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-widest
          {event.status === 'confirmed' ? 'bg-green-50 border-green-200 text-green-700' :
           event.status === 'live' ? 'bg-green-500/10 border-green-500/30 text-green-700' :
           event.status === 'wrapped' ? 'bg-gray-50 border-gray-200 text-gray-500' :
           event.status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-600' :
           'bg-gray-50 border-gray-200 text-gray-600'}">{event.status}</span>
      </div>
    </div>
    {#if !(mode === 'admin') && shareExpiresAt}
      <p class="font-mono text-[10px] text-gray-500 whitespace-nowrap">link expires {fmtDate(shareExpiresAt)}</p>
    {/if}
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div class="border border-gray-200 rounded-xl px-4 py-3">
      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500">artists booked</p>
      <p class="font-display text-2xl font-bold mt-1">{stats.artistCount}</p>
    </div>
    <div class="border border-gray-200 rounded-xl px-4 py-3">
      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500">total cost</p>
      <p class="font-display text-2xl font-bold mt-1">{money(stats.totalCost)}</p>
    </div>
    <div class="border border-gray-200 rounded-xl px-4 py-3">
      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500">partner spend</p>
      <p class="font-display text-2xl font-bold mt-1">{money(stats.partnerSpend)}</p>
    </div>
    <div class="border border-amber-200 bg-amber-50 rounded-xl px-4 py-3">
      <p class="font-mono text-[10px] uppercase tracking-widest text-amber-700">tasks open</p>
      <p class="font-display text-2xl font-bold mt-1 text-amber-900">{stats.openTaskCount}</p>
    </div>
  </div>
</div>
