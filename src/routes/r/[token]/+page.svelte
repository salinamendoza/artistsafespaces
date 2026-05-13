<script lang="ts">
  import { enhance } from '$app/forms';
  import { enhanceNoReset } from '$lib/utils/enhance';
  import { formatDate as fmtDate } from '$lib/utils/date';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: event = data.event;
  $: activities = data.activities;

  function fmt(iso: string | null): string {
    return fmtDate(iso, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) || '';
  }

  function fmtTime(iso: string | null): string {
    if (!iso) return '';
    const m = iso.match(/T(\d{2}):(\d{2})/);
    if (!m) return iso;
    let h = parseInt(m[1]);
    const min = m[2];
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${min} ${suffix}`;
  }
</script>

<svelte:head>
  <title>RSVP · {event.name}</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-white text-brand-black flex items-center justify-center px-6 py-12">
  <div class="max-w-md w-full space-y-6">
    <div class="space-y-1">
      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-400">RSVP</p>
      <h1 class="font-display text-3xl font-bold leading-tight">{event.name}</h1>
      <div class="font-mono text-xs text-gray-600 space-y-0.5 pt-1">
        {#if event.event_date}<p>{fmt(event.event_date)}</p>{/if}
        {#if event.location}<p>{event.location}</p>{/if}
      </div>
    </div>

    {#if form?.success}
      <div class="border border-gray-200 rounded-2xl p-6 space-y-3">
        <p class="font-display text-xl">You're on the list.</p>
        <p class="text-sm text-gray-600">
          {#if form.already}We already had {form.name} ({form.email}) down. Your interests are updated.{:else}Thanks, {form.name}. We'll see you there.{/if}
        </p>
        <p class="text-xs text-gray-500 leading-relaxed">
          Heads up: this RSVP lets us know you're coming. It doesn't reserve a headshot slot or guarantee one of the 100 limited-edition prints. Those are first-come, first-served at the event.
        </p>
      </div>
    {:else}
      <p class="text-xs text-gray-500 leading-relaxed border-l-0 pl-0">
        This RSVP lets us know you're coming. It doesn't reserve a headshot slot or guarantee one of the 100 limited-edition prints. Those are first-come, first-served at the event.
      </p>
      <form method="POST" use:enhance={enhanceNoReset} class="space-y-5">
        {#if form?.error}
          <p class="px-3 py-2 bg-red-50 border border-red-200 rounded text-red-700 font-mono text-xs">{form.error}</p>
        {/if}
        <div>
          <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="name">Name</label>
          <input id="name" name="name" type="text" required value={form?.values?.name ?? ''} class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
        </div>
        <div>
          <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1" for="email">Email</label>
          <input id="email" name="email" type="email" required value={form?.values?.email ?? ''} class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-black" />
        </div>

        {#if activities.length > 0}
          <fieldset class="space-y-2">
            <legend class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">What are you excited about? (optional)</legend>
            <div class="space-y-1.5">
              {#each activities as a}
                <label class="flex items-start gap-2.5 py-1 cursor-pointer">
                  <input type="checkbox" name="interest" value={a.id} class="mt-1 rounded border-gray-300 text-brand-black focus:ring-0 focus:ring-offset-0" />
                  <span class="flex-1 min-w-0">
                    <span class="text-sm font-medium">{a.title}</span>
                    {#if a.start_time}<span class="font-mono text-[10px] text-gray-500 ml-1">{fmtTime(a.start_time)}{a.end_time ? `–${fmtTime(a.end_time)}` : ''}</span>{/if}
                    {#if a.notes}<span class="block text-xs text-gray-500">{a.notes}</span>{/if}
                  </span>
                </label>
              {/each}
            </div>
          </fieldset>
        {/if}

        <!-- Honeypot: hidden from real users, bots fill it. Submissions with a value are silently dropped. -->
        <div class="absolute -left-[9999px]" aria-hidden="true">
          <label for="website">Website (leave blank)</label>
          <input id="website" name="website" type="text" tabindex="-1" autocomplete="off" />
        </div>

        <button type="submit" class="w-full px-4 py-2.5 bg-brand-black text-white font-mono text-sm rounded hover:opacity-90 transition-opacity">RSVP</button>
        <p class="font-mono text-[10px] text-gray-400 leading-relaxed">
          Your name and email are used only to track who's coming. Deleted after the event. We don't share with anyone.
        </p>
      </form>
    {/if}
  </div>
</div>
