<script lang="ts">
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  $: ({ events } = data);

  function formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso.length <= 10 ? iso : iso + 'Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head><title>Events | Admin</title></svelte:head>

<div class="min-h-screen bg-brand-black text-white">
  <AdminHeader section="events" />

  <div class="max-w-6xl mx-auto px-6 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold text-white">Events</h1>
      <a href="/admin/events/new" class="px-3 py-1.5 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors">+ New Event</a>
    </div>

    {#if events.length === 0}
      <div class="text-center py-20 border border-white/10 rounded-lg">
        <p class="font-mono text-white/30 text-sm">No events yet.</p>
      </div>
    {:else}
      <div class="border border-white/10 rounded-lg overflow-hidden">
        <table class="w-full font-mono text-sm">
          <thead class="bg-white/5">
            <tr class="text-left text-[10px] uppercase tracking-widest text-white/40">
              <th class="px-4 py-3">Event</th>
              <th class="px-4 py-3">Client</th>
              <th class="px-4 py-3">Date</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-right">Briefs</th>
              <th class="px-4 py-3 text-right">Bookings</th>
            </tr>
          </thead>
          <tbody>
            {#each events as e (e.id)}
              <tr class="border-t border-white/5 hover:bg-white/[0.02]">
                <td class="px-4 py-3">
                  <a href={`/admin/events/${e.id}`} class="text-white hover:text-brand-yellow transition-colors font-bold">{e.name}</a>
                  {#if e.location}<div class="text-[10px] text-white/40 mt-0.5">{e.location}</div>{/if}
                </td>
                <td class="px-4 py-3 text-white/60">{e.client_name ?? '—'}</td>
                <td class="px-4 py-3 text-white/60">{formatDate(e.event_date)}</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-widest
                    {e.status === 'confirmed' ? 'bg-brand-yellow/10 border-brand-yellow/20 text-brand-yellow' :
                     e.status === 'live' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                     e.status === 'wrapped' ? 'bg-white/5 border-white/10 text-white/40' :
                     e.status === 'cancelled' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                     'bg-white/5 border-white/10 text-white/60'}">{e.status}</span>
                </td>
                <td class="px-4 py-3 text-right text-white/60">{e.brief_count}</td>
                <td class="px-4 py-3 text-right text-white/60">{e.booking_count}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
