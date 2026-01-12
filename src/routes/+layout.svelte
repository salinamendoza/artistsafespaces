<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
  <title>Artist Safespaces | Free Art Parks for Every City</title>
  <meta name="description" content="Artist Safespaces is a 501(c)(3) nonprofit creating free public art parks and running annual Art Therapy festivals. Building the infrastructure for human connection in the automation era." />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Header />
  <main class="flex-1 pt-16 md:pt-20">
    <slot />
  </main>
  <Footer />
</div>
