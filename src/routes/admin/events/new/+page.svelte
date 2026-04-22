<script lang="ts">
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import EventForm from '$lib/components/EventForm.svelte';
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<svelte:head><title>New Event | Admin</title></svelte:head>

<div class="min-h-screen bg-brand-black text-white">
  <AdminHeader section="events" crumbs={[{ label: 'new' }]} />

  <div class="max-w-3xl mx-auto px-6 py-8">
    <h1 class="font-display text-2xl font-bold text-white mb-6">New Event</h1>
    <EventForm submitLabel="Create Event" error={form?.error ?? null} />
  </div>
</div>
