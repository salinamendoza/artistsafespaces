<script lang="ts">
  import { enhance } from '$app/forms';
  import { formatDate } from '$lib/utils/date';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: artist = data.artist;
  $: appearances = data.appearances;
  $: liveAppearance = appearances.find((a) => a.giveaway) ?? appearances[0] ?? null;
  $: giveaway = liveAppearance?.giveaway ?? null;

  function eyebrow(a: typeof liveAppearance): string {
    if (!a) return '';
    const parts: string[] = [];
    if (a.role) parts.push(a.role);
    parts.push(a.campaign.title);
    if (a.campaign.event_date) {
      const d = formatDate(a.campaign.event_date, { month: 'short', day: 'numeric' });
      if (d) parts.push(d);
    }
    if (a.campaign.location) parts.push(a.campaign.location);
    return parts.join(' · ');
  }

  let submitting = false;

  $: generalError = form && 'error' in form && !('field' in form) ? form.error : null;
  $: fieldErrors = (() => {
    const out: Record<string, string> = {};
    if (form && 'field' in form && 'error' in form && form.field && form.error) {
      out[form.field] = form.error;
    }
    return out;
  })();
</script>

<svelte:head>
  <title>{artist.display_name} | Artist Safespaces</title>
  <meta name="description" content={artist.bio ?? `${artist.display_name} on Artist Safespaces`} />
</svelte:head>

<div class="bg-white text-brand-black">
  <div class="max-w-3xl mx-auto px-6 py-12 md:py-16">
    {#if liveAppearance}
      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-3">
        {eyebrow(liveAppearance)}
      </p>
    {/if}

    <h1 class="font-display text-5xl md:text-6xl font-bold leading-[0.95] mb-6">{artist.display_name}</h1>

    {#if artist.bio}
      <p class="text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl">{artist.bio}</p>
    {/if}

    {#if artist.instagram_handle}
      <a
        href={`https://instagram.com/${artist.instagram_handle}`}
        target="_blank"
        rel="noopener"
        class="inline-block font-mono text-xs text-brand-black border-b border-brand-black pb-0.5 hover:border-transparent"
      >@{artist.instagram_handle}</a>
    {/if}

    {#if giveaway && liveAppearance}
      <section class="mt-14 bg-brand-black text-white rounded-2xl p-8 md:p-10">
        <p class="font-mono text-[10px] uppercase tracking-widest text-brand-yellow mb-3">
          {giveaway.title}
        </p>
        <h2 class="font-display text-3xl md:text-4xl font-bold leading-tight mb-4">
          Enter to win a custom mural.
        </h2>
        {#if giveaway.description}
          <p class="text-gray-300 leading-relaxed mb-8 max-w-xl">{giveaway.description}</p>
        {/if}

        {#if form && 'success' in form && form.success}
          <div class="py-6">
            <p class="font-display text-2xl font-bold text-brand-yellow mb-2">You’re in.</p>
            <p class="font-mono text-sm text-gray-300">We’ll reach out if you win.</p>
          </div>
        {:else}
          <form
            method="POST"
            action="?/enter"
            class="space-y-4"
            use:enhance={() => {
              submitting = true;
              return async ({ update }) => {
                await update({ reset: false });
                submitting = false;
              };
            }}
          >
            <input type="hidden" name="giveaway_id" value={giveaway.id} />

            <div>
              <label for="ge-name" class="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Name</label>
              <input
                id="ge-name"
                type="text"
                name="name"
                required
                autocomplete="name"
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-yellow"
              />
              {#if fieldErrors.name}<p class="mt-1 font-mono text-[11px] text-red-300">{fieldErrors.name}</p>{/if}
            </div>

            <div>
              <label for="ge-email" class="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Email</label>
              <input
                id="ge-email"
                type="email"
                name="email"
                required
                autocomplete="email"
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-yellow"
              />
              {#if fieldErrors.email}<p class="mt-1 font-mono text-[11px] text-red-300">{fieldErrors.email}</p>{/if}
            </div>

            <div>
              <label for="ge-phone" class="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Phone</label>
              <input
                id="ge-phone"
                type="tel"
                name="phone"
                required
                autocomplete="tel"
                class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-yellow"
              />
              {#if fieldErrors.phone}<p class="mt-1 font-mono text-[11px] text-red-300">{fieldErrors.phone}</p>{/if}
            </div>

            <div>
              <label for="ge-ig" class="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Instagram (optional)</label>
              <div class="flex items-stretch border border-white/20 rounded focus-within:border-brand-yellow bg-white/5">
                <span class="px-3 flex items-center font-mono text-sm text-gray-400">@</span>
                <input
                  id="ge-ig"
                  type="text"
                  name="instagram_handle"
                  autocomplete="off"
                  class="flex-1 px-2 py-3 bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
              {#if fieldErrors.instagram_handle}<p class="mt-1 font-mono text-[11px] text-red-300">{fieldErrors.instagram_handle}</p>{/if}
            </div>

            {#if generalError}
              <p class="font-mono text-xs text-red-300">{generalError}</p>
            {/if}

            <button
              type="submit"
              disabled={submitting}
              class="w-full py-4 bg-brand-yellow text-brand-black font-mono text-sm font-bold uppercase tracking-widest rounded hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Entering…' : 'Enter'}
            </button>

            <p class="font-mono text-[11px] text-gray-500 text-center">
              We’ll only contact you about this giveaway. No list-sharing.
            </p>
          </form>
        {/if}
      </section>
    {/if}
  </div>
</div>
