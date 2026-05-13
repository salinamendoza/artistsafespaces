<script lang="ts">
  import { enhance } from '$app/forms';
  import { enhanceNoReset } from '$lib/utils/enhance';
  import { invalidateAll } from '$app/navigation';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import { formatDate as fmtDate } from '$lib/utils/date';
  import type { PageData, ActionData } from './$types';
  import type { Task, TaskStatus, Zone, Activity } from '$lib/types/db-types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ event, zones, activities, tasks } = data);

  $: zoneById = new Map<number, Zone>(zones.map((z) => [z.id, z]));
  $: activityById = new Map<number, Activity>(activities.map((a) => [a.id, a]));
  $: openTaskCount = tasks.filter((t) => t.status !== 'done').length;

  let partnerLinkOrigin = '';
  if (typeof window !== 'undefined') partnerLinkOrigin = window.location.origin;
  $: partnerLink =
    event.share_token && partnerLinkOrigin
      ? `${partnerLinkOrigin}/events/${event.id}/hub?token=${event.share_token}`
      : '';

  let copyState: 'idle' | 'copied' = 'idle';
  async function copyPartnerLink() {
    if (!partnerLink) return;
    await navigator.clipboard.writeText(partnerLink);
    copyState = 'copied';
    setTimeout(() => (copyState = 'idle'), 1500);
  }

  let inflight = new Set<number>();
  function isInflight(id: number) {
    return inflight.has(id);
  }
  function setInflight(id: number, on: boolean) {
    if (on) inflight.add(id);
    else inflight.delete(id);
    inflight = new Set(inflight);
  }

  function toggleSubmit(task: Task, nextStatus: TaskStatus) {
    return () => {
      const prev = task.status;
      task.status = nextStatus;
      tasks = tasks;
      setInflight(task.id, true);
      return async ({ result }: { result: { type: string } }) => {
        if (result.type === 'failure' || result.type === 'error') {
          task.status = prev;
          tasks = tasks;
        }
        setInflight(task.id, false);
        await invalidateAll();
      };
    };
  }

  function formatDate(iso: string | null): string {
    return fmtDate(iso, { month: 'short', day: 'numeric', year: 'numeric' }) || '';
  }

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

  function zoneLabel(zoneId: number | null): string {
    if (zoneId == null) return '';
    return zoneById.get(zoneId)?.name ?? '';
  }

  function rotateConfirm(evt: SubmitEvent) {
    if (
      !confirm(
        'This will break the current partner link. Anyone using it will see the expired page until you send the new link. Continue?'
      )
    ) {
      evt.preventDefault();
    }
  }
</script>

<svelte:head><title>{event.name} hub | Admin</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="events" crumbs={[{ label: event.name, href: `/admin/events/${event.id}` }, { label: 'Hub' }]} />

  <div class="max-w-5xl mx-auto px-6 py-8 space-y-8">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl font-bold">{event.name}</h1>
        <div class="mt-2 flex items-center gap-4 font-mono text-xs text-gray-500">
          {#if event.client_name}<span>{event.client_name}</span>{/if}
          <span>{formatDate(event.event_date)}</span>
          {#if event.location}<span>{event.location}</span>{/if}
          <span class="px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-widest
            {event.status === 'confirmed' ? 'bg-green-50 border-green-200 text-green-700' :
             event.status === 'live' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
             event.status === 'wrapped' ? 'bg-gray-50 border-gray-200 text-gray-500' :
             event.status === 'cancelled' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
             'bg-gray-50 border-gray-200 text-gray-600'}">{event.status}</span>
        </div>
      </div>
    </div>

    {#if form?.error}
      <p class="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    {/if}

    <!-- Partner link controls -->
    <div class="border border-gray-200 rounded-lg p-5 space-y-3">
      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500">Partner link</p>
      {#if partnerLink}
        <div class="flex items-center gap-2 flex-wrap">
          <code class="flex-1 min-w-0 text-xs font-mono text-gray-700 break-all bg-gray-50 px-3 py-2 rounded border border-gray-200">{partnerLink}</code>
          <button
            type="button"
            on:click={copyPartnerLink}
            class="px-3 py-2 bg-brand-yellow text-brand-black font-mono text-xs rounded hover:opacity-90 transition-opacity"
          >{copyState === 'copied' ? 'Copied' : 'Copy'}</button>
          <form method="POST" action="?/rotateToken" use:enhance={enhanceNoReset} on:submit={rotateConfirm}>
            <button type="submit" class="px-3 py-2 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-700 hover:border-gray-400 transition-colors">Rotate token</button>
          </form>
        </div>
        {#if event.share_expires_at}
          <p class="font-mono text-[10px] text-gray-500">expires {formatDate(event.share_expires_at)}</p>
        {/if}
      {:else}
        <p class="text-sm text-gray-500">No share token yet. Run the 0012 backfill to generate one.</p>
      {/if}
    </div>

    <!-- Stat row (placeholder — full grid lands in step 4) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="border border-gray-200 rounded-lg px-5 py-4">
        <p class="font-mono text-3xl font-bold">{zones.length}</p>
        <p class="font-mono text-xs text-gray-500 mt-1">zone{zones.length === 1 ? '' : 's'}</p>
      </div>
      <div class="border border-gray-200 rounded-lg px-5 py-4">
        <p class="font-mono text-3xl font-bold">{activities.length}</p>
        <p class="font-mono text-xs text-gray-500 mt-1">activit{activities.length === 1 ? 'y' : 'ies'}</p>
      </div>
      <div class="border border-gray-200 rounded-lg px-5 py-4">
        <p class="font-mono text-3xl font-bold">{tasks.length}</p>
        <p class="font-mono text-xs text-gray-500 mt-1">task{tasks.length === 1 ? '' : 's'} total</p>
      </div>
      <div class="border border-amber-200 bg-amber-50 rounded-lg px-5 py-4">
        <p class="font-mono text-3xl font-bold">{openTaskCount}</p>
        <p class="font-mono text-xs text-amber-700 mt-1">task{openTaskCount === 1 ? '' : 's'} open</p>
      </div>
    </div>

    <!-- Zones (placeholder list) -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-xl font-bold">Zones</h2>
        <a href={`/admin/events/${event.id}/hub/zones/new`} class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-700 hover:border-gray-400 transition-colors">Add zone</a>
      </div>
      {#if zones.length === 0}
        <p class="text-sm text-gray-500">No zones yet.</p>
      {:else}
        <ul class="divide-y divide-gray-100 border border-gray-200 rounded-lg">
          {#each zones as z}
            <li class="px-4 py-3 flex items-center justify-between gap-4">
              <div class="min-w-0">
                <p class="font-medium">{z.name}</p>
                {#if z.description}<p class="text-sm text-gray-500">{z.description}</p>{/if}
              </div>
              <a href={`/admin/events/${event.id}/hub/zones/${z.id}/edit`} class="font-mono text-xs text-gray-500 hover:text-brand-black">Edit</a>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <!-- Activities (placeholder list) -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-xl font-bold">Activities</h2>
        <a href={`/admin/events/${event.id}/hub/activities/new`} class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-700 hover:border-gray-400 transition-colors">Add activity</a>
      </div>
      {#if activities.length === 0}
        <p class="text-sm text-gray-500">No activities yet.</p>
      {:else}
        <ul class="divide-y divide-gray-100 border border-gray-200 rounded-lg">
          {#each activities as a}
            <li class="px-4 py-3 flex items-center justify-between gap-4">
              <div class="min-w-0 flex items-center gap-4">
                <span class="font-mono text-xs text-gray-500 whitespace-nowrap">{formatTime(a.start_time)}{a.end_time ? ` – ${formatTime(a.end_time)}` : ''}</span>
                <div>
                  <p class="font-medium">{a.title}</p>
                  {#if a.notes}<p class="text-sm text-gray-500">{a.notes}</p>{/if}
                </div>
                {#if a.zone_id}<span class="font-mono text-[10px] uppercase tracking-widest text-gray-500">{zoneLabel(a.zone_id)}</span>{/if}
              </div>
              <a href={`/admin/events/${event.id}/hub/activities/${a.id}/edit`} class="font-mono text-xs text-gray-500 hover:text-brand-black">Edit</a>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <!-- Tasks (placeholder list + three-button toggle) -->
    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-display text-xl font-bold">Tasks</h2>
        <a href={`/admin/events/${event.id}/hub/tasks/new`} class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-700 hover:border-gray-400 transition-colors">Add task</a>
      </div>
      {#if tasks.length === 0}
        <p class="text-sm text-gray-500">No tasks yet.</p>
      {:else}
        <ul class="divide-y divide-gray-100 border border-gray-200 rounded-lg">
          {#each tasks as t (t.id)}
            <li class="px-4 py-3 flex items-center justify-between gap-4">
              <div class="min-w-0 flex items-center gap-3 flex-1">
                <div class="flex gap-1" role="group" aria-label="Task status">
                  {#each ['open', 'blocked', 'done'] as s (s)}
                    <form method="POST" action="?/toggleTaskStatus" use:enhance={toggleSubmit(t, s as TaskStatus)} class="inline">
                      <input type="hidden" name="task_id" value={t.id} />
                      <input type="hidden" name="status" value={s} />
                      <button
                        type="submit"
                        disabled={isInflight(t.id) || t.status === s}
                        aria-label={`Mark ${s}`}
                        aria-pressed={t.status === s}
                        class="px-2 py-0.5 rounded border text-[10px] font-mono uppercase tracking-widest transition-colors
                          {t.status === s && s === 'open' ? 'bg-gray-100 border-gray-400 text-gray-700' :
                           t.status === s && s === 'blocked' ? 'bg-amber-50 border-amber-300 text-amber-700' :
                           t.status === s && s === 'done' ? 'bg-green-50 border-green-300 text-green-700' :
                           'bg-white border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700'}
                          disabled:opacity-60 disabled:cursor-default"
                      >{s}</button>
                    </form>
                  {/each}
                </div>
                <div class="min-w-0">
                  <p class="font-medium" class:line-through={t.status === 'done'} class:text-gray-400={t.status === 'done'}>{t.title}</p>
                  {#if t.notes}<p class="text-sm text-gray-500">{t.notes}</p>{/if}
                </div>
              </div>
              <div class="flex items-center gap-3 whitespace-nowrap">
                {#if t.zone_id}<span class="font-mono text-[10px] uppercase tracking-widest text-gray-500">{zoneLabel(t.zone_id)}</span>{/if}
                {#if t.owner}<span class="font-mono text-xs text-gray-500">{t.owner}</span>{/if}
                <a href={`/admin/events/${event.id}/hub/tasks/${t.id}/edit`} class="font-mono text-xs text-gray-500 hover:text-brand-black">Edit</a>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  </div>
</div>
