<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import type { Task, TaskStatus } from '$lib/types/db-types';
  import StatusIcon from './StatusIcon.svelte';

  export let task: Task;
  export let canEdit: boolean;
  export let showZone = false;
  export let zoneLabel: string | null = null;
  export let eventId: number;

  const TASK_STATUSES: TaskStatus[] = ['open', 'blocked', 'done'];

  let inflight = false;

  function makeSubmit(nextStatus: TaskStatus) {
    return () => {
      const prev = task.status;
      task.status = nextStatus;
      task = task;
      inflight = true;
      return async ({ result }: { result: { type: string } }) => {
        if (result.type === 'failure' || result.type === 'error') {
          task.status = prev;
          task = task;
        }
        inflight = false;
        await invalidateAll();
      };
    };
  }
</script>

<li class="flex items-center gap-3 px-4 py-2.5">
  {#if canEdit}
    <div class="flex gap-1 shrink-0" role="group" aria-label="Task status">
      {#each TASK_STATUSES as s (s)}
        <form method="POST" action={`/admin/events/${eventId}/hub?/toggleTaskStatus`} use:enhance={makeSubmit(s)} class="inline">
          <input type="hidden" name="task_id" value={task.id} />
          <input type="hidden" name="status" value={s} />
          <button
            type="submit"
            disabled={inflight || task.status === s}
            aria-pressed={task.status === s}
            aria-label={`Mark ${s}`}
            class="inline-flex items-center justify-center w-5 h-5 rounded transition-colors
              {task.status === s && s === 'open' ? 'border border-gray-400 bg-gray-100' :
               task.status === s && s === 'blocked' ? 'border-2 border-amber-400 bg-amber-50' :
               task.status === s && s === 'done' ? 'border border-green-300 bg-green-50' :
               'border border-gray-200 bg-white hover:border-gray-400'}
              disabled:cursor-default"
          >
            {#if s === 'done'}
              <svg viewBox="0 0 16 16" class="w-3 h-3 {task.status === s ? 'text-green-700' : 'text-gray-300'}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 8 7 12 13 4" /></svg>
            {:else if s === 'blocked'}
              <span class="w-1.5 h-1.5 rounded-sm {task.status === s ? 'bg-amber-500' : 'bg-amber-300'}"></span>
            {/if}
          </button>
        </form>
      {/each}
    </div>
  {:else}
    <StatusIcon status={task.status} size="sm" />
  {/if}

  <div class="min-w-0 flex-1 flex items-baseline gap-2 flex-wrap">
    <span class="font-medium text-sm" class:line-through={task.status === 'done'} class:text-gray-400={task.status === 'done'}>{task.title}</span>
    {#if task.notes}<span class="text-sm text-gray-500">{task.notes}</span>{/if}
  </div>

  <div class="flex items-center gap-3 shrink-0 whitespace-nowrap">
    {#if showZone && zoneLabel}<span class="font-mono text-[10px] uppercase tracking-widest text-gray-500">{zoneLabel}</span>{/if}
    {#if task.owner}<span class="font-mono text-xs text-gray-600">{task.owner}</span>{/if}
    {#if canEdit}
      <a href={`/admin/events/${eventId}/hub/tasks/${task.id}/edit`} class="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-brand-black">edit</a>
    {/if}
  </div>
</li>
