<script lang="ts">
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import ArtistForm from '$lib/components/ArtistForm.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;
</script>

<svelte:head><title>Edit {data.artist.name} | Admin</title></svelte:head>

<div class="min-h-screen bg-brand-black text-white">
  <AdminHeader section="artists" crumbs={[{ label: data.artist.name, href: `/admin/artists/${data.artist.id}` }, { label: 'edit' }]} />

  <div class="max-w-3xl mx-auto px-6 py-8">
    <h1 class="font-display text-2xl font-bold text-white mb-6">Edit Artist</h1>
    <ArtistForm artist={data.artist} activationTypes={data.activationTypes} submitLabel="Save Changes" error={form?.error ?? null} />
  </div>
</div>
