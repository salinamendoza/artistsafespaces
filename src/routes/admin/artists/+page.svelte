<script lang="ts">
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  $: ({ artists } = data);
</script>

<svelte:head><title>Artists | Admin</title></svelte:head>

<div class="min-h-screen bg-brand-black text-white">
  <AdminHeader section="artists" />

  <div class="max-w-6xl mx-auto px-6 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold text-white">Artists</h1>
      <a href="/admin/artists/new" class="px-3 py-1.5 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors">+ New Artist</a>
    </div>

    {#if artists.length === 0}
      <div class="text-center py-20 border border-white/10 rounded-lg">
        <p class="font-mono text-white/30 text-sm">No artists yet. Add your first one.</p>
      </div>
    {:else}
      <div class="border border-white/10 rounded-lg overflow-hidden">
        <table class="w-full font-mono text-sm">
          <thead class="bg-white/5">
            <tr class="text-left text-[10px] uppercase tracking-widest text-white/40">
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">City</th>
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3 text-right">Bookings</th>
            </tr>
          </thead>
          <tbody>
            {#each artists as a (a.id)}
              <tr class="border-t border-white/5 hover:bg-white/[0.02]">
                <td class="px-4 py-3">
                  <a href={`/admin/artists/${a.id}`} class="text-white hover:text-brand-yellow transition-colors font-bold">{a.name}</a>
                </td>
                <td class="px-4 py-3 text-white/60">{a.city ?? '—'}</td>
                <td class="px-4 py-3 text-white/60">
                  {#if a.email}<a href={`mailto:${a.email}`} class="hover:text-brand-yellow">{a.email}</a>{:else}—{/if}
                </td>
                <td class="px-4 py-3 text-right text-white/60">{a.booking_count}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
