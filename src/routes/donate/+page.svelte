<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import { siteConfig } from '$lib/data/site';
</script>

<svelte:head>
  <title>Donate | Artist Safespaces</title>
  <meta name="description" content="Support our mission to build free art parks and run Art Therapy festivals. Every contribution helps us pay artists and create community spaces." />
</svelte:head>

<!-- Hero Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto text-center">
      <SectionHeader
        eyebrow="Support Us"
        title="Support Our Mission"
        centered={true}
      />
    </div>
  </div>
</section>

<!-- Important Notice -->
<section class="pb-12">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-brand-yellow/10 border-2 border-brand-yellow/50 rounded-xl p-8">
      <div class="flex items-start gap-4">
        <div class="w-10 h-10 bg-brand-yellow rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-brand-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 class="text-brand-black font-semibold text-lg mb-2">Important Tax Notice</h3>
          <p class="text-gray-600">
            We are currently transitioning to 501(c)(3) status. During this transition, <strong class="text-brand-black">donations are NOT tax-deductible</strong>. We are committed to transparency and will update this notice once our status is finalized.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- How to Donate -->
<section class="py-12 md:py-20">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">
      <h2 class="text-brand-black font-display text-3xl font-bold mb-6">How to Donate</h2>
      <p class="text-gray-600 text-lg mb-8">
        For donation inquiries, please contact us directly:
      </p>
      <a
        href="mailto:{siteConfig.email.donate}"
        class="inline-flex items-center gap-3 px-8 py-4 bg-brand-yellow text-brand-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-lg"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        {siteConfig.email.donate}
      </a>
    </div>
  </div>
</section>

<!-- What Donations Support -->
<section class="py-12 md:py-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Your Impact"
      title="What Donations Support"
      centered={true}
    />

    <div class="mt-12 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 hover:border-brand-yellow/50 transition-colors">
        <div class="w-12 h-12 bg-brand-yellow/10 rounded-lg flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-brand-black font-semibold text-xl mb-3">Artist Compensation</h3>
        <p class="text-gray-600">Every artist we work with receives market-rate pay. Your donation helps ensure fair compensation for creative work.</p>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 hover:border-brand-yellow/50 transition-colors">
        <div class="w-12 h-12 bg-brand-yellow/10 rounded-lg flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 class="text-brand-black font-semibold text-xl mb-3">Festival Production</h3>
        <p class="text-gray-600">Art Therapy festivals require venues, equipment, supplies, and coordination. Donations help bring these events to life.</p>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 hover:border-brand-yellow/50 transition-colors">
        <div class="w-12 h-12 bg-brand-yellow/10 rounded-lg flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 class="text-brand-black font-semibold text-xl mb-3">Park Development Advocacy</h3>
        <p class="text-gray-600">Building relationships with cities and sponsors takes time and resources. Your support helps us expand to new locations.</p>
      </div>

      <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 hover:border-brand-yellow/50 transition-colors">
        <div class="w-12 h-12 bg-brand-yellow/10 rounded-lg flex items-center justify-center mb-6">
          <svg class="w-6 h-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 class="text-brand-black font-semibold text-xl mb-3">Community Programming</h3>
        <p class="text-gray-600">Workshops, events, and ongoing programming keep our spaces vibrant and accessible to all.</p>
      </div>
    </div>
  </div>
</section>

<!-- Other Ways to Help -->
<section class="py-12 md:py-20 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Get Involved"
      title="Other Ways to Help"
      centered={true}
    />

    <div class="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <a href="/partners/apply" class="bg-white border border-gray-200 rounded-xl p-8 text-center hover:border-brand-yellow/50 transition-colors group">
        <div class="w-16 h-16 mx-auto mb-6 bg-brand-yellow/10 rounded-full flex items-center justify-center group-hover:bg-brand-yellow/20 transition-colors">
          <svg class="w-8 h-8 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-brand-black font-semibold text-xl mb-2">Partner With Us</h3>
        <p class="text-gray-600 text-sm">Corporate sponsors, city partners, and foundations</p>
      </a>

      <a href="/artists/apply" class="bg-white border border-gray-200 rounded-xl p-8 text-center hover:border-brand-yellow/50 transition-colors group">
        <div class="w-16 h-16 mx-auto mb-6 bg-brand-yellow/10 rounded-full flex items-center justify-center group-hover:bg-brand-yellow/20 transition-colors">
          <svg class="w-8 h-8 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <h3 class="text-brand-black font-semibold text-xl mb-2">Apply as Artist</h3>
        <p class="text-gray-600 text-sm">Join our network and get paid for your work</p>
      </a>

      <div class="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-6 bg-brand-yellow/10 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </div>
        <h3 class="text-brand-black font-semibold text-xl mb-2">Spread the Word</h3>
        <p class="text-gray-600 text-sm">Share our mission with your network</p>
      </div>
    </div>
  </div>
</section>
