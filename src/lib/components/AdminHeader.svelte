<script lang="ts">
  import { enhance } from '$app/forms';

  export let section: string;
  export let crumbs: { label: string; href?: string }[] = [];
</script>

<header class="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-brand-black">
  <div class="flex items-center gap-3 flex-wrap">
    <a href="/admin" class="font-mono text-brand-yellow text-sm font-bold hover:underline">admin</a>
    <span class="text-white/30 font-mono text-xs">/</span>
    <span class="font-mono text-white/60 text-sm">{section}</span>
    {#each crumbs as crumb}
      <span class="text-white/30 font-mono text-xs">/</span>
      {#if crumb.href}
        <a href={crumb.href} class="font-mono text-white/60 text-sm hover:text-brand-yellow transition-colors">{crumb.label}</a>
      {:else}
        <span class="font-mono text-white/60 text-sm">{crumb.label}</span>
      {/if}
    {/each}
  </div>
  <nav class="flex items-center gap-4">
    <a href="/admin" class="text-white/40 hover:text-brand-yellow font-mono text-xs transition-colors {section === 'contacts' ? 'text-brand-yellow' : ''}">contacts</a>
    <a href="/admin/events" class="text-white/40 hover:text-brand-yellow font-mono text-xs transition-colors {section === 'events' ? 'text-brand-yellow' : ''}">events</a>
    <a href="/admin/artists" class="text-white/40 hover:text-brand-yellow font-mono text-xs transition-colors {section === 'artists' ? 'text-brand-yellow' : ''}">artists</a>
    <a href="/admin/images" class="text-white/40 hover:text-brand-yellow font-mono text-xs transition-colors {section === 'images' ? 'text-brand-yellow' : ''}">images</a>
    <form method="POST" action="/admin?/logout" use:enhance>
      <button type="submit" class="text-white/40 hover:text-white font-mono text-xs transition-colors">logout</button>
    </form>
  </nav>
</header>
