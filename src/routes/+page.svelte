<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { stats, artTherapyThemes } from '$lib/data/site';
  import { images, heroImages } from '$lib/data/images';

  const currentTheme = artTherapyThemes.find(t => t.current);
</script>

<svelte:head>
  <title>Artist Safespaces | Free Art Parks for Every City</title>
</svelte:head>

<!-- Hero Section - Dark accent with background image -->
<section class="min-h-screen flex items-center justify-center relative overflow-hidden bg-brand-black">
  <!-- Background image -->
  <div class="absolute inset-0">
    <img
      src={images.murals.twoMurals}
      alt="Live mural painting at IKEA Art Therapy event"
      class="w-full h-full object-cover opacity-30"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-brand-black/60"></div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
    <h1 class="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
      Free Art Parks<br />
      <span class="text-brand-yellow">for Every City</span>
    </h1>
    <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
      We're building permanent creative spaces where anyone can paint, perform, and connect—no studio required.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/art-parks" class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-brand-yellow text-brand-black hover:bg-yellow-300 transition-colors">
        Learn About Art Parks
      </a>
      <a href="/partners/apply" class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-transparent border-2 border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-brand-black transition-colors">
        Partner With Us
      </a>
    </div>
  </div>
</section>

<!-- Stats Bar -->
<section class="bg-gray-50 border-y border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
      {#each stats as stat}
        <StatCard value={stat.value} label={stat.label} />
      {/each}
    </div>
  </div>
</section>

<!-- The Problem Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl">
      <SectionHeader
        eyebrow="The Challenge"
        title="The Problem"
      />
      <div class="mt-8 space-y-6 text-lg text-gray-600 leading-relaxed">
        <p>
          Third spaces are disappearing. The coffee shops, community centers, and public gathering places that once brought us together have been replaced by screens and algorithms. Young people lack accessible creative outlets, and the arts have been priced out of our communities.
        </p>
        <p>
          Meanwhile, isolation is rising. People are lonelier than ever, craving authentic connection but finding fewer places to make it happen. Cities have vacant lots and unused spaces while residents have nowhere to gather, create, or simply be together.
        </p>
        <p>
          The infrastructure for human connection is crumbling—and we're here to rebuild it.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- The Solution Section -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <SectionHeader
          eyebrow="The Solution"
          title="Art Parks: A New Model"
        />
        <div class="mt-8 space-y-6 text-lg text-gray-600 leading-relaxed">
          <p>
            Art Parks are permanent, free, public creative spaces in cities across America. Each park features mural walls, installed easels, a small performance stage, and secure perimeter access through your local library card.
          </p>
          <p>
            Corporate sponsors fund the parks. Cities provide the land. Artists and community members get free access to create, perform, and gather. It's a new model for public infrastructure—one that puts creativity and connection first.
          </p>
        </div>
        <div class="mt-8">
          <Button href="/art-parks">Explore Art Parks</Button>
        </div>
      </div>
      <div class="relative">
        <div class="aspect-square rounded-2xl overflow-hidden">
          <img
            src={images.murals.buildingBlocks}
            alt="Artist painting colorful mural at Art Therapy event"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Art Therapy Preview -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div class="order-2 lg:order-1">
        <div class="relative">
          <div class="aspect-video rounded-2xl overflow-hidden">
            <img
              src={images.community.groupPhotoMural}
              alt="Community group photo with How Are You Feeling mural"
              class="w-full h-full object-cover"
            />
          </div>
          {#if currentTheme}
            <div class="absolute bottom-4 left-4 right-4 bg-brand-black/90 backdrop-blur-sm rounded-lg p-4">
              <p class="text-brand-yellow font-semibold text-xs uppercase tracking-widest mb-1">{currentTheme.year} Theme</p>
              <p class="text-white font-display text-2xl font-bold">{currentTheme.theme}</p>
            </div>
          {/if}
        </div>
      </div>
      <div class="order-1 lg:order-2">
        <SectionHeader
          eyebrow="Annual Event"
          title="Art Therapy Festival"
        />
        <div class="mt-8 space-y-6 text-lg text-gray-600 leading-relaxed">
          <p>
            Each year, we host Art Therapy—a one-day festival celebrating mental health awareness through creative expression. Live mural painting, spoken word performances, DJ sets, and community workshops come together in partnership with major retailers.
          </p>
          <p>
            Every artist is compensated at market rates. Always.
          </p>
        </div>
        <div class="mt-8">
          <Button href="/art-therapy">Learn About Art Therapy</Button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 md:py-32 bg-brand-black">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="font-display text-4xl md:text-5xl font-bold text-white mb-6">
      Ready to bring an Art Park to your city?
    </h2>
    <p class="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
      Whether you're a corporate sponsor looking to invest in community infrastructure or a city partner seeking innovative public space solutions, we'd love to connect.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="/art-parks/sponsors"
        class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-brand-yellow text-brand-black hover:bg-yellow-300 transition-colors"
      >
        For Sponsors
      </a>
      <a
        href="/art-parks/cities"
        class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-transparent border-2 border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-brand-black transition-colors"
      >
        For Cities
      </a>
    </div>
  </div>
</section>
