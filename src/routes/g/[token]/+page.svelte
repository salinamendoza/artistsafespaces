<script lang="ts">
  import { enhance } from '$app/forms';
  import { formatDate } from '$lib/utils/date';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: view = data.view;
  $: giveaway = view.giveaway;

  function eyebrow(): string {
    const parts: string[] = [view.activation_type_name, view.event_name];
    if (view.event_date) {
      const d = formatDate(view.event_date, { month: 'short', day: 'numeric' });
      if (d) parts.push(d);
    }
    if (view.event_location) parts.push(view.event_location);
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
  <title>{giveaway.title} | Artist Safespaces</title>
  <meta name="description" content={giveaway.description ?? `Enter to win a mural by ${view.artist_name}`} />
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="bg-white text-brand-black min-h-screen">
  <div class="max-w-xl mx-auto px-6 py-14 md:py-20">
    {#if view.artist_headshot_url}
      <img
        src={view.artist_headshot_url}
        alt={view.artist_name}
        class="w-24 h-24 rounded-full object-cover mb-8"
      />
    {/if}

    <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-3">{eyebrow()}</p>

    <h1 class="font-display text-5xl md:text-6xl font-bold leading-[0.95] mb-5">{view.artist_name}</h1>

    {#if view.artist_bio}
      <p class="text-base md:text-lg text-gray-700 leading-relaxed mb-5">{view.artist_bio}</p>
    {/if}

    {#if view.artist_instagram}
      <a
        href={`https://instagram.com/${view.artist_instagram}`}
        target="_blank"
        rel="noopener"
        class="inline-block font-mono text-xs text-brand-black border-b border-brand-black pb-0.5 hover:border-transparent"
      >@{view.artist_instagram}</a>
    {/if}

    <hr class="my-12 border-gray-200" />

    <h2 class="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">{giveaway.title}</h2>

    {#if giveaway.description}
      <p class="text-base text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">{giveaway.description}</p>
    {/if}

    {#if form && 'success' in form && form.success}
      <div class="py-4">
        <p class="font-display text-3xl font-bold mb-2">You’re in.</p>
        <p class="font-mono text-sm text-gray-500">We’ll reach out if you win.</p>
      </div>
    {:else}
      <form
        method="POST"
        action="?/enter"
        class="space-y-5"
        use:enhance={() => {
          submitting = true;
          return async ({ update }) => {
            await update({ reset: false });
            submitting = false;
          };
        }}
      >
        <div>
          <label for="ge-name" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Name</label>
          <input id="ge-name" type="text" name="name" required autocomplete="name" class="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-brand-black text-brand-black" />
          {#if fieldErrors.name}<p class="mt-1 font-mono text-[11px] text-red-500">{fieldErrors.name}</p>{/if}
        </div>

        <div>
          <label for="ge-email" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Email</label>
          <input id="ge-email" type="email" name="email" required autocomplete="email" class="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-brand-black text-brand-black" />
          {#if fieldErrors.email}<p class="mt-1 font-mono text-[11px] text-red-500">{fieldErrors.email}</p>{/if}
        </div>

        <div>
          <label for="ge-phone" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Phone</label>
          <input id="ge-phone" type="tel" name="phone" required autocomplete="tel" class="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:border-brand-black text-brand-black" />
          {#if fieldErrors.phone}<p class="mt-1 font-mono text-[11px] text-red-500">{fieldErrors.phone}</p>{/if}
        </div>

        <div>
          <label for="ge-ig" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Instagram (optional)</label>
          <div class="flex items-baseline border-b border-gray-300 focus-within:border-brand-black">
            <span class="font-mono text-sm text-gray-400 pb-2">@</span>
            <input id="ge-ig" type="text" name="instagram_handle" autocomplete="off" class="flex-1 pl-1 pr-0 py-2 bg-transparent border-0 focus:outline-none text-brand-black" />
          </div>
          {#if fieldErrors.instagram_handle}<p class="mt-1 font-mono text-[11px] text-red-500">{fieldErrors.instagram_handle}</p>{/if}
        </div>

        {#if generalError}<p class="font-mono text-xs text-red-500">{generalError}</p>{/if}

        <button
          type="submit"
          disabled={submitting}
          class="w-full py-4 bg-brand-yellow text-brand-black font-mono text-sm font-bold uppercase tracking-widest rounded hover:opacity-90 transition-opacity disabled:opacity-50"
        >{submitting ? 'Entering…' : 'Enter'}</button>

        <p class="font-mono text-[11px] text-gray-400 text-center pt-2">
          We’ll only contact you about this giveaway. No list-sharing.
        </p>
      </form>
    {/if}
  </div>
</div>
