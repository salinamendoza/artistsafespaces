<script lang="ts">
  import type { Event, Zone, Activity, Task, HubActor } from '$lib/types/db-types';
  import { buildZoneColorMap } from './zoneColors';
  import HubHeader from './HubHeader.svelte';
  import RunOfShow from './RunOfShow.svelte';
  import ZonesSection from './ZonesSection.svelte';
  import OpenItems from './OpenItems.svelte';

  export let event: Event;
  export let zones: Zone[];
  export let activities: Activity[];
  export let tasks: Task[];
  export let mode: HubActor;
  export let navUrl: (suffix: string) => string;
  export let actionUrl: (name: string) => string;
  export let stats: {
    artistCount: number;
    totalCost: number;
    partnerSpend: number;
  };

  $: zoneColorMap = buildZoneColorMap(zones);
  $: zoneNameById = new Map<number, string>(zones.map((z) => [z.id, z.name]));
  $: openTaskCount = tasks.filter((t) => t.status !== 'done').length;

  let activeZoneId: number | null = null;
  // Drop stale selection if the active zone is removed/edited away.
  $: if (activeZoneId !== null && !zones.some((z) => z.id === activeZoneId)) activeZoneId = null;
  const setActiveZone = (id: number | null) => { activeZoneId = id; };
</script>

<div class="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-8">
  <HubHeader
    {event}
    {mode}
    stats={{ ...stats, openTaskCount }}
    shareExpiresAt={event.share_expires_at}
    {zones}
    {tasks}
    {zoneColorMap}
    {activeZoneId}
    onSetActiveZone={setActiveZone}
  />

  <RunOfShow {activities} {zoneNameById} {zoneColorMap} {mode} {navUrl} />

  <ZonesSection {zones} {tasks} {zoneColorMap} {mode} {navUrl} {actionUrl} {activeZoneId} />

  <OpenItems {tasks} {zoneNameById} {zoneColorMap} {mode} {navUrl} {actionUrl} />
</div>
