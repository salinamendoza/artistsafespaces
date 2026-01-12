<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import ImpactCalculator from '$lib/components/ImpactCalculator.svelte';
  import { sponsorBenefits } from '$lib/data/site';
</script>

<svelte:head>
  <title>Sponsor an Art Park | Artist Safespaces</title>
  <meta name="description" content="A 4-year investment in permanent community infrastructure. Naming rights, branded events, and authentic community engagement." />
</svelte:head>

<!-- Hero Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl">
      <SectionHeader
        eyebrow="Corporate Sponsorship"
        title="Sponsor an Art Park"
        description="A 4-year investment in permanent community infrastructure that delivers authentic community engagement, lasting brand recognition, and meaningful ESG impact."
      />
    </div>
  </div>
</section>

<!-- Impact Calculator -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <ImpactCalculator />
  </div>
</section>

<!-- What Sponsors Get -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Your Benefits"
      title="What Sponsors Get"
      centered={true}
    />

    <div class="mt-16 max-w-3xl mx-auto">
      <div class="space-y-6">
        {#each sponsorBenefits as benefit, i}
          <div class="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors">
            <div class="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-brand-black font-bold">{i + 1}</span>
            </div>
            <p class="text-brand-black text-lg pt-1">{benefit}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- ROI Comparison -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Value Proposition"
      title="ROI Comparison"
      centered={true}
    />

    <div class="mt-16 max-w-4xl mx-auto">
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-gray-100 border border-gray-200 rounded-xl p-8">
          <h3 class="text-gray-400 font-semibold mb-6">Traditional Advertising</h3>
          <div class="space-y-4 text-gray-400">
            <p>$125K buys fleeting impressions</p>
            <p>Transactional relationship with audience</p>
            <p>No lasting community connection</p>
            <p>Diminishing returns over time</p>
            <p>Easily forgotten</p>
          </div>
        </div>
        <div class="bg-brand-black rounded-xl p-8">
          <h3 class="text-brand-yellow font-semibold mb-6">Art Park Sponsorship</h3>
          <div class="space-y-4 text-white">
            <p>$125K creates permanent infrastructure</p>
            <p>Authentic community engagement</p>
            <p>48 branded events over 4 years</p>
            <p>Growing community goodwill</p>
            <p>Legacy that outlasts the campaign</p>
          </div>
        </div>
      </div>

      <div class="mt-12 bg-white border border-gray-200 rounded-xl p-8">
        <h3 class="text-brand-black font-semibold text-xl mb-6">By the Numbers</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p class="text-brand-black font-display text-3xl font-bold">48</p>
            <p class="text-gray-600 text-sm">Branded Events</p>
          </div>
          <div>
            <p class="text-brand-black font-display text-3xl font-bold">4</p>
            <p class="text-gray-600 text-sm">Years of Naming Rights</p>
          </div>
          <div>
            <p class="text-brand-black font-display text-3xl font-bold">365</p>
            <p class="text-gray-600 text-sm">Days/Year Visibility</p>
          </div>
          <div>
            <p class="text-brand-black font-display text-3xl font-bold">∞</p>
            <p class="text-gray-600 text-sm">Community Goodwill</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 md:py-32 bg-brand-black">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="font-display text-4xl md:text-5xl font-bold text-white mb-6">
      Become a Founding Sponsor
    </h2>
    <p class="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
      Join us in building the infrastructure for human connection. Be among the first corporate partners to bring an Art Park to life.
    </p>
    <Button href="/partners/apply" size="lg">Start the Conversation</Button>
  </div>
</section>
