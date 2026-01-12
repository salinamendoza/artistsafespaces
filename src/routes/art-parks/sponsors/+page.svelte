<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import { financialModel, sponsorBenefits } from '$lib/data/site';
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

<!-- Investment Breakdown -->
<section class="py-20 md:py-32 bg-white/5">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="The Investment"
      title="Investment Breakdown"
      centered={true}
    />

    <div class="mt-16 max-w-4xl mx-auto">
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <div class="bg-brand-black border border-white/10 rounded-xl p-8">
          <h3 class="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-4">Year One</h3>
          <p class="text-white font-display text-5xl font-bold mb-2">$50,000</p>
          <p class="text-gray-400">Setup ($25K) + First year operations ($25K)</p>
        </div>
        <div class="bg-brand-black border border-white/10 rounded-xl p-8">
          <h3 class="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-4">Years 2-4</h3>
          <p class="text-white font-display text-5xl font-bold mb-2">$25,000<span class="text-2xl text-gray-400">/year</span></p>
          <p class="text-gray-400">Annual operations and programming</p>
        </div>
      </div>

      <div class="bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl p-10 text-center">
        <p class="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-4">Total 4-Year Investment</p>
        <p class="text-white font-display text-6xl font-bold mb-4">$125,000</p>
        <p class="text-gray-300 text-lg">Permanent community infrastructure with lasting impact</p>
      </div>
    </div>
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
          <div class="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-6 hover:border-brand-yellow/50 transition-colors">
            <div class="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-brand-black font-bold">{i + 1}</span>
            </div>
            <p class="text-white text-lg pt-1">{benefit}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- ROI Comparison -->
<section class="py-20 md:py-32 bg-white/5">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Value Proposition"
      title="ROI Comparison"
      centered={true}
    />

    <div class="mt-16 max-w-4xl mx-auto">
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-brand-black border border-white/10 rounded-xl p-8">
          <h3 class="text-gray-400 font-semibold mb-6">Traditional Advertising</h3>
          <div class="space-y-4 text-gray-400">
            <p>$125K buys fleeting impressions</p>
            <p>Transactional relationship with audience</p>
            <p>No lasting community connection</p>
            <p>Diminishing returns over time</p>
            <p>Easily forgotten</p>
          </div>
        </div>
        <div class="bg-brand-yellow/10 border border-brand-yellow/30 rounded-xl p-8">
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

      <div class="mt-12 bg-white/5 border border-white/10 rounded-xl p-8">
        <h3 class="text-white font-semibold text-xl mb-6">By the Numbers</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p class="text-brand-yellow font-display text-3xl font-bold">48</p>
            <p class="text-gray-400 text-sm">Branded Events</p>
          </div>
          <div>
            <p class="text-brand-yellow font-display text-3xl font-bold">4</p>
            <p class="text-gray-400 text-sm">Years of Naming Rights</p>
          </div>
          <div>
            <p class="text-brand-yellow font-display text-3xl font-bold">365</p>
            <p class="text-gray-400 text-sm">Days/Year Visibility</p>
          </div>
          <div>
            <p class="text-brand-yellow font-display text-3xl font-bold">∞</p>
            <p class="text-gray-400 text-sm">Community Goodwill</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 md:py-32">
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
