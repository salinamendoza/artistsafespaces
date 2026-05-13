<script lang="ts">
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import type { Task, TaskStatus, HubActor } from '$lib/types/db-types';

  export let task: Task;
  export let mode: HubActor;
  export let navUrl: (suffix: string) => string;
  export let actionUrl: (name: string) => string;
  export let showZone = false;
  export let zoneLabel: string | null = null;

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

<li class="flex items-center gap-3 px-4 py-2">
  <div class="flex items-center gap-0.5 shrink-0" role="group" aria-label="Task status">
    {#each TASK_STATUSES as s (s)}
      <form
        method="POST"
        action={actionUrl('toggleTaskStatus')}
        use:enhance={makeSubmit(s)}
        class="contents"
      >
        <input type="hidden" name="task_id" value={task.id} />
        <input type="hidden" name="status" value={s} />
        <button
          type="submit"
          disabled={inflight || task.status === s}
          aria-pressed={task.status === s}
          aria-label={`Mark ${s}`}
          class="inline-flex items-center justify-center w-4 h-4 rounded-sm transition-colors
            {task.status === s && s === 'open' ? 'border border-gray-500' :
             task.status === s && s === 'blocked' ? 'border border-amber-500' :
             task.status === s && s === 'done' ? 'border border-green-600 text-green-700' :
             'border border-gray-200 hover:border-gray-400'}
            disabled:cursor-default"
        >
          {#if s === 'done' && task.status === s}
            <svg viewBox="0 0 16 16" class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 8 7 12 13 4" /></svg>
          {/if}
        </button>
      </form>
    {/each}
  </div>

  <div class="min-w-0 flex-1 flex items-baseline gap-2 flex-wrap">
    <span class="text-sm" class:font-medium={task.status !== 'done'} class:line-through={task.status === 'done'} class:text-gray-400={task.status === 'done'}>{task.title}</span>
    {#if task.notes}<span class="text-sm text-gray-500">{task.notes}</span>{/if}
  </div>

  <div class="flex items-center gap-3 shrink-0 whitespace-nowrap">
    {#if task.created_by === 'partner'}
      <span class="font-mono text-[9px] uppercase tracking-widest text-gray-400" title="Added by a partner">via partner</span>
    {/if}
    {#if showZone && zoneLabel}<span class="font-mono text-[10px] uppercase tracking-widest text-gray-500">{zoneLabel}</span>{/if}
    {#if task.owner}<span class="font-mono text-xs text-gray-600">{task.owner}</span>{/if}
    {#if mode === 'admin'}
      <a href={navUrl(`/tasks/${task.id}/edit`)} class="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-brand-black">edit</a>
    {/if}
  </div>
</li>
