<script lang="ts">
  import type { Event, Zone, Activity, Task } from '$lib/types/db-types';
  import { buildZoneColorMap } from './zoneColors';
  import HubHeader from './HubHeader.svelte';
  import RunOfShow from './RunOfShow.svelte';
  import ZonesSection from './ZonesSection.svelte';
  import OpenItems from './OpenItems.svelte';

  export let event: Event;
  export let zones: Zone[];
  export let activities: Activity[];
  export let tasks: Task[];
  export let canEdit: boolean;
  export let stats: {
    artistCount: number;
    totalCost: number;
    partnerSpend: number;
  };

  $: zoneColorMap = buildZoneColorMap(zones);
  $: zoneNameById = new Map<number, string>(zones.map((z) => [z.id, z.name]));
  $: openTaskCount = tasks.filter((t) => t.status !== 'done').length;
</script>

<div class="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
  <HubHeader
    {event}
    {canEdit}
    stats={{ ...stats, openTaskCount }}
    shareExpiresAt={event.share_expires_at}
  />

  <RunOfShow {activities} {zoneNameById} {zoneColorMap} />

  <ZonesSection {zones} {tasks} {zoneColorMap} {canEdit} eventId={event.id} />

  <OpenItems {tasks} {zoneNameById} {zoneColorMap} {canEdit} eventId={event.id} />
</div>
