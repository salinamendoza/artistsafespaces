<script lang="ts">
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import ActivityList from '$lib/components/ActivityList.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  $: ({ activity } = data);
</script>

<svelte:head><title>Activity | Admin</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="contacts" />

  <div class="max-w-6xl mx-auto px-6 py-8">
    <div class="flex items-baseline justify-between mb-6">
      <h1 class="font-display text-2xl font-bold text-brand-black">Activity</h1>
      <a href="/admin" class="font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-brand-black transition-colors">← Back to dashboard</a>
    </div>
    <ActivityList {activity} />
  </div>
</div>
