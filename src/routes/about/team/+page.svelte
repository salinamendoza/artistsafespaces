<script lang="ts">
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import { teamMembers, boardMembers } from '$lib/data/site';
</script>

<svelte:head>
  <title>Our Team | Artist Safespaces</title>
  <meta name="description" content="Meet the people behind Artist Safespaces — the team building free public art parks and community creative spaces across America." />
</svelte:head>

<!-- Hero -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl">
      <SectionHeader
        eyebrow="Our People"
        title="The Team Behind the Mission"
        description="The people who show up every day to build creative infrastructure for communities that need it most."
      />
    </div>
  </div>
</section>

<!-- Team -->
<section class="py-20 md:py-32 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each teamMembers as member}
        <div class="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-400 transition-colors">
          {#if member.photo}
            <div class="aspect-[3/4] rounded-lg overflow-hidden mb-5">
              <img src={member.photo} alt={member.name} class="w-full h-full object-cover" loading="lazy" />
            </div>
          {:else}
            <div class="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center mb-5">
              <span class="text-brand-black font-display text-xl font-bold">{member.name[0]}</span>
            </div>
          {/if}
          <h3 class="font-display text-xl font-bold text-brand-black">{member.name}</h3>
          <p class="text-gray-600 mt-1">{member.role}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Board of Directors -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <SectionHeader
        eyebrow="Governance"
        title="Board of Directors"
        centered={true}
      />

      <div class="mt-12 space-y-4">
        {#each boardMembers as member}
          <div class="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-6">
            {#if member.photo}
              <div class="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                <img src={member.photo} alt={member.name} class="w-full h-full object-cover" loading="lazy" />
              </div>
            {:else}
              <div class="w-14 h-14 bg-brand-black rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-white font-display text-base font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            {/if}
            <div>
              <h3 class="font-display text-lg font-semibold text-brand-black">{member.name}</h3>
              <p class="text-gray-500 text-sm">{member.role}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="py-20 md:py-32 bg-brand-yellow">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="font-display text-4xl md:text-5xl font-bold text-brand-black mb-6">
      Work With Us
    </h2>
    <p class="text-xl text-brand-black/70 max-w-2xl mx-auto mb-10">
      Whether you're an artist, a potential partner, or someone who cares about community spaces, there's a place for you here.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a
        href="/artists/apply"
        class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-brand-black text-white hover:bg-gray-800 transition-colors"
      >
        Join as Artist
      </a>
      <a
        href="/contact"
        class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-transparent border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-white transition-colors"
      >
        Get in Touch
      </a>
    </div>
  </div>
</section>
