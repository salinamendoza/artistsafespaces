<script lang="ts">
  import { page } from '$app/stores';
  import { navLinks } from '$lib/data/site';
  import Button from './Button.svelte';

  let mobileMenuOpen = false;

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }
</script>

<header class="fixed top-0 left-0 right-0 z-50 bg-brand-black/95 backdrop-blur-sm border-b border-white/10">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 md:h-20">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2" on:click={closeMobileMenu}>
        <img src="/logo-icon.png" alt="Artist Safespaces" class="h-8 w-auto" />
        <span class="font-display text-xl font-bold text-white hidden sm:block">Artist Safespaces</span>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-8">
        {#each navLinks as link}
          <a
            href={link.href}
            class="text-white hover:text-brand-yellow transition-colors duration-200 font-medium {$page.url.pathname.startsWith(link.href) ? 'text-brand-yellow' : ''}"
          >
            {link.label}
          </a>
        {/each}
        <Button href="/partners/apply" size="sm">Partner With Us</Button>
      </div>

      <!-- Mobile Menu Button -->
      <button
        type="button"
        class="md:hidden p-2 text-white hover:text-brand-yellow transition-colors"
        on:click={toggleMobileMenu}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        {#if mobileMenuOpen}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        {:else}
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        {/if}
      </button>
    </div>

    <!-- Mobile Navigation -->
    {#if mobileMenuOpen}
      <div class="md:hidden py-4 border-t border-white/10">
        <div class="flex flex-col gap-4">
          {#each navLinks as link}
            <a
              href={link.href}
              class="text-white hover:text-brand-yellow transition-colors duration-200 font-medium py-2 {$page.url.pathname.startsWith(link.href) ? 'text-brand-yellow' : ''}"
              on:click={closeMobileMenu}
            >
              {link.label}
            </a>
          {/each}
          <div class="pt-4">
            <Button href="/partners/apply" on:click={closeMobileMenu}>Partner With Us</Button>
          </div>
        </div>
      </div>
    {/if}
  </nav>
</header>
