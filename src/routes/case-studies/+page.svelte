<script lang="ts">
  import { caseStudies } from '$lib/data/site';
</script>

<svelte:head>
  <title>Case Studies | Artist Safespaces</title>
  <meta
    name="description"
    content="How Artist Safespaces builds art programming for retail openings, civic activations, and cultural moments."
  />
</svelte:head>

<section class="bg-white text-brand-black">
  <div class="max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-10">
    <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-5">Case Studies</p>
    <h1 class="font-display text-4xl md:text-6xl font-bold leading-[0.95] mb-6 max-w-3xl">
      Real numbers from real activations.
    </h1>
    <p class="font-display text-lg md:text-xl text-gray-700 leading-snug max-w-2xl">
      How franchise budgets, civic openings, and cultural events become permanent community footprints — not marketing lists.
    </p>
  </div>

  <div class="max-w-5xl mx-auto px-6 pb-20 md:pb-32">
    <ul class="space-y-10 md:space-y-14">
      {#each caseStudies as cs}
        <li>
          <a href={cs.href} class="group block">
            <div class="grid md:grid-cols-[1.2fr_1fr] gap-6 md:gap-10 items-stretch">
              <div class="overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={cs.coverImage}
                  alt={cs.coverAlt}
                  class="w-full h-full object-cover aspect-[4/3] md:aspect-auto md:min-h-[320px] group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div class="flex flex-col justify-between">
                <div>
                  <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-3">{cs.eyebrow}</p>
                  <h2 class="font-display text-2xl md:text-3xl font-bold leading-tight mb-3 group-hover:underline underline-offset-4 decoration-2">
                    {cs.title}
                  </h2>
                  <p class="text-base text-gray-700 leading-relaxed mb-6">{cs.summary}</p>
                </div>
                <div class="grid grid-cols-3 gap-3 border-t border-gray-200 pt-4">
                  {#each cs.stats as stat}
                    <div>
                      <p class="font-display text-2xl md:text-3xl font-bold leading-none mb-1">{stat.value}</p>
                      <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 leading-snug">{stat.label}</p>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          </a>
        </li>
      {/each}
    </ul>

    {#if caseStudies.length === 1}
      <p class="font-mono text-[11px] uppercase tracking-widest text-gray-400 mt-14 text-center">More coming soon</p>
    {/if}
  </div>

  <section class="bg-brand-black text-white">
    <div class="px-6 py-14 md:py-20 max-w-3xl mx-auto text-center">
      <h2 class="font-display text-3xl md:text-5xl font-bold leading-tight mb-6">
        Have an opening, anniversary, or cultural moment coming up?
      </h2>
      <p class="text-lg leading-relaxed mb-8 text-gray-300">
        We design art programming that leaves a real footprint — not a marketing list.
      </p>
      <a
        href="/partners/apply"
        class="inline-block px-6 py-3 bg-brand-yellow text-brand-black font-mono text-sm font-bold uppercase tracking-widest rounded hover:opacity-90"
      >Partner With Us</a>
    </div>
  </section>
</section>
