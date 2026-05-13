<script lang="ts">
  import type { Task } from '$lib/types/db-types';
  import type { ZoneColor } from './zoneColors';
  import TaskRow from './TaskRow.svelte';

  export let tasks: Task[];
  export let zoneNameById: Map<number, string>;
  export let zoneColorMap: Map<number, ZoneColor>;
  export let canEdit: boolean;
  export let eventId: number;

  $: openTasks = tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      const ra = a.status === 'blocked' ? 0 : 1;
      const rb = b.status === 'blocked' ? 0 : 1;
      if (ra !== rb) return ra - rb;
      return a.display_order - b.display_order;
    });
</script>

<section class="space-y-3">
  <div class="flex items-center justify-between">
    <h2 class="font-display text-xl font-bold">Open items</h2>
    {#if canEdit}
      <a href={`/admin/events/${eventId}/hub/tasks/new`} class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-700 hover:border-gray-400 transition-colors">Add task</a>
    {/if}
  </div>

  {#if openTasks.length === 0}
    <p class="text-sm text-gray-500">Nothing open. All tasks are done.</p>
  {:else}
    <ul class="divide-y divide-gray-100 border border-gray-200 rounded-2xl bg-white">
      {#each openTasks as t (t.id)}
        <TaskRow
          task={t}
          {canEdit}
          {eventId}
          showZone={true}
          zoneLabel={t.zone_id != null ? (zoneNameById.get(t.zone_id) ?? null) : null}
        />
      {/each}
    </ul>
  {/if}
</section>
