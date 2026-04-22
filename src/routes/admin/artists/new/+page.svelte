<script lang="ts">
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import ArtistForm from '$lib/components/ArtistForm.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;
</script>

<svelte:head><title>New Artist | Admin</title></svelte:head>

<div class="min-h-screen bg-brand-black text-white">
  <AdminHeader section="artists" crumbs={[{ label: 'new' }]} />

  <div class="max-w-3xl mx-auto px-6 py-8">
    <h1 class="font-display text-2xl font-bold text-white mb-6">New Artist</h1>
    <ArtistForm activationTypes={data.activationTypes} submitLabel="Create Artist" error={form?.error ?? null} />
  </div>
</div>
