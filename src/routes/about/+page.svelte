<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import { siteConfig, trackRecord } from '$lib/data/site';
  import { images, aboutImages } from '$lib/data/images';
</script>

<svelte:head>
  <title>About | Artist Safespaces</title>
  <meta name="description" content="Building the infrastructure for human connection in the automation era. Learn about our mission, history, and vision." />
</svelte:head>

<!-- Hero Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div class="max-w-xl">
        <SectionHeader
          eyebrow="Who We Are"
          title="About Artist Safespaces"
          description={siteConfig.tagline}
        />
      </div>
      <div class="relative">
        <div class="aspect-[4/3] rounded-2xl overflow-hidden">
          <img
            src={images.team.groupPhoto}
            alt="Artist Safespaces team and volunteers"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Our Story -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <SectionHeader
          eyebrow="Our Journey"
          title="Our Story"
        />
        <div class="mt-8 space-y-6 text-lg text-gray-600 leading-relaxed">
          <p>
            Artist Safespaces was founded in {siteConfig.founded} as a direct response to the disappearing creative spaces in our communities. What started as grassroots advocacy for accessible art venues has evolved into a comprehensive model for permanent community infrastructure.
          </p>
          <p>
            We watched coffee shops close, community centers shutter, and public gathering places fade away. At the same time, we saw the arts being priced out of cities, young people lacking creative outlets, and communities growing more isolated by the day.
          </p>
          <p>
            So we decided to build something different—permanent spaces that can't be sold, shut down, or priced out. Spaces owned by the community, funded by sponsors who believe in their mission, and accessible to anyone with a library card.
          </p>
        </div>
      </div>
      <div class="relative">
        <div class="grid grid-cols-2 gap-4">
          <div class="aspect-[3/4] rounded-xl overflow-hidden">
            <img
              src={images.team.speakerFemale}
              alt="Speaker at Art Therapy event"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="aspect-[3/4] rounded-xl overflow-hidden">
            <img
              src={images.team.speakerMale}
              alt="Speaker addressing the community"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
        <div class="absolute -bottom-4 -right-4 bg-brand-yellow rounded-xl p-4 shadow-lg">
          <p class="text-brand-black font-display text-3xl font-bold">{siteConfig.founded}</p>
          <p class="text-brand-black/70 text-sm">Founded</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Track Record -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Our Experience"
      title="Track Record"
      centered={true}
    />

    <div class="mt-16 max-w-3xl mx-auto">
      <div class="space-y-4">
        {#each trackRecord as item}
          <div class="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-gray-400 transition-colors">
            <div class="w-6 h-6 bg-brand-yellow rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
</section>

<!-- The Bigger Picture -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <SectionHeader
        eyebrow="Our Vision"
        title="The Bigger Picture"
        centered={true}
      />

      <div class="mt-12 space-y-8 text-lg text-gray-600 leading-relaxed text-center">
        <p>
          We're living through a unique moment in history. As AI and automation reshape how we work and live, the need for authentic human connection has never been greater. The algorithms that optimize our digital lives can't replace the experience of creating something with your hands, performing for a live audience, or simply being present with others in a shared space.
        </p>
        <p>
          Third spaces—the coffee shops, community centers, and public gathering places that once brought us together—are disappearing. The economics don't work. The real estate is too valuable. The returns aren't measurable enough.
        </p>
        <p>
          Art Parks are our answer to this market failure. By securing long-term corporate sponsorship and partnering directly with cities, we're building infrastructure that exists outside the normal economic pressures. These spaces can't be sold to developers or converted to more profitable uses. They're permanent. They're free. And they're for everyone.
        </p>
        <p class="text-brand-black font-semibold text-xl">
          Our vision is simple: Art parks in every city across America.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Mission and Values -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid md:grid-cols-2 gap-8">
      <div class="bg-gray-50 border border-gray-200 rounded-2xl p-10">
        <h3 class="text-gray-500 font-semibold text-sm uppercase tracking-widest mb-4">Our Mission</h3>
        <p class="text-brand-black font-display text-2xl font-semibold leading-relaxed">
          Remove barriers to artistic expression and build permanent infrastructure for human connection.
        </p>
      </div>
      <div class="bg-brand-black rounded-2xl p-10">
        <h3 class="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-4">Our Commitment</h3>
        <p class="text-white font-display text-2xl font-semibold leading-relaxed">
          Every artist we work with is compensated at market rates. Always. No exceptions.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 md:py-32 bg-brand-yellow">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="font-display text-4xl md:text-5xl font-bold text-brand-black mb-6">
      Join the Movement
    </h2>
    <p class="text-xl text-brand-black/70 max-w-2xl mx-auto mb-10">
      Whether you're an artist, sponsor, city partner, or supporter, there's a way for you to be part of building the infrastructure for human connection.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="/partners/apply"
        class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-brand-black text-white hover:bg-gray-800 transition-colors"
      >
        Partner With Us
      </a>
      <a
        href="/artists/apply"
        class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-transparent border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-white transition-colors"
      >
        Join as Artist
      </a>
    </div>
  </div>
</section>
