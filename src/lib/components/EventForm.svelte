<script lang="ts">
  import type { Event } from '$lib/server/db-types';

  export let event: Partial<Event> = {};
  export let submitLabel = 'Save';
  export let error: string | null = null;

  const STATUSES: Event['status'][] = ['planning', 'confirmed', 'live', 'wrapped', 'cancelled'];
</script>

<form method="POST" class="space-y-5">
  {#if error}
    <p class="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{error}</p>
  {/if}

  <div>
    <label for="name" class="block font-mono text-xs text-white/60 mb-1.5">Event Name <span class="text-brand-yellow">*</span></label>
    <input id="name" name="name" type="text" required value={event.name ?? ''} class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-brand-yellow/40" />
  </div>

  <div class="grid sm:grid-cols-2 gap-4">
    <div>
      <label for="client_name" class="block font-mono text-xs text-white/60 mb-1.5">Client</label>
      <input id="client_name" name="client_name" type="text" placeholder="IKEA, etc." value={event.client_name ?? ''} class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-brand-yellow/40" />
    </div>
    <div>
      <label for="event_date" class="block font-mono text-xs text-white/60 mb-1.5">Event Date</label>
      <input id="event_date" name="event_date" type="date" value={event.event_date ?? ''} class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-brand-yellow/40" />
    </div>
    <div>
      <label for="location" class="block font-mono text-xs text-white/60 mb-1.5">Location</label>
      <input id="location" name="location" type="text" value={event.location ?? ''} class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-brand-yellow/40" />
    </div>
    <div>
      <label for="status" class="block font-mono text-xs text-white/60 mb-1.5">Status</label>
      <select id="status" name="status" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-brand-yellow/40" value={event.status ?? 'planning'}>
        {#each STATUSES as s}
          <option value={s} class="bg-brand-black">{s}</option>
        {/each}
      </select>
    </div>
  </div>

  <div>
    <label for="internal_notes" class="block font-mono text-xs text-white/60 mb-1.5">Internal Notes</label>
    <textarea id="internal_notes" name="internal_notes" rows="4" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-brand-yellow/40">{event.internal_notes ?? ''}</textarea>
  </div>

  <div class="flex items-center gap-3">
    <button type="submit" class="px-4 py-2 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors">{submitLabel}</button>
  </div>
</form>
