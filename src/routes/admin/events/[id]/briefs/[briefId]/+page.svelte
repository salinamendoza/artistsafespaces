<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import BriefFieldsView from '$lib/components/BriefFieldsView.svelte';
  import MarkdownView from '$lib/components/MarkdownView.svelte';
  import { parseBriefSchema, parseBriefData } from '$lib/types/brief-schema';
  import { visualSheetRegistry, hasVisualSheet } from '$lib/briefs/visualSheets';
  import { AS_CORE_TERMS } from '$lib/briefs/coreTerms';
  import { formatDate as fmtDate } from '$lib/utils/date';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ event, brief, activationType, bookings, artists } = data);
  $: schema = activationType ? parseBriefSchema(activationType.brief_schema_json) : [];
  $: briefData = parseBriefData(brief.brief_data_json);

  $: unbookedArtists = artists.filter((a) => !bookings.some((b) => b.artist_id === a.id));

  let copied: number | null = null;
  function copyLink(id: number, token: string) {
    const url = `${$page.url.origin}/brief/${token}`;
    navigator.clipboard.writeText(url);
    copied = id;
    setTimeout(() => (copied = null), 1500);
  }

  let giveawayCopied: number | null = null;
  function copyGiveawayLink(id: number, link: string) {
    navigator.clipboard.writeText(link);
    giveawayCopied = id;
    setTimeout(() => (giveawayCopied = null), 1500);
  }

  function downloadQr(svg: string, filename: string) {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toDatetimeLocal(iso: string | null): string {
    if (!iso) return '';
    return iso.replace(' ', 'T').slice(0, 16);
  }

  function slugifyForFile(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'giveaway';
  }

  function formatDate(iso: string | null): string {
    return fmtDate(iso, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) || '—';
  }

  $: isLiveMuralist = data.activationType?.slug === 'live-muralist';
</script>

<svelte:head><title>{brief.title} | Admin</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader
    section="events"
    crumbs={[
      { label: event.name, href: `/admin/events/${event.id}` },
      { label: 'brief' }
    ]}
  />

  <div class="max-w-5xl mx-auto px-6 py-8 space-y-8">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="font-mono text-xs text-gray-600 mb-1">{activationType?.name ?? ''}</p>
        <h1 class="font-display text-3xl font-bold text-brand-black">{brief.title}</h1>
        <div class="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-gray-500">
          <span class="px-2 py-0.5 rounded-full border
            {brief.status === 'sent' ? 'bg-green-50 border-green-200 text-green-700' :
             brief.status === 'ready' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
             'bg-gray-50 border-gray-200 text-gray-600'}">{brief.status}</span>
          <span>updated {formatDate(brief.updated_at)}</span>
        </div>
      </div>
      <div class="flex gap-2">
        <a href={`/admin/events/${event.id}/briefs/${brief.id}/edit`} class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-700 hover:border-gray-400 hover:text-brand-black transition-colors">Edit Brief</a>
        <form method="POST" action="?/deleteBrief" use:enhance>
          <button type="submit" class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-500 hover:text-red-400 hover:border-red-400/30 transition-colors">Delete</button>
        </form>
      </div>
    </div>

    {#if form?.error}
      <p class="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    {/if}

    <!-- Brief status toggle -->
    <div class="flex items-center gap-2 font-mono text-xs">
      <span class="text-gray-500">Set status:</span>
      {#each ['draft', 'ready', 'sent'] as s}
        <form method="POST" action="?/markBriefStatus" use:enhance>
          <input type="hidden" name="status" value={s} />
          <button type="submit" class="px-3 py-1 rounded border transition-colors
            {brief.status === s ? 'bg-brand-yellow text-brand-black border-brand-yellow font-bold' : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-brand-black'}">{s}</button>
        </form>
      {/each}
    </div>

    <!-- Structured fields -->
    {#if schema.length}
      <div class="border border-gray-200 rounded-lg p-5">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-4">Brief Details</p>
        <BriefFieldsView {schema} data={briefData} dark={false} />
      </div>
    {/if}

    <!-- Body -->
    {#if brief.brief_body}
      <div class="border border-gray-200 rounded-lg p-5">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-3">Body</p>
        <MarkdownView source={brief.brief_body} dark={false} />
      </div>
    {/if}

    <!-- Visual Sheet -->
    {#if hasVisualSheet(brief.visual_sheet_slug)}
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        {#await visualSheetRegistry[brief.visual_sheet_slug]() then mod}
          <svelte:component this={mod.default} />
        {/await}
      </div>
    {/if}

    <!-- Terms (matches what the artist sees on the public brief) -->
    <details class="border border-gray-200 rounded-lg p-5">
      <summary class="font-mono text-[10px] uppercase tracking-widest text-gray-500 cursor-pointer">Terms — exactly what the artist agrees to</summary>
      <div class="mt-4 space-y-4">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-2">AS standard terms <span class="text-gray-400">(auto-included on every brief)</span></p>
          <MarkdownView source={AS_CORE_TERMS} dark={false} />
        </div>
        {#if brief.terms_markdown}
          <div class="pt-4 border-t border-gray-200">
            <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-2">Brief-specific terms</p>
            <MarkdownView source={brief.terms_markdown} dark={false} />
          </div>
        {/if}
      </div>
    </details>

    <!-- Bookings -->
    <div>
      <h2 class="font-display text-xl font-bold text-brand-black mb-4">Bookings</h2>

      {#if bookings.length === 0}
        <p class="font-mono text-xs text-gray-400 py-4">No artists booked yet.</p>
      {:else}
        <div class="space-y-4 mb-6">
          {#each bookings as b}
            <div class="border border-gray-200 rounded-lg p-5">
              <div class="flex items-start justify-between gap-4 mb-4">
                <div>
                  <a href={`/admin/artists/${b.artist_id}`} class="font-mono text-sm font-bold text-brand-black hover:text-brand-black">{b.artist_name}</a>
                  {#if b.artist_email}
                    <p class="font-mono text-[10px] text-gray-500">{b.artist_email}</p>
                  {/if}
                </div>
                <div class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
                  <span class="px-2 py-0.5 rounded-full border
                    {b.status === 'accepted' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                     b.status === 'declined' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                     b.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' :
                     b.status === 'cancelled' ? 'bg-gray-50 border-gray-200 text-gray-500' :
                     'bg-gray-50 border-gray-200 text-gray-600'}">{b.status}</span>
                </div>
              </div>

              <!-- Share link -->
              <div class="bg-brand-yellow/5 border border-brand-yellow/20 rounded p-3 mb-4">
                <p class="font-mono text-[10px] uppercase tracking-widest text-brand-black mb-1">Share Link — paste to artist</p>
                <div class="flex items-center gap-2">
                  <code class="flex-1 font-mono text-xs text-gray-900 truncate">{$page.url.origin}/brief/{b.share_token}</code>
                  <button type="button" on:click={() => copyLink(b.id, b.share_token)} class="px-2 py-1 bg-brand-yellow text-brand-black font-mono text-[10px] font-bold rounded hover:bg-yellow-300">
                    {copied === b.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <!-- Compensation + invoice form -->
              <form method="POST" action="?/updateBookingPayment" use:enhance class="grid sm:grid-cols-4 gap-3 mb-3">
                <input type="hidden" name="id" value={b.id} />
                <div>
                  <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Rate ($)</label>
                  <input name="rate" type="number" step="0.01" value={b.rate} class="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-brand-black focus:outline-none focus:border-brand-black" />
                </div>
                <div>
                  <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Materials ($)</label>
                  <input name="materials_allowance" type="number" step="0.01" value={b.materials_allowance ?? 0} class="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-brand-black focus:outline-none focus:border-brand-black" />
                </div>
                <div>
                  <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Invoice</label>
                  <select name="invoice_status" class="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-brand-black focus:outline-none focus:border-brand-black" value={b.invoice_status}>
                    <option value="not_submitted" class="bg-white">not submitted</option>
                    <option value="submitted" class="bg-white">submitted</option>
                    <option value="paid" class="bg-white">paid</option>
                  </select>
                </div>
                <div class="flex items-end">
                  <button type="submit" class="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-[10px] text-gray-700 hover:border-gray-400 hover:text-brand-black transition-colors">Save</button>
                </div>
                <div class="sm:col-span-2">
                  <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Invoice PDF link</label>
                  <div class="flex gap-2">
                    <input name="invoice_url" type="url" placeholder="https://drive.google.com/…" value={b.invoice_url ?? ''} class="flex-1 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
                    {#if b.invoice_url}
                      <a href={b.invoice_url} target="_blank" rel="noopener" class="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-[10px] text-gray-700 hover:border-gray-400 hover:text-brand-black transition-colors self-stretch flex items-center">Open</a>
                    {/if}
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Payment link</label>
                  <div class="flex gap-2">
                    <input name="payment_link_url" type="url" placeholder="https://buy.stripe.com/…" value={b.payment_link_url ?? ''} class="flex-1 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
                    {#if b.payment_link_url}
                      <a href={b.payment_link_url} target="_blank" rel="noopener" class="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-[10px] text-gray-700 hover:border-gray-400 hover:text-brand-black transition-colors self-stretch flex items-center">Open</a>
                    {/if}
                  </div>
                </div>
                <div class="sm:col-span-4">
                  <input name="invoice_notes" type="text" placeholder="Invoice notes (optional)" value={b.invoice_notes ?? ''} class="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
                </div>
              </form>

              {#if b.invoice_submitted_at || b.invoice_paid_at}
                <p class="font-mono text-[10px] text-gray-500 mb-3">
                  {#if b.invoice_submitted_at}submitted {formatDate(b.invoice_submitted_at)}{/if}
                  {#if b.invoice_paid_at} · paid {formatDate(b.invoice_paid_at)}{/if}
                </p>
              {/if}

              <!-- Status controls + delete -->
              <div class="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                <span class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mr-2">Status:</span>
                {#each ['invited', 'accepted', 'declined', 'completed', 'cancelled'] as s}
                  <form method="POST" action="?/updateBookingStatus" use:enhance>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="status" value={s} />
                    <button type="submit" class="px-2 py-1 rounded border font-mono text-[10px] transition-colors
                      {b.status === s ? 'bg-brand-yellow text-brand-black border-brand-yellow font-bold' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-brand-black'}">{s}</button>
                  </form>
                {/each}
                <form method="POST" action="?/deleteBooking" use:enhance class="ml-auto">
                  <input type="hidden" name="id" value={b.id} />
                  <button type="submit" class="px-2 py-1 font-mono text-[10px] text-gray-400 hover:text-red-400 transition-colors">Remove</button>
                </form>
              </div>

              {#if b.accepted_at}
                <p class="mt-3 pt-3 border-t border-gray-100 font-mono text-[10px] text-green-400/80">
                  Accepted {formatDate(b.accepted_at)}{b.accepted_ip ? ` from ${b.accepted_ip}` : ''}
                </p>
              {/if}
              {#if b.declined_at}
                <p class="mt-3 pt-3 border-t border-gray-100 font-mono text-[10px] text-red-400/80">
                  Declined {formatDate(b.declined_at)}{b.declined_reason ? ` — "${b.declined_reason}"` : ''}
                </p>
              {/if}

              <!-- Internal notes -->
              <form method="POST" action="?/updateBookingNotes" use:enhance class="mt-3 pt-3 border-t border-gray-100">
                <input type="hidden" name="id" value={b.id} />
                <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Internal Notes</label>
                <div class="flex gap-2">
                  <textarea name="internal_notes" rows="2" class="flex-1 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-brand-black focus:outline-none focus:border-brand-black">{b.internal_notes ?? ''}</textarea>
                  <button type="submit" class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-[10px] text-gray-700 hover:border-gray-400 hover:text-brand-black transition-colors self-start">Save</button>
                </div>
              </form>

              <!-- Giveaway (live-muralist only) -->
              {#if isLiveMuralist}
                <div class="mt-5 pt-5 border-t border-gray-100">
                  {#if b.giveaway && b.giveaway_url && b.giveaway_qr_svg}
                    {@const g = b.giveaway}
                    {@const gUrl = b.giveaway_url}
                    {@const gSvg = b.giveaway_qr_svg}
                    <div class="flex items-baseline justify-between mb-3">
                      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                        Public giveaway
                        {#if g.is_active}
                          <span class="ml-2 px-2 py-0.5 rounded-full bg-brand-yellow text-brand-black font-bold">active</span>
                        {:else}
                          <span class="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">paused</span>
                        {/if}
                      </p>
                      <a href={`/admin/giveaway-entries?giveaway=${g.id}`} class="font-mono text-[10px] text-gray-500 hover:text-brand-black">{b.giveaway_entry_count} entries →</a>
                    </div>

                    <div class="grid sm:grid-cols-[1fr_auto] gap-4 items-start">
                      <div class="space-y-3">
                        <div class="bg-brand-yellow/5 border border-brand-yellow/20 rounded p-3">
                          <p class="font-mono text-[10px] uppercase tracking-widest text-brand-black mb-1">Public URL — print this in the QR</p>
                          <div class="flex items-center gap-2">
                            <code class="flex-1 font-mono text-xs text-gray-900 truncate">{gUrl}</code>
                            <a href={gUrl} target="_blank" rel="noopener" class="px-2 py-1 bg-white border border-gray-200 font-mono text-[10px] text-gray-700 rounded hover:text-brand-black">Open</a>
                            <button type="button" on:click={() => copyGiveawayLink(g.id, gUrl)} class="px-2 py-1 bg-brand-yellow text-brand-black font-mono text-[10px] font-bold rounded hover:bg-yellow-300">
                              {giveawayCopied === g.id ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>

                        <form method="POST" action="?/updateGiveaway" use:enhance class="space-y-3">
                          <input type="hidden" name="giveaway_id" value={g.id} />
                          <div>
                            <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Giveaway title</label>
                            <input name="title" value={g.title} required class="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono focus:outline-none focus:border-brand-black" />
                          </div>
                          <div>
                            <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Description — shown to entrants</label>
                            <textarea name="description" rows="2" class="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono focus:outline-none focus:border-brand-black">{g.description ?? ''}</textarea>
                          </div>
                          <div class="grid sm:grid-cols-2 gap-3">
                            <div>
                              <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Opens (optional)</label>
                              <input type="datetime-local" name="opens_at" value={toDatetimeLocal(g.opens_at)} class="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono focus:outline-none focus:border-brand-black" />
                            </div>
                            <div>
                              <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Closes (optional)</label>
                              <input type="datetime-local" name="closes_at" value={toDatetimeLocal(g.closes_at)} class="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono focus:outline-none focus:border-brand-black" />
                            </div>
                          </div>
                          <label class="flex items-center gap-2 font-mono text-xs text-gray-600">
                            <input type="checkbox" name="is_active" checked={!!g.is_active} class="w-4 h-4" />
                            Active — form accepts entries on the public page
                          </label>
                          <div class="flex gap-2">
                            <button type="submit" class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded font-mono text-[10px] text-gray-700 hover:border-gray-400 hover:text-brand-black">Save</button>
                          </div>
                        </form>

                        <form method="POST" action="?/deleteGiveaway" use:enhance>
                          <input type="hidden" name="giveaway_id" value={g.id} />
                          <button type="submit" class="px-3 py-1.5 font-mono text-[10px] text-gray-400 hover:text-red-500 transition-colors">Delete giveaway (archives entries too)</button>
                        </form>
                      </div>

                      <div class="flex flex-col items-center gap-2">
                        <div class="w-40 h-40 bg-white border border-gray-200 rounded p-2">
                          {@html gSvg}
                        </div>
                        <button
                          type="button"
                          on:click={() => downloadQr(gSvg, `giveaway-${slugifyForFile(b.artist_name)}-qr.svg`)}
                          class="px-2 py-1 bg-gray-50 border border-gray-200 font-mono text-[10px] text-gray-700 rounded hover:border-gray-400 hover:text-brand-black"
                        >Download QR</button>
                      </div>
                    </div>
                  {:else}
                    <form method="POST" action="?/createGiveaway" use:enhance class="border border-dashed border-gray-300 rounded p-3">
                      <input type="hidden" name="booking_id" value={b.id} />
                      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-3">
                        Start a public giveaway for this artist's mural
                      </p>
                      <div class="grid sm:grid-cols-[1fr_auto] gap-2 items-end">
                        <div>
                          <label class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Giveaway title</label>
                          <input name="title" value="Win a custom mural" class="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-xs font-mono focus:outline-none focus:border-brand-black" />
                        </div>
                        <button type="submit" class="px-3 py-1.5 bg-brand-yellow text-brand-black font-mono text-[10px] font-bold rounded hover:bg-yellow-300">Start giveaway</button>
                      </div>
                      <p class="mt-2 font-mono text-[10px] text-gray-400">
                        Generates an unguessable public URL + QR code. Only people at the event who scan the sign can enter.
                      </p>
                    </form>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      <!-- Book an artist -->
      {#if unbookedArtists.length}
        <form method="POST" action="?/addBooking" use:enhance class="border border-dashed border-gray-300 rounded-lg p-5">
          <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-4">Book an artist</p>
          <div class="grid sm:grid-cols-4 gap-3">
            <div class="sm:col-span-2">
              <label class="block font-mono text-xs text-gray-600 mb-1.5">Artist</label>
              <select name="artist_id" required class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black focus:outline-none focus:border-brand-black">
                <option value="" class="bg-white">Select…</option>
                {#each unbookedArtists as a}
                  <option value={a.id} class="bg-white">{a.name}</option>
                {/each}
              </select>
            </div>
            <div>
              <label class="block font-mono text-xs text-gray-600 mb-1.5">Rate ($)</label>
              <input name="rate" type="number" step="0.01" required class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black focus:outline-none focus:border-brand-black" />
            </div>
            <div>
              <label class="block font-mono text-xs text-gray-600 mb-1.5">Materials ($)</label>
              <input name="materials_allowance" type="number" step="0.01" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black focus:outline-none focus:border-brand-black" />
            </div>
            <div class="sm:col-span-4">
              <textarea name="internal_notes" rows="2" placeholder="Internal notes (optional)" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black"></textarea>
            </div>
            <div>
              <button type="submit" class="px-3 py-1.5 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors">Book Artist</button>
            </div>
          </div>
        </form>
      {:else if bookings.length > 0}
        <p class="font-mono text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">All artists are booked to this brief. <a href="/admin/artists/new" class="underline hover:text-brand-black">Add another artist</a>.</p>
      {/if}
    </div>
  </div>
</div>
