<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import { whyJoinArtists, artistOpportunities } from '$lib/data/site';
</script>

<svelte:head>
  <title>For Artists | Artist Safespaces</title>
  <meta name="description" content="Get paid to do what you love. Build community through art. Join our network of compensated artists." />
</svelte:head>

<!-- Hero Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl">
      <SectionHeader
        eyebrow="Join Our Community"
        title="Create With Us"
        description="Get paid to do what you love. Build community through art. Join a network of artists who believe in fair compensation and accessible creativity."
      />
      <div class="mt-10">
        <Button href="/artists/apply" size="lg">Apply to Join</Button>
      </div>
    </div>
  </div>
</section>

<!-- Why Join -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Benefits"
      title="Why Join"
      centered={true}
    />

    <div class="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each whyJoinArtists as benefit, i}
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 hover:border-brand-yellow/50 transition-colors">
          <div class="w-12 h-12 bg-brand-yellow rounded-lg flex items-center justify-center mb-6">
            <span class="text-brand-black font-bold text-xl">{i + 1}</span>
          </div>
          <p class="text-brand-black text-lg">{benefit}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Opportunities -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <SectionHeader
          eyebrow="Work With Us"
          title="Opportunities"
        />
        <div class="mt-8 space-y-6 text-lg text-gray-600 leading-relaxed">
          <p>
            We offer a variety of ways to get involved, from one-time festival performances to ongoing commissioned work. Whatever your medium—visual art, music, spoken word, dance, or workshop facilitation—there's a place for you in our community.
          </p>
          <p>
            All opportunities come with fair, market-rate compensation. We don't ask artists to work for exposure or experience. Your skills have value, and we compensate accordingly.
          </p>
        </div>
      </div>
      <div>
        <div class="space-y-4">
          {#each artistOpportunities as opportunity}
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-brand-yellow/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-3 h-3 bg-brand-yellow rounded-full flex-shrink-0"></div>
                <p class="text-brand-black text-lg">{opportunity}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- No Gatekeeping -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-brand-yellow/10 rounded-full mb-8">
        <svg class="w-10 h-10 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 class="font-display text-4xl md:text-5xl font-bold text-brand-black mb-6">
        No Gatekeeping
      </h2>
      <p class="text-xl text-gray-600 leading-relaxed mb-8">
        You don't need a degree, a portfolio of gallery shows, or years of professional experience. If you create, you're an artist. Our community is built on accessibility and inclusion—not credentials and connections.
      </p>
      <p class="text-lg text-gray-600">
        We evaluate applications based on passion, skill, and fit—not where you went to school or who you know. Everyone starts somewhere, and we're here to help you grow.
      </p>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="font-display text-4xl md:text-5xl font-bold text-brand-black mb-6">
      Ready to Create?
    </h2>
    <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
      Join our network of artists and start getting paid to do what you love. The application takes just a few minutes.
    </p>
    <Button href="/artists/apply" size="lg">Apply Now</Button>
  </div>
</section>
