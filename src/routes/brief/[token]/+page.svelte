<script lang="ts">
  import { enhance } from '$app/forms';
  import BriefFieldsView from '$lib/components/BriefFieldsView.svelte';
  import MarkdownView from '$lib/components/MarkdownView.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: booking = data.booking;
  $: brief = data.brief;

  let termsAccepted = false;
  let showDecline = false;

  function formatEventDate(iso: string | null): string {
    if (!iso) return '';
    return new Date(iso.length <= 10 ? iso : iso + 'Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function formatAcceptedDate(iso: string | null): string {
    if (!iso) return '';
    return new Date(iso + 'Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function money(n: number | null | undefined): string {
    if (n == null) return '—';
    return '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
</script>

<svelte:head>
  <title>{brief.title} | Artist Safespaces</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-brand-black text-white">
  <header class="border-b border-white/10 px-6 py-5">
    <div class="max-w-3xl mx-auto flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <img src="/logo-icon.png" alt="Artist Safespaces" class="h-5 w-auto brightness-0 invert" />
      </a>
      <p class="font-mono text-[10px] uppercase tracking-widest text-white/40">Artist Brief</p>
    </div>
  </header>

  <article class="max-w-3xl mx-auto px-6 py-12 space-y-10">
    <!-- Title block -->
    <div>
      <p class="font-mono text-xs text-brand-yellow mb-2">For {data.artistName}</p>
      <h1 class="font-display text-4xl md:text-5xl font-bold text-white leading-tight">{brief.title}</h1>
      <p class="font-mono text-sm text-white/60 mt-3">{data.activationTypeName}</p>
    </div>

    <!-- Event -->
    <div class="border border-white/10 rounded-lg p-6">
      <p class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">Event</p>
      <p class="font-display text-xl font-bold text-white">{data.event.name}</p>
      <div class="mt-3 grid sm:grid-cols-3 gap-4 font-mono text-sm">
        {#if data.event.client_name}
          <div><p class="text-[10px] uppercase tracking-widest text-white/40 mb-1">Client</p><p class="text-white/90">{data.event.client_name}</p></div>
        {/if}
        {#if data.event.event_date}
          <div><p class="text-[10px] uppercase tracking-widest text-white/40 mb-1">Date</p><p class="text-white/90">{formatEventDate(data.event.event_date)}</p></div>
        {/if}
        {#if data.event.location}
          <div><p class="text-[10px] uppercase tracking-widest text-white/40 mb-1">Location</p><p class="text-white/90">{data.event.location}</p></div>
        {/if}
      </div>
    </div>

    <!-- Compensation -->
    <div class="border border-brand-yellow/30 bg-brand-yellow/[0.04] rounded-lg p-6">
      <p class="font-mono text-[10px] uppercase tracking-widest text-brand-yellow/80 mb-3">Compensation</p>
      <div class="grid sm:grid-cols-2 gap-6 font-display">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Rate</p>
          <p class="text-3xl font-bold text-white">{money(booking.rate)}</p>
        </div>
        {#if booking.materials_allowance}
          <div>
            <p class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-1">Materials Allowance</p>
            <p class="text-3xl font-bold text-white">{money(booking.materials_allowance)}</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Structured details -->
    {#if data.schema.length}
      <div class="border border-white/10 rounded-lg p-6">
        <p class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-4">Details</p>
        <BriefFieldsView schema={data.schema} data={data.briefData} dark={true} />
      </div>
    {/if}

    <!-- Body -->
    {#if brief.body}
      <div class="border border-white/10 rounded-lg p-6">
        <MarkdownView source={brief.body} dark={true} />
      </div>
    {/if}

    <!-- Terms -->
    {#if brief.terms}
      <div class="border border-white/10 rounded-lg p-6">
        <p class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">Terms of Engagement</p>
        <MarkdownView source={brief.terms} dark={true} />
      </div>
    {/if}

    <!-- Response state -->
    {#if booking.status === 'accepted'}
      <div class="rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center">
        <p class="font-display text-2xl font-bold text-green-400 mb-1">Accepted</p>
        <p class="font-mono text-xs text-green-400/70">on {formatAcceptedDate(booking.accepted_at)}</p>
        <p class="font-mono text-xs text-white/60 mt-4">Thanks — we'll be in touch with next steps.</p>
      </div>
    {:else if booking.status === 'declined'}
      <div class="rounded-lg border border-white/10 bg-white/[0.02] p-6 text-center">
        <p class="font-display text-2xl font-bold text-white/70 mb-1">Declined</p>
        <p class="font-mono text-xs text-white/40">on {formatAcceptedDate(booking.declined_at)}</p>
        {#if booking.declined_reason}
          <p class="font-mono text-xs text-white/50 mt-3 italic">"{booking.declined_reason}"</p>
        {/if}
      </div>
    {:else if booking.status === 'cancelled'}
      <div class="rounded-lg border border-white/10 bg-white/[0.02] p-6 text-center">
        <p class="font-display text-2xl font-bold text-white/70">Cancelled</p>
        <p class="font-mono text-xs text-white/50 mt-2">This booking has been cancelled.</p>
      </div>
    {:else if booking.status === 'invited'}
      <!-- Response form -->
      <div class="rounded-lg border border-brand-yellow/30 bg-brand-yellow/[0.03] p-6">
        <p class="font-display text-xl font-bold text-white mb-4">Your Response</p>

        {#if form?.error}
          <p class="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
        {/if}

        {#if !showDecline}
          <form method="POST" action="?/accept" use:enhance>
            <label class="flex items-start gap-3 mb-5 cursor-pointer">
              <input type="checkbox" name="terms_accepted" bind:checked={termsAccepted} class="mt-1 accent-brand-yellow w-4 h-4" />
              <span class="text-sm text-white/80 leading-relaxed">
                I have read and accept the terms of engagement above. I understand the compensation, scope, and cancellation terms.
              </span>
            </label>
            <div class="flex flex-wrap gap-3">
              <button type="submit" disabled={!termsAccepted} class="px-6 py-3 font-mono text-sm font-bold rounded transition-colors
                {termsAccepted ? 'bg-brand-yellow text-brand-black hover:bg-yellow-300' : 'bg-white/5 text-white/30 cursor-not-allowed'}">
                Accept Brief
              </button>
              <button type="button" on:click={() => (showDecline = true)} class="px-6 py-3 bg-transparent border border-white/20 text-white/70 font-mono text-sm rounded hover:border-white/40 hover:text-white transition-colors">
                Decline
              </button>
            </div>
          </form>
        {:else}
          <form method="POST" action="?/decline" use:enhance>
            <label for="declined_reason" class="block font-mono text-xs text-white/60 mb-2">Let us know why (optional)</label>
            <textarea id="declined_reason" name="declined_reason" rows="3" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-yellow/40 mb-4" placeholder="Schedule conflict, scope, anything..."></textarea>
            <div class="flex gap-3">
              <button type="submit" class="px-6 py-3 bg-white/10 border border-white/20 text-white font-mono text-sm rounded hover:bg-white/15 transition-colors">Confirm Decline</button>
              <button type="button" on:click={() => (showDecline = false)} class="px-6 py-3 bg-transparent text-white/60 font-mono text-sm rounded hover:text-white transition-colors">Cancel</button>
            </div>
          </form>
        {/if}
      </div>
    {/if}

    <!-- Contact -->
    <div class="pt-6 border-t border-white/10 text-center">
      <p class="font-mono text-xs text-white/40">Questions? Reach out to Sam — <a href="mailto:hello@artistsafespaces.org" class="text-brand-yellow hover:underline">hello@artistsafespaces.org</a></p>
    </div>
  </article>
</div>
