<script lang="ts">
  import type { Event, Zone, Task } from '$lib/types/db-types';
  import type { HubActor } from '$lib/types/db-types';
  import type { ZoneColor } from './zoneColors';
  import { zoneColorFor } from './zoneColors';
  export let event: Pick<Event, 'id' | 'name' | 'client_name' | 'event_date' | 'location' | 'status'>;
  export let mode: HubActor;
  export let stats: {
    artistCount: number;
    totalCost: number;
    partnerSpend: number;
    openTaskCount: number;
  };
  export let shareExpiresAt: string | null = null;
  export let zones: Zone[] = [];
  export let tasks: Task[] = [];
  export let zoneColorMap: Map<number, ZoneColor> = new Map();
  export let activeZoneId: number | null = null;
  export let onSetActiveZone: (id: number | null) => void = () => {};

  $: openByZone = (() => {
    const m = new Map<number, number>();
    for (const t of tasks) {
      if (t.zone_id == null || t.status === 'done') continue;
      m.set(t.zone_id, (m.get(t.zone_id) ?? 0) + 1);
    }
    return m;
  })();

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

  {#if zones.length > 0}
    <div>
      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-2">jump to zone</p>
      <div class="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 snap-x">
        {#if activeZoneId !== null}
          <button
            type="button"
            on:click={() => onSetActiveZone(null)}
            class="snap-start shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest whitespace-nowrap bg-gray-900 border-gray-900 text-white hover:opacity-90 transition-opacity"
          >
            <span>All zones</span>
            <span class="font-bold">· {stats.openTaskCount}</span>
          </button>
        {/if}
        {#each zones as z (z.id)}
          {@const color = zoneColorFor(zoneColorMap, z.id)}
          {@const oc = openByZone.get(z.id) ?? 0}
          {@const isActive = activeZoneId === z.id}
          <button
            type="button"
            on:click={() => onSetActiveZone(isActive ? null : z.id)}
            class="snap-start shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest whitespace-nowrap hover:opacity-90 transition-opacity {isActive ? color.pillActive : color.pill}"
            aria-pressed={isActive}
          >
            <span>{z.name}</span>
            <span class="font-bold">· {oc}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  {#if mode === 'admin'}
    <details class="border border-gray-200 rounded-xl group">
      <summary class="px-4 py-3 cursor-pointer font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-brand-black select-none flex items-center justify-between">
        <span>view financials</span>
        <span class="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 pt-0">
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
      </div>
    </details>
  {/if}
</div>
