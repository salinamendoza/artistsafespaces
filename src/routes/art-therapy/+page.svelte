<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import { artTherapyThemes, festivalActivities } from '$lib/data/site';
</script>

<svelte:head>
  <title>Art Therapy Festival | Artist Safespaces</title>
  <meta name="description" content="Annual mental health awareness through creative expression. Live mural painting, spoken word, DJ sets, and community workshops." />
</svelte:head>

<!-- Hero Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl">
      <SectionHeader
        eyebrow="Annual Event"
        title="Art Therapy Festival"
        description="Annual mental health awareness through creative expression. A one-day celebration bringing together artists, community members, and partners to explore themes that matter."
      />
    </div>
  </div>
</section>

<!-- About the Festival -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <SectionHeader
          eyebrow="The Event"
          title="About Art Therapy"
        />
        <div class="mt-8 space-y-6 text-lg text-gray-600 leading-relaxed">
          <p>
            Art Therapy is our annual one-day festival dedicated to mental health awareness through creative expression. Each year, we partner with major retailers to create an immersive experience where art becomes a vehicle for conversation, healing, and connection.
          </p>
          <p>
            Past partners include IKEA, and we continue to build relationships with organizations that share our commitment to community wellbeing. The festival brings together visual artists, musicians, spoken word performers, and facilitators for a day of creation and celebration.
          </p>
          <p>
            Most importantly, every artist is compensated at market rates. We believe that asking artists to work for free undermines the very values we're trying to promote.
          </p>
        </div>
      </div>
      <div class="relative">
        <div class="aspect-square bg-brand-black rounded-2xl flex items-center justify-center p-8">
          <div class="text-center">
            <p class="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-4">We Pay Artists</p>
            <p class="text-white font-display text-5xl font-bold mb-4">100%</p>
            <p class="text-gray-300 text-lg">Market-rate compensation</p>
            <p class="text-gray-400 text-sm mt-2">Always. No exceptions.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Theme Timeline -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Annual Themes"
      title="Theme Timeline"
      centered={true}
    />

    <div class="mt-16 max-w-4xl mx-auto">
      <div class="relative">
        <!-- Timeline line -->
        <div class="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gray-200"></div>

        <div class="space-y-12">
          {#each artTherapyThemes as theme, i}
            <div class="relative flex items-center {i % 2 === 0 ? 'justify-start' : 'justify-end'}">
              <!-- Timeline dot -->
              <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full {theme.current ? 'bg-brand-yellow' : 'bg-gray-400'}"></div>

              <!-- Content card -->
              <div class="w-5/12 {i % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}">
                <div class="bg-white border {theme.current ? 'border-brand-black' : 'border-gray-200'} rounded-xl p-6 {theme.current ? 'shadow-lg' : ''}">
                  <p class="text-gray-500 font-semibold text-sm mb-2">{theme.year}</p>
                  <h3 class="text-brand-black font-display text-3xl font-bold mb-2">{theme.theme}</h3>
                  <p class="text-gray-600">{theme.description}</p>
                  {#if theme.current}
                    <span class="inline-block mt-3 px-3 py-1 bg-brand-yellow text-brand-black text-xs font-semibold rounded-full">
                      Current Theme
                    </span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- What Happens -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Experience"
      title="What Happens"
      centered={true}
    />

    <div class="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each festivalActivities as activity, i}
        <div class="bg-brand-black border border-white/10 rounded-xl p-8 hover:border-brand-yellow/50 transition-colors">
          <div class="w-12 h-12 bg-brand-yellow/10 rounded-lg flex items-center justify-center mb-6">
            <span class="text-brand-yellow font-display text-2xl font-bold">{i + 1}</span>
          </div>
          <h3 class="text-white font-semibold text-xl">{activity}</h3>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Artist Participation -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto text-center">
      <SectionHeader
        eyebrow="For Artists"
        title="We Pay Artists. Always."
        centered={true}
      />
      <div class="mt-8 space-y-6 text-lg text-gray-600 leading-relaxed">
        <p>
          Art Therapy isn't built on free labor. Every artist who performs, facilitates, or creates at our festival receives standard market-rate compensation. This isn't a perk—it's a principle.
        </p>
        <p>
          We believe that sustainable creative communities require sustainable economics. When we ask artists to contribute their skills, we compensate them fairly for their work and expertise.
        </p>
      </div>
      <div class="mt-10">
        <Button href="/artists/apply" size="lg">Apply to Perform</Button>
      </div>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 md:py-32 bg-brand-yellow">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="font-display text-4xl md:text-5xl font-bold text-brand-black mb-6">
      Host Art Therapy in Your Space
    </h2>
    <p class="text-xl text-brand-black/70 max-w-2xl mx-auto mb-10">
      Interested in partnering with us to bring Art Therapy to your venue or community? We're always looking for spaces and sponsors who share our vision.
    </p>
    <a
      href="/partners/apply"
      class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-brand-black text-white hover:bg-gray-800 transition-colors"
    >
      Become a Partner
    </a>
  </div>
</section>
