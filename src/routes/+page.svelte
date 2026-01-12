<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import { stats, artTherapyThemes } from '$lib/data/site';

  const currentTheme = artTherapyThemes.find(t => t.current);
</script>

<svelte:head>
  <title>Artist Safespaces | Free Art Parks for Every City</title>
</svelte:head>

<!-- Hero Section -->
<section class="min-h-screen flex items-center justify-center relative overflow-hidden">
  <!-- Subtle accent elements -->
  <div class="absolute top-20 left-10 w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl"></div>
  <div class="absolute bottom-20 right-10 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
    <h1 class="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
      Free Art Parks<br />
      <span class="text-brand-yellow">for Every City</span>
    </h1>
    <p class="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
      We're building permanent creative spaces where anyone can paint, perform, and connect—no studio required.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <Button href="/art-parks" size="lg">Learn About Art Parks</Button>
      <Button href="/partners/apply" variant="secondary" size="lg">Partner With Us</Button>
    </div>
  </div>
</section>

<!-- Stats Bar -->
<section class="bg-brand-black border-y border-white/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
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
      <div class="mt-8 space-y-6 text-lg text-gray-300 leading-relaxed">
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
<section class="py-20 md:py-32 bg-white/5">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <SectionHeader
          eyebrow="The Solution"
          title="Art Parks: A New Model"
        />
        <div class="mt-8 space-y-6 text-lg text-gray-300 leading-relaxed">
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
        <div class="aspect-square bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/5 rounded-2xl flex items-center justify-center">
          <div class="text-center p-8">
            <p class="text-brand-yellow font-display text-6xl font-bold mb-4">$0</p>
            <p class="text-white text-xl">Cost to Cities</p>
            <p class="text-gray-400 mt-2">Fully sponsor-funded</p>
          </div>
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
          <div class="aspect-video bg-gradient-to-br from-brand-yellow/10 to-transparent rounded-2xl flex items-center justify-center border border-brand-yellow/20">
            {#if currentTheme}
              <div class="text-center p-8">
                <p class="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-2">{currentTheme.year} Theme</p>
                <p class="text-white font-display text-5xl font-bold mb-3">{currentTheme.theme}</p>
                <p class="text-gray-400">{currentTheme.description}</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
      <div class="order-1 lg:order-2">
        <SectionHeader
          eyebrow="Annual Event"
          title="Art Therapy Festival"
        />
        <div class="mt-8 space-y-6 text-lg text-gray-300 leading-relaxed">
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
<section class="py-20 md:py-32 bg-brand-yellow">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="font-display text-4xl md:text-5xl font-bold text-brand-black mb-6">
      Ready to bring an Art Park to your city?
    </h2>
    <p class="text-xl text-brand-black/70 max-w-2xl mx-auto mb-10">
      Whether you're a corporate sponsor looking to invest in community infrastructure or a city partner seeking innovative public space solutions, we'd love to connect.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="/art-parks/sponsors"
        class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-brand-black text-white hover:bg-gray-800 transition-colors"
      >
        For Sponsors
      </a>
      <a
        href="/art-parks/cities"
        class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-transparent border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-white transition-colors"
      >
        For Cities
      </a>
    </div>
  </div>
</section>
