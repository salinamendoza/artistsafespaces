<script lang="ts">
  import { enhance } from '$app/forms';

  export let section: string;
  export let crumbs: { label: string; href?: string }[] = [];
</script>

<header class="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
  <div class="flex items-center gap-3 flex-wrap">
    <a href="/admin" class="font-mono text-brand-black text-sm font-bold hover:underline">admin</a>
    <span class="text-gray-400 font-mono text-xs">/</span>
    <span class="font-mono text-gray-600 text-sm">{section}</span>
    {#each crumbs as crumb}
      <span class="text-gray-400 font-mono text-xs">/</span>
      {#if crumb.href}
        <a href={crumb.href} class="font-mono text-gray-600 text-sm hover:text-brand-black transition-colors">{crumb.label}</a>
      {:else}
        <span class="font-mono text-gray-600 text-sm">{crumb.label}</span>
      {/if}
    {/each}
  </div>
  <nav class="flex items-center gap-4">
    <a href="/admin" class="text-gray-500 hover:text-brand-black font-mono text-xs transition-colors {section === 'contacts' ? 'text-brand-black' : ''}">contacts</a>
    <a href="/admin/events" class="text-gray-500 hover:text-brand-black font-mono text-xs transition-colors {section === 'events' ? 'text-brand-black' : ''}">events</a>
    <a href="/admin/artists" class="text-gray-500 hover:text-brand-black font-mono text-xs transition-colors {section === 'artists' ? 'text-brand-black' : ''}">artists</a>
    <a href="/admin/campaigns" class="text-gray-500 hover:text-brand-black font-mono text-xs transition-colors {section === 'campaigns' ? 'text-brand-black' : ''}">campaigns</a>
    <a href="/admin/artist-profiles" class="text-gray-500 hover:text-brand-black font-mono text-xs transition-colors {section === 'artist-profiles' ? 'text-brand-black' : ''}">profiles</a>
    <a href="/admin/giveaway-entries" class="text-gray-500 hover:text-brand-black font-mono text-xs transition-colors {section === 'giveaway-entries' ? 'text-brand-black' : ''}">entries</a>
    <a href="/admin/images" class="text-gray-500 hover:text-brand-black font-mono text-xs transition-colors {section === 'images' ? 'text-brand-black' : ''}">images</a>
    <form method="POST" action="/admin?/logout" use:enhance>
      <button type="submit" class="text-gray-500 hover:text-brand-black font-mono text-xs transition-colors">logout</button>
    </form>
  </nav>
</header>
