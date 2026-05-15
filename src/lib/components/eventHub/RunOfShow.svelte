<script lang="ts">
  import type { Activity, HubActor } from '$lib/types/db-types';
  import type { ZoneColor } from './zoneColors';
  import { zoneColorFor } from './zoneColors';
  import ZonePill from './ZonePill.svelte';

  export let activities: Activity[];
  export let zoneNameById: Map<number, string>;
  export let zoneColorMap: Map<number, ZoneColor>;
  export let mode: HubActor;
  export let navUrl: (suffix: string) => string;
  export let activeZoneId: number | null = null;

  $: visibleActivities = activeZoneId == null ? activities : activities.filter((a) => a.zone_id === activeZoneId);

  function formatTime(iso: string | null): string {
    if (!iso) return '';
    const m = iso.match(/T(\d{2}):(\d{2})/);
    if (!m) return iso;
    let h = parseInt(m[1]);
    const min = m[2];
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${min} ${suffix}`;
  }
</script>

<section class="space-y-3">
  <div class="flex items-center justify-between">
    <h2 class="font-display text-xl font-bold">Run of show</h2>
    <a href={navUrl('/activities/new')} class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-700 hover:border-gray-400 transition-colors">Add activity</a>
  </div>
  {#if activities.length === 0}
    <p class="text-sm text-gray-500">No activities yet.</p>
  {:else if visibleActivities.length === 0}
    <p class="text-sm text-gray-500">No activities in this zone.</p>
  {:else}
    <div class="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <div class="hidden lg:grid grid-cols-[110px_1fr_auto] gap-4 px-5 py-3 border-b border-gray-200 bg-gray-50 font-mono text-[10px] uppercase tracking-widest text-gray-500">
        <span>Time</span>
        <span>What</span>
        <span class="text-right">Where</span>
      </div>
      {#each visibleActivities as a}
        <div class="block lg:grid lg:grid-cols-[110px_1fr_auto] gap-4 px-5 py-4 lg:py-3 border-b border-gray-100 last:border-b-0 lg:items-start">
          <div class="font-mono text-xs text-gray-700 flex lg:block items-center gap-2 mb-2 lg:mb-0">
            <span>{formatTime(a.start_time)}</span>
            {#if a.end_time}<span class="text-gray-400 lg:block">– {formatTime(a.end_time)}</span>{/if}
          </div>
          <div class="min-w-0">
            <p class="font-medium text-sm">{a.title}</p>
            {#if a.notes}<p class="text-sm text-gray-500 mt-0.5">{a.notes}</p>{/if}
            {#if a.zone_id != null && zoneNameById.has(a.zone_id)}
              <div class="lg:hidden mt-2">
                <ZonePill label={zoneNameById.get(a.zone_id) ?? ''} color={zoneColorFor(zoneColorMap, a.zone_id)} size="sm" />
              </div>
            {/if}
          </div>
          <div class="hidden lg:flex pt-0.5 items-center gap-2 justify-end">
            {#if a.zone_id != null && zoneNameById.has(a.zone_id)}
              <ZonePill label={zoneNameById.get(a.zone_id) ?? ''} color={zoneColorFor(zoneColorMap, a.zone_id)} size="sm" />
            {/if}
            {#if mode === 'admin'}
              <a href={navUrl(`/activities/${a.id}/edit`)} class="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-brand-black">edit</a>
            {/if}
          </div>
          {#if mode === 'admin'}
            <div class="lg:hidden mt-2">
              <a href={navUrl(`/activities/${a.id}/edit`)} class="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-brand-black">edit</a>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</section>
