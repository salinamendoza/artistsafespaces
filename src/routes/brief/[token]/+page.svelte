<script lang="ts">
  import { enhance } from '$app/forms';
  import BriefFieldsView from '$lib/components/BriefFieldsView.svelte';
  import MarkdownView from '$lib/components/MarkdownView.svelte';
  import { visualSheetRegistry, hasVisualSheet } from '$lib/briefs/visualSheets';
  import { formatDate } from '$lib/utils/date';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: booking = data.booking;
  $: brief = data.brief;

  let termsAccepted = false;
  let showDecline = false;

  function formatEventDate(iso: string | null): string {
    return formatDate(iso, { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function formatAcceptedDate(iso: string | null): string {
    return formatDate(iso, { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  }

  function money(n: number | null | undefined): string {
    if (n == null) return '—';
    return '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  $: totalDue = (booking.rate ?? 0) + (booking.materials_allowance ?? 0);
  $: billTo = data.event.billing_to ?? data.event.client_name ?? 'Artist Safespaces';
  $: projectLine = `${brief.title} — ${data.event.name}`;
  $: invoiceReference = `AS-${booking.id}`;
  $: sendTo = data.event.invoice_email ?? 'salina@artistsafespaces.org';

  $: invoiceRows = [
    { key: 'billTo', label: 'Bill to', value: billTo },
    { key: 'project', label: 'Project', value: projectLine },
    { key: 'amount', label: 'Amount due', value: money(totalDue) },
    ...(data.event.event_date ? [{ key: 'eventDate', label: 'Event date', value: formatEventDate(data.event.event_date) }] : []),
    { key: 'reference', label: 'Reference', value: invoiceReference },
    { key: 'sendTo', label: 'Send invoice to', value: sendTo }
  ];

  let copiedKey: string | null = null;
  function copyValue(key: string, value: string) {
    navigator.clipboard.writeText(value);
    copiedKey = key;
    setTimeout(() => (copiedKey = null), 1500);
  }
</script>

<svelte:head>
  <title>{brief.title} | Artist Safespaces</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <header class="border-b border-gray-200 px-6 py-5">
    <div class="max-w-3xl mx-auto flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <img src="/logo-icon.png" alt="Artist Safespaces" class="h-5 w-auto" />
      </a>
      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500">Artist Brief</p>
    </div>
  </header>

  <article class="max-w-3xl mx-auto px-6 py-12 space-y-10">
    <!-- Title block -->
    <div>
      <p class="font-mono text-xs text-gray-500 mb-2">For {data.artistName}</p>
      <h1 class="font-display text-4xl md:text-5xl font-bold text-brand-black leading-tight">{brief.title}</h1>
      <p class="font-mono text-sm text-gray-600 mt-3">{data.activationTypeName}</p>
    </div>

    <!-- Accepted: status + point of contact + invoice info + submit. Shown first so returning artists see current state and next step at the top. -->
    {#if booking.status === 'accepted'}
      <div class="space-y-6">
        <p class="flex items-center gap-2 font-mono text-xs">
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-green-600"></span>
          <span class="uppercase tracking-widest text-green-700 font-medium">Accepted</span>
          <span class="text-gray-400">·</span>
          <span class="text-gray-600">{formatAcceptedDate(booking.accepted_at)}</span>
        </p>

        <div>
          <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-2">Important — point of contact</p>
          <p class="text-sm text-gray-800 leading-relaxed">
            <strong class="text-brand-black">Artist Safespaces is your point of contact for this engagement.</strong>
            We built the relationship with {data.event.client_name ?? 'the client'} and coordinate all communication on our side.
            The client may pay you directly via the link you provide below, but please route all questions, scheduling, follow-ups, and future opportunities through us — never the client directly.
            Reach out any time at <a href="mailto:salina@artistsafespaces.org" class="text-brand-black underline hover:no-underline">salina@artistsafespaces.org</a>.
          </p>
        </div>
      </div>

      <section>
        <div class="border-t border-gray-200 pt-6 mb-2">
          <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500">Put this on your invoice</p>
          <p class="font-mono text-xs text-gray-500 mt-1">Copy any row and paste it into your invoice tool.</p>
        </div>
        <dl class="divide-y divide-gray-200">
          {#each invoiceRows as row (row.key)}
            <div class="flex items-start justify-between gap-4 py-3">
              <div class="min-w-0 flex-1">
                <dt class="font-mono text-[10px] uppercase tracking-widest text-gray-500">{row.label}</dt>
                <dd class="font-mono text-sm text-brand-black whitespace-pre-wrap break-words mt-0.5">{row.value}</dd>
              </div>
              <button type="button" on:click={() => copyValue(row.key, row.value)} class="px-2 py-1 bg-brand-yellow text-brand-black font-mono text-[10px] font-bold rounded hover:bg-yellow-300 flex-shrink-0">{copiedKey === row.key ? 'Copied' : 'Copy'}</button>
            </div>
          {/each}
        </dl>
      </section>

      <div class="rounded-lg border border-gray-200 p-6">
        <div class="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
          <p class="font-display text-xl font-bold text-brand-black">Send your invoice + payment link</p>
          {#if booking.invoice_status === 'paid'}
            <span class="px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-green-700 font-mono text-[10px] uppercase tracking-widest">Paid {booking.invoice_paid_at ? `· ${formatAcceptedDate(booking.invoice_paid_at)}` : ''}</span>
          {:else if booking.invoice_status === 'submitted'}
            <span class="px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-green-700 font-mono text-[10px] uppercase tracking-widest">Submitted {booking.invoice_submitted_at ? `· ${formatAcceptedDate(booking.invoice_submitted_at)}` : ''}</span>
          {/if}
        </div>
        <p class="font-mono text-xs text-gray-500 mb-5">
          Paste your invoice link and a credit-card payment link below. We'll forward both to the client.
        </p>

        {#if form?.error}
          <p class="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-700 font-mono text-xs">{form.error}</p>
        {/if}
        {#if form?.invoiceSubmitted}
          <p class="mb-4 px-3 py-2 bg-green-50 border border-green-200 rounded text-green-700 font-mono text-xs">Got it — we'll pass this along to the client.</p>
        {/if}

        <form method="POST" action="?/submitInvoice" use:enhance class="space-y-5">
          <div>
            <label for="invoice_url" class="block font-mono text-xs text-gray-700 mb-1.5">Invoice PDF link</label>
            <input id="invoice_url" name="invoice_url" type="url" value={booking.invoice_url ?? ''} placeholder="https://drive.google.com/…" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
            <p class="font-mono text-[11px] text-gray-500 mt-1.5">
              No hosting link? Upload the PDF to Google Drive and paste its share link, or email the PDF to <a href="mailto:salina@artistsafespaces.org" class="underline hover:no-underline">salina@artistsafespaces.org</a> and we'll handle the rest.
            </p>
          </div>

          <div>
            <label for="payment_link_url" class="block font-mono text-xs text-gray-700 mb-1.5">Credit-card payment link</label>
            <input id="payment_link_url" name="payment_link_url" type="url" value={booking.payment_link_url ?? ''} placeholder="https://buy.stripe.com/… or square.link/… or paypal.me/…" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
            <p class="font-mono text-[11px] text-gray-500 mt-1.5">
              Our clients prefer paying by credit card. A Stripe payment link, Square checkout, PayPal.me, or invoice-with-pay-button all work.
            </p>
          </div>

          <div>
            <label for="invoice_notes" class="block font-mono text-xs text-gray-700 mb-1.5">Notes <span class="text-gray-400">(optional)</span></label>
            <textarea id="invoice_notes" name="invoice_notes" rows="2" placeholder="Net terms, tax info, anything the client should know…" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black">{booking.invoice_notes ?? ''}</textarea>
          </div>

          <div class="flex items-center gap-3">
            <button type="submit" class="px-6 py-3 bg-brand-yellow text-brand-black font-mono text-sm font-bold rounded hover:bg-yellow-300 transition-colors">
              {booking.invoice_status === 'not_submitted' ? 'Submit invoice details' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    {/if}

    <!-- Event + Compensation at-a-glance -->
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <div class="p-6">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-3">Event</p>
        <p class="font-display text-xl font-bold text-brand-black">{data.event.name}</p>
        <div class="mt-3 grid sm:grid-cols-3 gap-4 font-mono text-sm">
          {#if data.event.client_name}
            <div><p class="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Client</p><p class="text-gray-900">{data.event.client_name}</p></div>
          {/if}
          {#if data.event.event_date}
            <div><p class="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Date</p><p class="text-gray-900">{formatEventDate(data.event.event_date)}</p></div>
          {/if}
          {#if data.event.location}
            <div><p class="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Location</p><p class="text-gray-900">{data.event.location}</p></div>
          {/if}
        </div>
      </div>
      <div class="border-t border-brand-yellow/30 bg-brand-yellow/[0.08] px-6 py-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <p class="font-mono text-[10px] uppercase tracking-widest text-brand-black">Your Rate</p>
        <p class="font-display text-3xl font-bold text-brand-black leading-none">{money(booking.rate)}</p>
        {#if booking.materials_allowance}
          <p class="font-mono text-sm text-gray-700">+ {money(booking.materials_allowance)} materials</p>
        {/if}
        {#if totalDue > (booking.rate ?? 0)}
          <p class="ml-auto font-mono text-xs text-gray-700">Total: <span class="font-bold text-brand-black">{money(totalDue)}</span></p>
        {/if}
      </div>
    </div>

    <!-- Structured details -->
    {#if data.schema.length}
      <div class="border border-gray-200 rounded-lg p-6">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-4">Details</p>
        <BriefFieldsView schema={data.schema} data={data.briefData} dark={false} />
      </div>
    {/if}

    <!-- Body -->
    {#if brief.body}
      <div class="border border-gray-200 rounded-lg p-6">
        <MarkdownView source={brief.body} dark={false} />
      </div>
    {/if}

    <!-- Visual Sheet -->
    {#if brief.visualSheetSlug && hasVisualSheet(brief.visualSheetSlug)}
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        {#await visualSheetRegistry[brief.visualSheetSlug]() then mod}
          <svelte:component this={mod.default} />
        {/await}
      </div>
    {/if}

    <!-- Terms -->
    {#if brief.terms}
      <div class="border border-gray-200 rounded-lg p-6">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-3">Terms of Engagement</p>
        <MarkdownView source={brief.terms} dark={false} />
      </div>
    {/if}

    <!-- Response state for non-accepted bookings (accepted state is rendered at the top) -->
    {#if booking.status === 'declined'}
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
        <p class="font-display text-2xl font-bold text-gray-700 mb-1">Declined</p>
        <p class="font-mono text-xs text-gray-500">on {formatAcceptedDate(booking.declined_at)}</p>
        {#if booking.declined_reason}
          <p class="font-mono text-xs text-gray-500 mt-3 italic">"{booking.declined_reason}"</p>
        {/if}
      </div>
    {:else if booking.status === 'cancelled'}
      <div class="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
        <p class="font-display text-2xl font-bold text-gray-700">Cancelled</p>
        <p class="font-mono text-xs text-gray-500 mt-2">This booking has been cancelled.</p>
      </div>
    {:else if booking.status === 'invited'}
      <!-- Response form -->
      <div class="rounded-lg border border-brand-yellow/30 bg-brand-yellow/[0.03] p-6">
        <p class="font-display text-xl font-bold text-brand-black mb-4">Your Response</p>

        {#if form?.error}
          <p class="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
        {/if}

        {#if !showDecline}
          <form method="POST" action="?/accept" use:enhance>
            <label class="flex items-start gap-3 mb-5 cursor-pointer">
              <input type="checkbox" name="terms_accepted" bind:checked={termsAccepted} class="mt-1 accent-brand-yellow w-4 h-4" />
              <span class="text-sm text-gray-800 leading-relaxed">
                I have read and accept the terms of engagement above. I understand the compensation, scope, and cancellation terms.
              </span>
            </label>
            <div class="flex flex-wrap gap-3">
              <button type="submit" disabled={!termsAccepted} class="px-6 py-3 font-mono text-sm font-bold rounded transition-colors
                {termsAccepted ? 'bg-brand-yellow text-brand-black hover:bg-yellow-300' : 'bg-gray-50 text-gray-400 cursor-not-allowed'}">
                Accept Brief
              </button>
              <button type="button" on:click={() => (showDecline = true)} class="px-6 py-3 bg-transparent border border-gray-300 text-gray-700 font-mono text-sm rounded hover:border-white/40 hover:text-brand-black transition-colors">
                Decline
              </button>
            </div>
          </form>
        {:else}
          <form method="POST" action="?/decline" use:enhance>
            <label for="declined_reason" class="block font-mono text-xs text-gray-600 mb-2">Let us know why (optional)</label>
            <textarea id="declined_reason" name="declined_reason" rows="3" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black mb-4" placeholder="Schedule conflict, scope, anything..."></textarea>
            <div class="flex gap-3">
              <button type="submit" class="px-6 py-3 bg-white/10 border border-gray-300 text-brand-black font-mono text-sm rounded hover:bg-white/15 transition-colors">Confirm Decline</button>
              <button type="button" on:click={() => (showDecline = false)} class="px-6 py-3 bg-transparent text-gray-600 font-mono text-sm rounded hover:text-brand-black transition-colors">Cancel</button>
            </div>
          </form>
        {/if}
      </div>
    {/if}

    <!-- Contact -->
    <div class="pt-6 border-t border-gray-200 text-center">
      <p class="font-mono text-xs text-gray-500">Questions? Reach out to Salina — <a href="mailto:salina@artistsafespaces.org" class="text-brand-black underline hover:no-underline">salina@artistsafespaces.org</a></p>
    </div>
  </article>
</div>
