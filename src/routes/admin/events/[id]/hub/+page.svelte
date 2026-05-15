<script lang="ts">
  import { enhance } from '$app/forms';
  import { enhanceNoReset } from '$lib/utils/enhance';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import EventHub from '$lib/components/eventHub/EventHub.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ event, zones, activities, tasks, stats } = data);

  let partnerLinkOrigin = '';
  if (typeof window !== 'undefined') partnerLinkOrigin = window.location.origin;
  $: partnerLink =
    event.share_token && partnerLinkOrigin
      ? `${partnerLinkOrigin}/events/${event.id}/hub?token=${event.share_token}`
      : '';

  let copyState: 'idle' | 'copied' = 'idle';
  async function copyPartnerLink() {
    if (!partnerLink) return;
    await navigator.clipboard.writeText(partnerLink);
    copyState = 'copied';
    setTimeout(() => (copyState = 'idle'), 1500);
  }

  function rotateConfirm(evt: SubmitEvent) {
    if (
      !confirm(
        'This will break the current partner link. Anyone using it will see the expired page until you send the new link. Continue?'
      )
    ) {
      evt.preventDefault();
    }
  }
</script>

<svelte:head><title>{event.name} hub | Admin</title></svelte:head>

<div class="min-h-screen bg-gray-50 text-brand-black">
  <AdminHeader section="events" crumbs={[{ label: event.name, href: `/admin/events/${event.id}` }, { label: 'Hub' }]} />

  {#if form?.error}
    <div class="max-w-5xl mx-auto px-4 md:px-6 pt-4">
      <p class="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    </div>
  {/if}

  <!-- Admin-only: partner link controls (compact bar) -->
  <div class="max-w-5xl mx-auto px-4 md:px-6 pt-6">
    {#if partnerLink}
      <div class="flex items-center gap-2 border border-gray-200 rounded-xl bg-white px-3 py-2">
        <span class="font-mono text-[10px] uppercase tracking-widest text-gray-500 whitespace-nowrap" title={event.share_expires_at ? `expires ${event.share_expires_at}` : ''}>partner link</span>
        <code class="flex-1 min-w-0 text-xs font-mono text-gray-700 truncate">{partnerLink}</code>
        <button
          type="button"
          on:click={copyPartnerLink}
          class="px-2.5 py-1 bg-brand-yellow text-brand-black font-mono text-xs rounded hover:opacity-90 transition-opacity whitespace-nowrap"
        >{copyState === 'copied' ? 'Copied' : 'Copy'}</button>
        <form method="POST" action="?/rotateToken" use:enhance={enhanceNoReset} on:submit={rotateConfirm}>
          <button type="submit" class="font-mono text-xs text-gray-500 hover:text-brand-black transition-colors whitespace-nowrap px-1">Rotate</button>
        </form>
      </div>
    {:else}
      <p class="font-mono text-xs text-gray-500">No share token yet. Run the 0012 backfill to generate one.</p>
    {/if}
  </div>

  <EventHub
    {event}
    {zones}
    {activities}
    {tasks}
    {stats}
    mode="admin"
    navUrl={(suffix) => `/admin/events/${event.id}/hub${suffix}`}
    actionUrl={(name) => `/admin/events/${event.id}/hub?/${name}`}
  />
</div>
