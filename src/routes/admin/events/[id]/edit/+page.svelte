<script lang="ts">
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import EventForm from '$lib/components/EventForm.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;
</script>

<svelte:head><title>Edit {data.event.name} | Admin</title></svelte:head>

<div class="min-h-screen bg-brand-black text-white">
  <AdminHeader section="events" crumbs={[{ label: data.event.name, href: `/admin/events/${data.event.id}` }, { label: 'edit' }]} />

  <div class="max-w-3xl mx-auto px-6 py-8">
    <h1 class="font-display text-2xl font-bold text-white mb-6">Edit Event</h1>
    <EventForm event={data.event} submitLabel="Save Changes" error={form?.error ?? null} />
  </div>
</div>
