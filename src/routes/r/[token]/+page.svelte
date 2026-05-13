<script lang="ts">
  import { enhance } from '$app/forms';
  import { enhanceNoReset } from '$lib/utils/enhance';
  import { formatDate as fmtDate } from '$lib/utils/date';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: event = data.event;

  function fmt(iso: string | null): string {
    return fmtDate(iso, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) || '';
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
      <div class="border border-gray-200 rounded-2xl p-6 space-y-2">
        <p class="font-display text-xl">You're on the list.</p>
        <p class="text-sm text-gray-600">
          {#if form.already}We already had {form.name} ({form.email}) down. You're good.{:else}Thanks, {form.name}. We'll see you there.{/if}
        </p>
      </div>
    {:else}
      <form method="POST" use:enhance={enhanceNoReset} class="space-y-4">
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
        <button type="submit" class="w-full px-4 py-2.5 bg-brand-black text-white font-mono text-sm rounded hover:opacity-90 transition-opacity">RSVP</button>
        <p class="font-mono text-[10px] text-gray-400 leading-relaxed pt-2">
          Your name and email are used only to track who's coming. Deleted after the event. We don't share with anyone.
        </p>
      </form>
    {/if}
  </div>
</div>
