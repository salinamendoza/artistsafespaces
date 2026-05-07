<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  const press = [
    {
      name: 'New York Post',
      url: 'https://nypost.com/2026/05/02/us-news/grand-opening-for-first-la-area-city-center-ikea-location/',
      note: 'Primary on-the-ground coverage'
    },
    {
      name: 'ABC7 Los Angeles',
      url: 'https://abc7.com/post/ikea-store-opens-culver-city-marking-companys-first-la-area-center-location/19024170/'
    },
    {
      name: 'AOL News',
      url: 'https://www.aol.com/news/mariachi-meatballs-hundreds-turn-grand-002024132.html'
    },
    {
      name: 'Yahoo News',
      url: 'https://www.yahoo.com/news/articles/ikea-store-opens-culver-city-211259093.html'
    }
  ];

  const url = 'https://artistsafespaces.org/case-studies/ikea-culver-city';
  const headline = 'How a franchise turned its grand opening into 601 new art collectors';
  const title = `${headline} — Artist Safespaces`;
  const description =
    "IKEA spent 12.5% of its Culver City grand opening budget on art programming — 2–4× industry average — and put 601 original works in attendees' hands in one day. No email harvesting, no list resale. Here's how it ran.";
  const ogImage = 'https://artistsafespaces.org/api/images/events/as-hero-images.webp';
  const ogImageAlt =
    'IKEA Culver City Grand Opening — Daniel Toledo painting the live mural in front of the Helms Bakery building';
  const publishedAt = '2026-05-02T00:00:00-07:00';
  const logoUrl = 'https://artistsafespaces.org/logo-icon.png';

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: ogImage,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Artist Safespaces',
      url: 'https://artistsafespaces.org'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Artist Safespaces',
      logo: {
        '@type': 'ImageObject',
        url: logoUrl
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  });
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={headline} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:width" content="2400" />
  <meta property="og:image:height" content="1350" />
  <meta property="og:image:alt" content={ogImageAlt} />
  <meta property="og:site_name" content="Artist Safespaces" />

  <!-- Article-specific -->
  <meta property="article:published_time" content={publishedAt} />
  <meta property="article:author" content="Artist Safespaces" />
  <meta property="article:section" content="Case Studies" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content={url} />
  <meta name="twitter:title" content={headline} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />
  <meta name="twitter:image:alt" content={ogImageAlt} />

  <!-- JSON-LD: Article schema -->
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<article class="bg-white text-brand-black">
  <!-- Hero -->
  <header class="px-6 pt-12 md:pt-20 pb-10 md:pb-14 max-w-5xl mx-auto">
    <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-5">
      Case Study · IKEA Culver City Grand Opening · 2026
    </p>
    <h1 class="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-6">
      How a franchise turned its grand opening into 601 new art collectors.
    </h1>
    <p class="font-display text-xl md:text-2xl text-gray-700 leading-snug max-w-3xl">
      Without harvesting a single email
    </p>
  </header>

  <div class="w-full">
    <img
      src="/api/images/events/as-hero-images.webp"
      alt="IKEA Culver City Grand Opening"
      class="w-full max-h-[640px] object-cover"
      loading="eager"
    />
  </div>

  <!-- Numbers strip -->
  <section class="px-6 py-14 md:py-20 max-w-5xl mx-auto">
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-10">
      <div>
        <p class="font-display text-5xl md:text-6xl font-bold leading-none mb-2">601</p>
        <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 leading-relaxed">New art collectors — anyone who walked away with a piece</p>
      </div>
      <div>
        <p class="font-display text-5xl md:text-6xl font-bold leading-none mb-2">12.5%</p>
        <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 leading-relaxed">Of grand opening budget invested in art programming · industry avg 3–8%</p>
      </div>
      <div>
        <p class="font-display text-5xl md:text-6xl font-bold leading-none mb-2">3 AM</p>
        <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 leading-relaxed">When the line started · didn't break from open to close</p>
      </div>
      <div>
        <p class="font-display text-5xl md:text-6xl font-bold leading-none mb-2">100<span class="text-gray-400 text-3xl"> shirts</span></p>
        <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 leading-relaxed">Live screen-printed on-site by The Apparel Studio</p>
      </div>
      <div>
        <p class="font-display text-5xl md:text-6xl font-bold leading-none mb-2">500<span class="text-gray-400 text-3xl"> prints</span></p>
        <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 leading-relaxed">Archival, museum-quality, distributed to attendees</p>
      </div>
      <div>
        <p class="font-display text-5xl md:text-6xl font-bold leading-none mb-2">1<span class="text-gray-400 text-3xl"> mural</span></p>
        <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 leading-relaxed">Painted live on-site, raffled to one entrant</p>
      </div>
    </div>
  </section>

  <!-- Setup -->
  <section class="px-6 py-10 md:py-14 max-w-3xl mx-auto">
    <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-3">The setup</p>
    <p class="text-lg md:text-xl text-brand-black leading-relaxed">
      IKEA opened its first Los Angeles city-format store at the historic 1931 Helms Bakery building in Culver City. The franchise wanted the neighborhood to walk away saying <em>"that store belongs to this neighborhood now"</em> — and committed an unusual share of opening spend to art programming to do it. Artist Safespaces ran it end-to-end: artist curation, asset commissioning, on-site experience design, and the digital infrastructure tying it all together.
    </p>
  </section>

  <!-- What attendees took home -->
  <section class="px-6 py-14 md:py-20 max-w-5xl mx-auto">
    <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-3">What attendees took home</p>
    <h2 class="font-display text-3xl md:text-5xl font-bold leading-tight mb-6 max-w-3xl">
      Original art, not branded merch.
    </h2>
    <p class="text-lg text-brand-black leading-relaxed max-w-3xl mb-10">
      Every grand opening has a freebie strategy. Most franchises hand out a logo tote, a mug, a coupon. The Culver City franchise made theirs <strong>original art</strong>, and let attendees choose:
    </p>
    <ul class="space-y-4 text-lg text-brand-black leading-relaxed mb-10 max-w-3xl">
      <li><strong>Walk in and pick one</strong> — a live screen-printed shirt <em>or</em> an archival, museum-quality print. First-come-first-serve, one per person. 100 shirts. 500 prints.</li>
      <li><strong>Plus</strong> — every attendee could enter the giveaway for the original mural painted live on-site that day.</li>
      <li><strong>Want both a shirt and a print?</strong> Get back in line. People did.</li>
    </ul>
    <p class="text-lg text-brand-black leading-relaxed max-w-3xl mb-10">
      Same line, same opening, same attendees. Different cultural residue. 500 logo totes end up in storage closets. <strong>601 pieces of original art by working artists end up framed on living room walls.</strong>
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <img
        src="/api/images/events/designs.webp"
        alt="Attendees inside IKEA Culver City holding prints by Upendo"
        class="w-full aspect-[4/5] object-cover rounded-lg"
        loading="lazy"
      />
      <img
        src="/api/images/events/designs2.webp"
        alt="Attendees inside IKEA Culver City with prints by Upendo"
        class="w-full aspect-[4/5] object-cover rounded-lg"
        loading="lazy"
      />
    </div>
  </section>

  <!-- What we made -->
  <section class="px-6 py-14 md:py-20 max-w-5xl mx-auto">
    <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-3">What we made</p>
    <h2 class="font-display text-3xl md:text-5xl font-bold leading-tight mb-10">Two live activations running in parallel.</h2>

    <div class="space-y-12">
      <div>
        <h3 class="font-display text-2xl md:text-3xl font-bold mb-3">Live mural</h3>
        <p class="text-base md:text-lg text-brand-black leading-relaxed mb-6 max-w-3xl">
          Daniel Toledo (<a href="https://instagram.com/mister_toledo" target="_blank" rel="noopener" class="border-b border-brand-black hover:border-transparent">@mister_toledo</a>) painted on-site through the day, drawing on the Helms District's art-deco and bakery heritage. The finished piece was raffled to one entrant who picked it up the following Sunday.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <img src="/api/images/events/muralprogress1.webp" alt="Mural in progress — early stage" class="w-full aspect-square object-cover rounded-lg" loading="lazy" />
          <img src="/api/images/events/muralprogress2.webp" alt="Mural in progress — later stage" class="w-full aspect-square object-cover rounded-lg" loading="lazy" />
        </div>
      </div>

      <div>
        <h3 class="font-display text-2xl md:text-3xl font-bold mb-3">Live screen-printed shirts</h3>
        <p class="text-base md:text-lg text-brand-black leading-relaxed mb-6 max-w-3xl">
          Ivan and the team at <a href="https://theapparelstudio.com" target="_blank" rel="noopener" class="border-b border-brand-black hover:border-transparent">The Apparel Studio</a> ran a working press for hours, printing 100 limited-edition shirts on demand featuring original artwork by <a href="https://instagram.com/upendo_" target="_blank" rel="noopener" class="border-b border-brand-black hover:border-transparent">@upendo_</a>. Attendees watched their shirts get pulled, one at a time, until the run was gone.
        </p>
        <img src="/api/images/events/live-screen-printing.webp" alt="The Apparel Studio team running a live screen printing press at the event" class="w-full rounded-lg" loading="lazy" />
      </div>

      <div>
        <h3 class="font-display text-2xl md:text-3xl font-bold mb-3">Custom digital infrastructure</h3>
        <p class="text-base md:text-lg text-brand-black leading-relaxed max-w-3xl">
          Bespoke giveaway page, QR-coded entry across asset packaging and signage, edge-cached pages tuned for press traffic, and a real-time admin dashboard for randomized winner selection — all running on infrastructure the franchise owns.
        </p>
      </div>
    </div>
  </section>

  <!-- On the day -->
  <section class="px-6 py-14 md:py-20 max-w-3xl mx-auto">
    <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-3">On the day</p>
    <h2 class="font-display text-3xl md:text-5xl font-bold leading-tight mb-6">The line did not break.</h2>
    <p class="text-lg text-brand-black leading-relaxed mb-5">
      Attendees started lining up at 3 AM. By the time doors opened, the queue stretched the length of the Helms District. The first-500 freebies moved faster than anyone planned for; the prints ran out early, and visitors who'd already received a shirt rejoined the line for a print.
    </p>
    <p class="text-lg text-brand-black leading-relaxed">
      Two live activations ran in parallel — Toledo painting, The Apparel Studio printing — through the entire day. The lines did not break from open to close.
    </p>
  </section>

  <!-- How we handle the data -->
  <section class="px-6 py-14 md:py-20 max-w-3xl mx-auto">
    <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-3">How we handle the data</p>
    <h2 class="font-display text-3xl md:text-5xl font-bold leading-tight mb-6">
      Honest, respectful, transparent.
    </h2>
    <p class="text-lg text-brand-black leading-relaxed mb-5">
      Most experiential marketing exists to convert attendees into leads. Eventbrite RSVPs, Google Forms, Mailchimp pipelines — every interaction designed to extract a contact for ongoing marketing.
    </p>
    <p class="text-lg text-brand-black leading-relaxed mb-5">
      We don't operate that way. <strong>Entry data is collected for the giveaway, used for the giveaway, and deleted after the giveaway concludes.</strong> No list-sharing with partners. No CRM hand-off. No "let's keep them warm for next quarter."
    </p>
    <p class="text-lg text-brand-black leading-relaxed">
      Consumers can tell the difference. An art experience that respects the audience builds the kind of brand trust paid media cannot buy. When attendees know their email isn't going to a marketing pipeline, they engage authentically — and the activation reads as genuine community programming instead of a lead funnel in costume.
    </p>
  </section>

  <!-- Budget -->
  <section class="bg-brand-yellow text-brand-black">
    <div class="px-6 py-14 md:py-20 max-w-3xl mx-auto">
      <p class="font-mono text-[11px] uppercase tracking-widest mb-3">Why the budget allocation matters</p>
      <h2 class="font-display text-3xl md:text-5xl font-bold leading-tight mb-6">
        12.5% of opening spend went to art. Industry average is 3–8%.
      </h2>
      <p class="text-lg leading-relaxed mb-5">
        Roughly 2–4× the industry average, on a franchise budget that's materially tighter than corporate. The thesis: spending the freebie budget on original art instead of branded merch builds first-year customer loyalty in ways a larger ad buy can't.
      </p>
      <p class="text-lg leading-relaxed font-bold">
        601 pieces of original art in 601 Culver City homes — lines from 3 AM to close — and a community walking away with a real cultural artifact instead of a logo tote — is the evidence.
      </p>
    </div>
  </section>

  <!-- What AS does -->
  <section class="px-6 py-14 md:py-20 max-w-3xl mx-auto">
    <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-3">What Artist Safespaces does</p>
    <p class="text-lg text-brand-black leading-relaxed">
      Artist Safespaces curates and operates. We don't paint the mural — we book the muralist. We don't run the IKEA opening — we run the <em>art program at</em> the IKEA opening: assembling the right specialists, designing the on-site flow, and owning the infrastructure that makes it measurable. The brand sees one coherent activation instead of five disconnected vendors.
    </p>
  </section>

  <!-- Collaborators -->
  <section class="px-6 py-14 md:py-20 max-w-3xl mx-auto border-t border-gray-200">
    <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-5">Collaborators</p>
    <ul class="space-y-3 text-base text-brand-black">
      <li><span class="font-mono text-[11px] uppercase tracking-widest text-gray-500">Mural · </span>Daniel Toledo (<a href="https://instagram.com/mister_toledo" target="_blank" rel="noopener" class="border-b border-brand-black hover:border-transparent">@mister_toledo</a>), assisted by Abby Aceves (<a href="https://instagram.com/abby_aceves" target="_blank" rel="noopener" class="border-b border-brand-black hover:border-transparent">@abby_aceves</a>)</li>
      <li><span class="font-mono text-[11px] uppercase tracking-widest text-gray-500">Shirt artwork · </span><a href="https://instagram.com/upendo_" target="_blank" rel="noopener" class="border-b border-brand-black hover:border-transparent">@upendo_</a></li>
      <li><span class="font-mono text-[11px] uppercase tracking-widest text-gray-500">Live screen printing · </span>Ivan and the team at <a href="https://theapparelstudio.com" target="_blank" rel="noopener" class="border-b border-brand-black hover:border-transparent">The Apparel Studio</a></li>
      <li><span class="font-mono text-[11px] uppercase tracking-widest text-gray-500">IKEA · </span>Culver City × Burbank × Costa Mesa teams collaborated on the activation. Artist Safespaces came in via Costa Mesa.</li>
      <li><span class="font-mono text-[11px] uppercase tracking-widest text-gray-500">Curation, infrastructure, and operations · </span>Artist Safespaces</li>
    </ul>
  </section>

  <!-- Press -->
  <section class="px-6 py-14 md:py-20 max-w-3xl mx-auto">
    <p class="font-mono text-[11px] uppercase tracking-widest text-gray-500 mb-5">Press</p>
    <ul class="space-y-3">
      {#each press as p}
        <li>
          <a
            href={p.url}
            target="_blank"
            rel="noopener"
            class="inline-block border-b border-brand-black hover:border-transparent text-base text-brand-black"
          >{p.name}</a>
          {#if p.note}<span class="font-mono text-[11px] text-gray-500 ml-2">— {p.note}</span>{/if}
        </li>
      {/each}
    </ul>
  </section>

  <!-- What's next -->
  <section class="bg-brand-black text-white">
    <div class="px-6 py-14 md:py-20 max-w-3xl mx-auto">
      <p class="font-mono text-[11px] uppercase tracking-widest text-gray-400 mb-3">What's next</p>
      <h2 class="font-display text-3xl md:text-5xl font-bold leading-tight mb-6">
        Booking conversations.
      </h2>
      <p class="text-lg leading-relaxed mb-8">
        The IKEA Culver City activation is a polished version of a model Artist Safespaces has been running for three years at our annual Art Therapy festival. The mechanics travel — local artists who show up with professionalism, freebies as original art instead of branded merch, owned infrastructure that makes the day measurable. Any city, any grand opening, any cultural moment.
      </p>
      <a
        href="/partners/apply"
        class="inline-block px-6 py-3 bg-brand-yellow text-brand-black font-mono text-sm font-bold uppercase tracking-widest rounded hover:opacity-90"
      >Partner With Us</a>
    </div>
  </section>
</article>
