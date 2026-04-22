<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: artist = data.artist;
  $: bookings = data.bookings;

  function specialties(json: string | null): string[] {
    if (!json) return [];
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso.length <= 10 ? iso : iso + 'Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head><title>{artist.name} | Admin</title></svelte:head>

<div class="min-h-screen bg-brand-black text-white">
  <AdminHeader section="artists" crumbs={[{ label: artist.name }]} />

  <div class="max-w-4xl mx-auto px-6 py-8 space-y-8">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl font-bold text-white">{artist.name}</h1>
        {#if artist.city}<p class="font-mono text-xs text-white/50 mt-1">{artist.city}</p>{/if}
      </div>
      <div class="flex gap-2">
        <a href={`/admin/artists/${artist.id}/edit`} class="px-3 py-1.5 bg-white/5 border border-white/10 rounded font-mono text-xs text-white/70 hover:border-brand-yellow/30 hover:text-brand-yellow transition-colors">Edit</a>
        <form method="POST" action="?/delete" use:enhance>
          <button type="submit" class="px-3 py-1.5 bg-white/5 border border-white/10 rounded font-mono text-xs text-white/50 hover:text-red-400 hover:border-red-400/30 transition-colors">Delete</button>
        </form>
      </div>
    </div>

    {#if form?.error}
      <p class="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    {/if}

    <!-- Contact + profile -->
    <div class="border border-white/10 rounded-lg p-5">
      <dl class="grid sm:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <dt class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Email</dt>
          <dd class="font-mono text-sm text-white">{#if artist.email}<a href={`mailto:${artist.email}`} class="hover:text-brand-yellow">{artist.email}</a>{:else}—{/if}</dd>
        </div>
        <div>
          <dt class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Phone</dt>
          <dd class="font-mono text-sm text-white">{artist.phone ?? '—'}</dd>
        </div>
        <div>
          <dt class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Portfolio</dt>
          <dd class="font-mono text-sm text-white">{#if artist.portfolio_url}<a href={artist.portfolio_url} target="_blank" rel="noopener" class="hover:text-brand-yellow underline">{artist.portfolio_url}</a>{:else}—{/if}</dd>
        </div>
        <div>
          <dt class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Instagram</dt>
          <dd class="font-mono text-sm text-white">{artist.instagram_handle ?? '—'}</dd>
        </div>
      </dl>

      {#if artist.bio}
        <div class="mt-5">
          <dt class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Bio</dt>
          <dd class="text-sm text-white/80 whitespace-pre-wrap">{artist.bio}</dd>
        </div>
      {/if}

      {#if specialties(artist.specialties_json).length}
        <div class="mt-5">
          <dt class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">Specialties</dt>
          <dd class="flex flex-wrap gap-2">
            {#each specialties(artist.specialties_json) as slug}
              <span class="px-2 py-0.5 bg-brand-yellow/10 text-brand-yellow font-mono text-[10px] rounded-full border border-brand-yellow/20">{slug}</span>
            {/each}
          </dd>
        </div>
      {/if}

      {#if artist.internal_notes}
        <div class="mt-5">
          <dt class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Internal Notes</dt>
          <dd class="text-sm text-white/70 whitespace-pre-wrap">{artist.internal_notes}</dd>
        </div>
      {/if}
    </div>

    <!-- Bookings -->
    <div>
      <h2 class="font-display text-xl font-bold text-white mb-3">Bookings</h2>
      {#if bookings.length === 0}
        <p class="font-mono text-xs text-white/30 py-6 text-center border border-white/10 rounded-lg">No bookings yet.</p>
      {:else}
        <div class="space-y-2">
          {#each bookings as b}
            <a href={`/admin/events/${b.event_id}/briefs/${b.brief_id}`} class="block border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="font-mono text-sm text-white font-bold">{b.event_name}</p>
                  <p class="font-mono text-xs text-white/50 mt-0.5">{b.brief_title}</p>
                </div>
                <div class="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest">
                  <span class="text-white/40">{formatDate(b.event_date)}</span>
                  <span class="px-2 py-0.5 rounded-full border
                    {b.status === 'accepted' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                     b.status === 'declined' ? 'bg-white/5 border-white/10 text-white/40' :
                     b.status === 'completed' ? 'bg-brand-yellow/10 border-brand-yellow/20 text-brand-yellow' :
                     'bg-white/5 border-white/10 text-white/60'}">{b.status}</span>
                  <span class="text-white/40">${b.rate}</span>
                </div>
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
