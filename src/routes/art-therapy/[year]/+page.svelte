<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import OptimizedImage from '$lib/components/OptimizedImage.svelte';
  import ImageGallery from '$lib/components/ImageGallery.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: ({ theme, galleryImages, categories } = data);
  $: heroImage = galleryImages[0];
</script>

<svelte:head>
  <title>{theme.theme} ({theme.year}) — Art Therapy | Artist Safespaces</title>
  <meta name="description" content="{theme.description}. {theme.longDescription}" />
</svelte:head>

<!-- Hero -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <a href="/art-therapy" class="inline-flex items-center text-sm text-gray-500 hover:text-brand-black transition-colors mb-6">
          <span class="mr-2">&larr;</span> Art Therapy
        </a>
        <p class="text-brand-yellow bg-brand-black inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
          {theme.year}
        </p>
        <h1 class="font-display text-5xl md:text-6xl font-bold text-brand-black mb-4">
          {theme.theme}
        </h1>
        <p class="text-xl text-gray-500 mb-6">{theme.description}</p>
        <p class="text-lg text-gray-600 leading-relaxed">
          {theme.longDescription}
        </p>
        {#if theme.current}
          <div class="mt-6">
            <span class="inline-block px-4 py-2 bg-brand-yellow text-brand-black text-sm font-semibold rounded-full">
              Current Theme
            </span>
          </div>
        {/if}
      </div>
      {#if heroImage}
        <div>
          <OptimizedImage
            src={heroImage.src}
            alt={heroImage.alt}
            aspect="4/3"
            rounded="rounded-2xl"
            eager={true}
          />
        </div>
      {/if}
    </div>
  </div>
</section>

<!-- Gallery -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Gallery"
      title="From the Festival"
      description="Browse images from Art Therapy {theme.year}: {theme.theme}."
      centered={true}
    />

    <div class="mt-12">
      <ImageGallery images={galleryImages} {categories} />
    </div>
  </div>
</section>

<!-- CTA -->
<section class="py-20 md:py-32 bg-brand-yellow">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="font-display text-4xl md:text-5xl font-bold text-brand-black mb-6">
      {#if theme.current}
        Join Us This Year
      {:else if theme.year > new Date().getFullYear()}
        Be Part of {theme.year}
      {:else}
        Explore More Themes
      {/if}
    </h2>
    <p class="text-xl text-brand-black/70 max-w-2xl mx-auto mb-10">
      {#if theme.current}
        Art Therapy {theme.year} is happening soon. Apply to perform, partner with us, or just show up.
      {:else}
        See all our annual themes and what's coming next.
      {/if}
    </p>
    <div class="flex flex-wrap gap-4 justify-center">
      <Button href="/art-therapy" size="lg">All Themes</Button>
      <Button href="/artists/apply" variant="secondary" size="lg">Apply to Perform</Button>
    </div>
  </div>
</section>
