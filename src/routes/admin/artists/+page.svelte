<script lang="ts">
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  $: ({ artists } = data);
</script>

<svelte:head><title>Artists | Admin</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="artists" />

  <div class="max-w-6xl mx-auto px-6 py-8">
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold text-brand-black">Artists</h1>
      <a href="/admin/artists/new" class="px-3 py-1.5 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors">+ New Artist</a>
    </div>

    {#if artists.length === 0}
      <div class="text-center py-20 border border-gray-200 rounded-lg">
        <p class="font-mono text-gray-400 text-sm">No artists yet. Add your first one.</p>
      </div>
    {:else}
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="w-full font-mono text-sm">
          <thead class="bg-gray-50">
            <tr class="text-left text-[10px] uppercase tracking-widest text-gray-500">
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">City</th>
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3 text-right">Bookings</th>
            </tr>
          </thead>
          <tbody>
            {#each artists as a (a.id)}
              <tr class="border-t border-gray-100 hover:bg-gray-50">
                <td class="px-4 py-3">
                  <a href={`/admin/artists/${a.id}`} class="text-brand-black hover:text-brand-yellow transition-colors font-bold">{a.name}</a>
                </td>
                <td class="px-4 py-3 text-gray-600">{a.city ?? '—'}</td>
                <td class="px-4 py-3 text-gray-600">
                  {#if a.email}<a href={`mailto:${a.email}`} class="hover:text-brand-yellow">{a.email}</a>{:else}—{/if}
                </td>
                <td class="px-4 py-3 text-right text-gray-600">{a.booking_count}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
