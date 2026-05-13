<script lang="ts">
  import EventHub from '$lib/components/eventHub/EventHub.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: pageTitle = data.expired ? 'Link expired' : `${data.event.name} · partner view`;
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if data.expired}
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-6">
    <div class="max-w-md text-center space-y-4">
      <h1 class="font-display text-3xl font-bold">This event link has expired.</h1>
      <p class="text-gray-600">
        Contact Sam at
        <a href="mailto:sam@artistsafespaces.org" class="underline hover:text-brand-black">sam@artistsafespaces.org</a>
        for access.
      </p>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-gray-50 text-brand-black">
    <EventHub
      event={data.event}
      zones={data.zones}
      activities={data.activities}
      tasks={data.tasks}
      stats={data.stats}
      canEdit={false}
    />
  </div>
{/if}
