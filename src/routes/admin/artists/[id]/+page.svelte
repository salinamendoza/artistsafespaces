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

  function styleImages(json: string | null): string[] {
    if (!json) return [];
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed.map((s) => String(s)) : [];
    } catch {
      return [];
    }
  }

  function formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso.length <= 10 ? iso : iso + 'Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  let copiedKey: string | null = null;
  function copyValue(key: string, value: string) {
    navigator.clipboard.writeText(value);
    copiedKey = key;
    setTimeout(() => (copiedKey = null), 1500);
  }

  $: gallery = styleImages(artist.style_images_json);
  $: hasImages = Boolean(artist.headshot_url || artist.studio_url || gallery.length);
</script>

<svelte:head><title>{artist.name} | Admin</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="artists" crumbs={[{ label: artist.name }]} />

  <div class="max-w-4xl mx-auto px-6 py-8 space-y-8">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl font-bold text-brand-black">{artist.name}</h1>
        {#if artist.city}<p class="font-mono text-xs text-gray-500 mt-1">{artist.city}</p>{/if}
      </div>
      <div class="flex gap-2">
        <a href={`/admin/artists/${artist.id}/edit`} class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-700 hover:border-gray-400 hover:text-brand-black transition-colors">Edit</a>
        <form method="POST" action="?/delete" use:enhance>
          <button type="submit" class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-colors">Delete</button>
        </form>
      </div>
    </div>

    {#if form?.error}
      <p class="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    {/if}

    {#if hasImages}
      <div class="border border-gray-200 rounded-lg p-5">
        <div class="flex flex-wrap items-start gap-6">
          {#if artist.headshot_url}
            <img src={artist.headshot_url} alt={`${artist.name} headshot`} class="w-40 h-40 rounded-full object-cover border border-gray-200 bg-gray-50" />
          {/if}
          {#if artist.studio_url}
            <img src={artist.studio_url} alt={`${artist.name} studio`} class="w-56 h-40 rounded-lg object-cover border border-gray-200 bg-gray-50" />
          {/if}
        </div>
        {#if gallery.length}
          <div class="mt-5">
            <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-2">Style</p>
            <div class="flex flex-wrap gap-3">
              {#each gallery as url, i}
                <img src={url} alt={`${artist.name} style ${i + 1}`} class="w-32 h-32 rounded-lg object-cover border border-gray-200 bg-gray-50" />
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Contact + profile -->
    <div class="border border-gray-200 rounded-lg p-5">
      <dl class="grid sm:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <dt class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Email</dt>
          <dd class="font-mono text-sm text-brand-black flex items-center gap-2">
            {#if artist.email}
              <a href={`mailto:${artist.email}`} class="hover:text-brand-black">{artist.email}</a>
              <button type="button" on:click={() => copyValue('email', artist.email ?? '')} class="px-2 py-1 bg-brand-yellow text-brand-black font-mono text-[10px] font-bold rounded hover:bg-yellow-300">{copiedKey === 'email' ? 'Copied' : 'Copy'}</button>
            {:else}—{/if}
          </dd>
        </div>
        <div>
          <dt class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Phone</dt>
          <dd class="font-mono text-sm text-brand-black flex items-center gap-2">
            {#if artist.phone}
              <span>{artist.phone}</span>
              <button type="button" on:click={() => copyValue('phone', artist.phone ?? '')} class="px-2 py-1 bg-brand-yellow text-brand-black font-mono text-[10px] font-bold rounded hover:bg-yellow-300">{copiedKey === 'phone' ? 'Copied' : 'Copy'}</button>
            {:else}—{/if}
          </dd>
        </div>
        <div>
          <dt class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Portfolio</dt>
          <dd class="font-mono text-sm text-brand-black flex items-center gap-2 min-w-0">
            {#if artist.portfolio_url}
              <a href={artist.portfolio_url} target="_blank" rel="noopener" class="hover:text-brand-black underline truncate">{artist.portfolio_url}</a>
              <button type="button" on:click={() => copyValue('portfolio', artist.portfolio_url ?? '')} class="px-2 py-1 bg-brand-yellow text-brand-black font-mono text-[10px] font-bold rounded hover:bg-yellow-300 shrink-0">{copiedKey === 'portfolio' ? 'Copied' : 'Copy'}</button>
            {:else}—{/if}
          </dd>
        </div>
        <div>
          <dt class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Instagram</dt>
          <dd class="font-mono text-sm text-brand-black flex items-center gap-2">
            {#if artist.instagram_handle}
              <span>{artist.instagram_handle}</span>
              <button type="button" on:click={() => copyValue('instagram', artist.instagram_handle ?? '')} class="px-2 py-1 bg-brand-yellow text-brand-black font-mono text-[10px] font-bold rounded hover:bg-yellow-300">{copiedKey === 'instagram' ? 'Copied' : 'Copy'}</button>
            {:else}—{/if}
          </dd>
        </div>
      </dl>

      {#if artist.bio}
        <div class="mt-5">
          <dt class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Bio</dt>
          <dd class="text-sm text-gray-800 whitespace-pre-wrap">{artist.bio}</dd>
        </div>
      {/if}

      {#if specialties(artist.specialties_json).length}
        <div class="mt-5">
          <dt class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-2">Specialties</dt>
          <dd class="flex flex-wrap gap-2">
            {#each specialties(artist.specialties_json) as slug}
              <span class="px-2 py-0.5 bg-gray-100 text-gray-700 font-mono text-[10px] rounded-full border border-gray-200">{slug}</span>
            {/each}
          </dd>
        </div>
      {/if}

      {#if artist.internal_notes}
        <div class="mt-5">
          <dt class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Internal Notes</dt>
          <dd class="text-sm text-gray-700 whitespace-pre-wrap">{artist.internal_notes}</dd>
        </div>
      {/if}
    </div>

    <!-- Bookings -->
    <div>
      <h2 class="font-display text-xl font-bold text-brand-black mb-3">Bookings</h2>
      {#if bookings.length === 0}
        <p class="font-mono text-xs text-gray-400 py-6 text-center border border-gray-200 rounded-lg">No bookings yet.</p>
      {:else}
        <div class="space-y-2">
          {#each bookings as b}
            <a href={`/admin/events/${b.event_id}/briefs/${b.brief_id}`} class="block border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="font-mono text-sm text-brand-black font-bold">{b.event_name}</p>
                  <p class="font-mono text-xs text-gray-500 mt-0.5">{b.brief_title}</p>
                </div>
                <div class="flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest">
                  <span class="text-gray-500">{formatDate(b.event_date)}</span>
                  <span class="px-2 py-0.5 rounded-full border
                    {b.status === 'accepted' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                     b.status === 'declined' ? 'bg-gray-50 border-gray-200 text-gray-500' :
                     b.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' :
                     'bg-gray-50 border-gray-200 text-gray-600'}">{b.status}</span>
                  <span class="text-gray-500">${b.rate}</span>
                </div>
              </div>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
