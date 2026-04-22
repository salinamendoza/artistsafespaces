<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  $: isStandalone =
    $page.url.pathname.startsWith('/brief/') || $page.url.pathname.startsWith('/admin');
</script>

<svelte:head>
  <title>Artist Safespaces | Free Art Parks for Every City</title>
  <meta name="description" content="Artist Safespaces is a 501(c)(3) nonprofit creating free public art parks and running annual Art Therapy festivals. Building the infrastructure for human connection in the automation era." />
</svelte:head>

{#if isStandalone}
  <slot />
{:else}
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 pt-16 md:pt-20">
      <slot />
    </main>
    <Footer />
  </div>
{/if}
