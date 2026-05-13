<script lang="ts">
  import type { Zone, Task } from '$lib/types/db-types';
  import type { ZoneColor } from './zoneColors';
  import { zoneColorFor } from './zoneColors';
  import ZonePill from './ZonePill.svelte';
  import TaskRow from './TaskRow.svelte';

  export let zones: Zone[];
  export let tasks: Task[];
  export let zoneColorMap: Map<number, ZoneColor>;
  export let canEdit: boolean;
  export let eventId: number;

  $: tasksByZone = (() => {
    const m = new Map<number, Task[]>();
    for (const t of tasks) {
      if (t.zone_id == null) continue;
      const arr = m.get(t.zone_id) ?? [];
      arr.push(t);
      m.set(t.zone_id, arr);
    }
    return m;
  })();

  function openCount(zoneId: number): number {
    const arr = tasksByZone.get(zoneId) ?? [];
    return arr.filter((t) => t.status !== 'done').length;
  }
</script>

<section class="space-y-4">
  <div class="flex items-center justify-between">
    <h2 class="font-display text-xl font-bold">Zones</h2>
    {#if canEdit}
      <a href={`/admin/events/${eventId}/hub/zones/new`} class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-700 hover:border-gray-400 transition-colors">Add zone</a>
    {/if}
  </div>

  {#if zones.length === 0}
    <p class="text-sm text-gray-500">No zones yet.</p>
  {:else}
    <div class="space-y-4">
      {#each zones as z (z.id)}
        {@const zoneTasks = tasksByZone.get(z.id) ?? []}
        {@const oc = openCount(z.id)}
        <div class="border border-gray-200 rounded-2xl overflow-hidden bg-white">
          <div class="px-5 py-4 flex items-start justify-between gap-4 border-b border-gray-100">
            <div class="min-w-0 flex items-start gap-3 flex-wrap">
              <ZonePill label={z.name} color={zoneColorFor(zoneColorMap, z.id)} />
              <div class="min-w-0">
                {#if z.description}<p class="text-sm text-gray-600">{z.description}</p>{/if}
              </div>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <p class="font-mono text-xs text-gray-500 whitespace-nowrap">{oc} task{oc === 1 ? '' : 's'} open</p>
              {#if canEdit}
                <a href={`/admin/events/${eventId}/hub/zones/${z.id}/edit`} class="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-brand-black">edit</a>
              {/if}
            </div>
          </div>
          {#if zoneTasks.length > 0}
            <ul class="divide-y divide-gray-100">
              {#each zoneTasks as t (t.id)}
                <TaskRow task={t} {canEdit} {eventId} />
              {/each}
            </ul>
          {:else}
            <p class="px-5 py-4 text-sm text-gray-400">No tasks in this zone.</p>
          {/if}
          {#if canEdit}
            <div class="px-5 py-2 border-t border-gray-100 bg-gray-50/50">
              <a href={`/admin/events/${eventId}/hub/tasks/new?zone=${z.id}`} class="font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-brand-black">+ add task</a>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</section>
