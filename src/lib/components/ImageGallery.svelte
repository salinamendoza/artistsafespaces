<script lang="ts">
  import OptimizedImage from './OptimizedImage.svelte';

  export let images: { src: string; alt: string; category?: string }[] = [];
  export let categories: string[] = [];

  let activeCategory = 'all';
  let lightboxIndex = -1;

  $: filteredImages = activeCategory === 'all'
    ? images
    : images.filter(img => img.category === activeCategory);

  $: lightboxOpen = lightboxIndex >= 0;

  function openLightbox(index: number) {
    lightboxIndex = index;
  }

  function closeLightbox() {
    lightboxIndex = -1;
  }

  function nextImage() {
    lightboxIndex = (lightboxIndex + 1) % filteredImages.length;
  }

  function prevImage() {
    lightboxIndex = (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Category Filters -->
{#if categories.length > 0}
  <div class="flex flex-wrap gap-2 mb-8 justify-center">
    <button
      class="px-4 py-2 text-sm font-semibold rounded-full transition-colors {activeCategory === 'all' ? 'bg-brand-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
      on:click={() => activeCategory = 'all'}
    >
      All
    </button>
    {#each categories as category}
      <button
        class="px-4 py-2 text-sm font-semibold rounded-full transition-colors capitalize {activeCategory === category ? 'bg-brand-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
        on:click={() => activeCategory = category}
      >
        {category}
      </button>
    {/each}
  </div>
{/if}

<!-- Image Grid -->
<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
  {#each filteredImages as image, i}
    <button
      class="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 rounded-xl"
      on:click={() => openLightbox(i)}
    >
      <div class="relative overflow-hidden rounded-xl">
        <OptimizedImage
          src={image.src}
          alt={image.alt}
          aspect={i % 3 === 0 ? '4/3' : 'square'}
          rounded="rounded-xl"
        />
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
      </div>
      <p class="mt-2 text-sm text-gray-500 text-left">{image.alt}</p>
    </button>
  {/each}
</div>

<!-- Lightbox -->
{#if lightboxOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    role="dialog"
    aria-modal="true"
    aria-label="Image viewer"
  >
    <button
      class="absolute top-4 right-4 text-white/80 hover:text-white text-4xl leading-none z-10"
      on:click={closeLightbox}
      aria-label="Close"
    >&times;</button>

    <button
      class="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl z-10"
      on:click={prevImage}
      aria-label="Previous image"
    >&#8249;</button>

    <button
      class="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl z-10"
      on:click={nextImage}
      aria-label="Next image"
    >&#8250;</button>

    <div class="max-w-5xl max-h-[85vh] w-full">
      <img
        src={filteredImages[lightboxIndex].src}
        alt={filteredImages[lightboxIndex].alt}
        class="w-full h-full object-contain max-h-[80vh]"
        loading="eager"
      />
      <p class="text-white/70 text-center mt-3 text-sm">
        {filteredImages[lightboxIndex].alt}
        <span class="text-white/40 ml-2">{lightboxIndex + 1} / {filteredImages.length}</span>
      </p>
    </div>

    <!-- Click backdrop to close -->
    <button
      class="absolute inset-0 -z-10"
      on:click={closeLightbox}
      aria-label="Close lightbox"
    ></button>
  </div>
{/if}
