<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import { artParkFeatures, financialModel } from '$lib/data/site';

  const featureIcons: Record<string, string> = {
    wall: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm2 2v10h12V7H6z',
    easel: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    stage: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    security: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    storage: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    design: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
  };
</script>

<svelte:head>
  <title>Community Art Parks | Artist Safespaces</title>
  <meta name="description" content="Free, public creative spaces providing accessible venues for painting, spoken word, music, and artistic expression." />
</svelte:head>

<!-- Hero Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl">
      <SectionHeader
        eyebrow="Our Flagship Program"
        title="Community Art Parks"
        description="Free, public creative spaces providing accessible venues for painting, spoken word, music, and artistic expression."
      />
    </div>
  </div>
</section>

<!-- What's Included Section -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Park Features"
      title="What's Included"
      centered={true}
    />

    <div class="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each artParkFeatures as feature}
        <div class="bg-white border border-gray-200 rounded-xl p-8 hover:border-brand-black/30 hover:shadow-lg transition-all">
          <div class="w-12 h-12 bg-brand-black rounded-lg flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={featureIcons[feature.icon] || featureIcons.wall} />
            </svg>
          </div>
          <h3 class="text-brand-black font-semibold text-xl mb-3">{feature.title}</h3>
          <p class="text-gray-600">{feature.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Financial Model Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Investment"
      title="Financial Model"
      centered={true}
    />

    <div class="mt-16 max-w-4xl mx-auto">
      <div class="grid md:grid-cols-3 gap-6 mb-12">
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p class="text-brand-black font-display text-4xl font-bold mb-2">${(financialModel.setup / 1000).toFixed(0)}K</p>
          <p class="text-brand-black font-semibold mb-1">Setup Cost</p>
          <p class="text-gray-500 text-sm">One-time installation</p>
        </div>
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p class="text-brand-black font-display text-4xl font-bold mb-2">${(financialModel.annualOps / 1000).toFixed(0)}K</p>
          <p class="text-brand-black font-semibold mb-1">Annual Operations</p>
          <p class="text-gray-500 text-sm">Per year</p>
        </div>
        <div class="bg-brand-black rounded-xl p-8 text-center">
          <p class="text-brand-yellow font-display text-4xl font-bold mb-2">${(financialModel.totalInvestment / 1000).toFixed(0)}K</p>
          <p class="text-white font-semibold mb-1">Total Investment</p>
          <p class="text-gray-400 text-sm">4-year commitment</p>
        </div>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-xl p-8">
        <h3 class="text-brand-black font-semibold text-xl mb-6 text-center">4-Year Breakdown</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <span class="text-gray-600">Year 1 (Setup + Operations)</span>
            <span class="text-brand-black font-semibold">${(financialModel.yearOne).toLocaleString()}</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <span class="text-gray-600">Year 2</span>
            <span class="text-brand-black font-semibold">${(financialModel.yearsTwo4).toLocaleString()}</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <span class="text-gray-600">Year 3</span>
            <span class="text-brand-black font-semibold">${(financialModel.yearsTwo4).toLocaleString()}</span>
          </div>
          <div class="flex justify-between items-center py-3 border-b border-gray-200">
            <span class="text-gray-600">Year 4</span>
            <span class="text-brand-black font-semibold">${(financialModel.yearsTwo4).toLocaleString()}</span>
          </div>
          <div class="flex justify-between items-center py-3 font-bold">
            <span class="text-brand-black">Total Investment</span>
            <span class="text-brand-black">${(financialModel.totalInvestment).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 md:py-32 bg-brand-black">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-white/10 border border-white/20 rounded-2xl p-10 text-center">
        <h3 class="text-white font-display text-3xl font-bold mb-4">For Corporate Sponsors</h3>
        <p class="text-gray-300 mb-8">
          Invest in permanent community infrastructure. Naming rights, branded events, and authentic community engagement.
        </p>
        <a href="/art-parks/sponsors" class="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-brand-yellow text-brand-black hover:bg-yellow-300 transition-colors">
          Learn About Sponsorship
        </a>
      </div>
      <div class="bg-white/10 border border-white/20 rounded-2xl p-10 text-center">
        <h3 class="text-white font-display text-3xl font-bold mb-4">For City Partners</h3>
        <p class="text-gray-300 mb-8">
          Zero budget impact. Transform underutilized spaces into vibrant community assets.
        </p>
        <a href="/art-parks/cities" class="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg bg-brand-yellow text-brand-black hover:bg-yellow-300 transition-colors">
          Explore City Partnership
        </a>
      </div>
    </div>
  </div>
</section>
