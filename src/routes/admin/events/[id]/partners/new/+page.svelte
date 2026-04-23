<script lang="ts">
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import PartnerForm from '$lib/components/PartnerForm.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;
</script>

<svelte:head><title>Add Partner | {data.event.name}</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="events" crumbs={[{ label: data.event.name, href: `/admin/events/${data.event.id}` }, { label: 'Add Partner' }]} />

  <div class="max-w-3xl mx-auto px-6 py-8">
    <h1 class="font-display text-3xl font-bold text-brand-black mb-6">Add Partner or Vendor</h1>
    <PartnerForm submitLabel="Add Partner" error={form?.error ?? null} />
  </div>
</div>
