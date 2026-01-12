<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import { whatCitiesProvide, whatCitiesReceive, whatCitiesDont } from '$lib/data/site';
</script>

<svelte:head>
  <title>City Partners | Artist Safespaces</title>
  <meta name="description" content="Zero budget impact. Permanent community infrastructure. Transform underutilized spaces into vibrant creative hubs." />
</svelte:head>

<!-- Hero Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl">
      <SectionHeader
        eyebrow="City Partnership"
        title="Partner With Us"
        description="Zero budget impact. Permanent community infrastructure. Transform underutilized spaces into vibrant creative hubs that bring your community together."
      />
    </div>
  </div>
</section>

<!-- What Cities Provide -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-16 items-start">
      <div>
        <SectionHeader
          eyebrow="Your Contribution"
          title="What Cities Provide"
        />
        <div class="mt-8 space-y-4">
          {#each whatCitiesProvide as item}
            <div class="flex items-start gap-4">
              <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <p class="text-gray-600 text-lg">{item}</p>
            </div>
          {/each}
        </div>
      </div>

      <div>
        <SectionHeader
          eyebrow="Your Benefits"
          title="What Cities Receive"
        />
        <div class="mt-8 space-y-4">
          {#each whatCitiesReceive as item}
            <div class="flex items-start gap-4">
              <div class="w-6 h-6 bg-brand-yellow rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-4 h-4 text-brand-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <p class="text-brand-black text-lg">{item}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- What Cities Don't Do -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto text-center">
      <SectionHeader
        eyebrow="No Hidden Burden"
        title="What Cities Don't Do"
        centered={true}
      />
      <div class="mt-12 grid md:grid-cols-3 gap-6">
        {#each whatCitiesDont as item}
          <div class="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <div class="w-10 h-10 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p class="text-gray-600">{item}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- Library Card Integration -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <SectionHeader
          eyebrow="Access System"
          title="Library Card Integration"
        />
        <div class="mt-8 space-y-6 text-lg text-gray-600 leading-relaxed">
          <p>
            Each Art Park features a secure perimeter with tap-in access using your city's existing library card system. This innovative approach leverages infrastructure already in place while promoting library engagement across your community.
          </p>
          <p>
            Library cards are free to all residents, ensuring equitable access to the park regardless of income. The system also provides valuable data on park usage without compromising privacy, helping demonstrate impact to stakeholders and sponsors.
          </p>
        </div>
      </div>
      <div class="relative">
        <div class="aspect-square bg-brand-black rounded-2xl flex items-center justify-center p-8">
          <div class="text-center">
            <div class="w-24 h-24 mx-auto mb-6 bg-brand-yellow/20 rounded-xl flex items-center justify-center">
              <svg class="w-12 h-12 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p class="text-white font-semibold text-xl mb-2">Tap to Enter</p>
            <p class="text-gray-400">Free access with any library card</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Zero Budget Impact -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-brand-yellow rounded-full mb-8">
        <span class="text-brand-black font-display text-4xl font-bold">$0</span>
      </div>
      <h2 class="font-display text-4xl md:text-5xl font-bold text-brand-black mb-6">
        Zero Budget Impact
      </h2>
      <p class="text-xl text-gray-600 leading-relaxed">
        Art Parks are fully funded by corporate sponsors. Cities contribute land and basic maintenance using existing staff—no new budget line items, no fundraising responsibilities, no financial risk. Just permanent community infrastructure at no cost.
      </p>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 md:py-32 bg-brand-yellow">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="font-display text-4xl md:text-5xl font-bold text-brand-black mb-6">
      Explore a Partnership
    </h2>
    <p class="text-xl text-brand-black/70 max-w-2xl mx-auto mb-10">
      Ready to bring an Art Park to your city? Let's discuss how we can work together to create permanent creative infrastructure for your community.
    </p>
    <a
      href="/partners/apply"
      class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-brand-black text-white hover:bg-gray-800 transition-colors"
    >
      Start the Conversation
    </a>
  </div>
</section>
