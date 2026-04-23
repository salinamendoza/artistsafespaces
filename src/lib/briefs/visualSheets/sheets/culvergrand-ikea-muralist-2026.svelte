<script lang="ts">
  const Y = '#F2D547';
  const K = '#1a1a1a';

  type IconRef = { cat: string; title: string; note: string; svg: string };

  const refs: IconRef[] = [
    {
      cat: 'The Building · 1931',
      title: 'Helms Bakery Tower',
      note: "The Streamline Moderne tower — the hero of IKEA's own campaign visuals. Stepped chevron geometry, Olympic medallions visible on the facade, sans-serif Deco rooftop signage. Cream limestone exterior preserved (not painted IKEA blue).",
      svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="${Y}"/>
        <rect x="35" y="12" width="30" height="44" fill="${K}"/>
        <rect x="35" y="12" width="30" height="3" fill="${Y}"/>
        <rect x="35" y="17" width="30" height="2" fill="${Y}"/>
        <rect x="35" y="21" width="30" height="1" fill="${Y}"/>
        <rect x="40" y="26" width="6" height="8" fill="${Y}"/>
        <rect x="54" y="26" width="6" height="8" fill="${Y}"/>
        <circle cx="43" cy="42" r="3" fill="none" stroke="${Y}" stroke-width="0.8"/>
        <circle cx="57" cy="42" r="3" fill="none" stroke="${Y}" stroke-width="0.8"/>
        <rect x="42" y="49" width="16" height="7" fill="${Y}"/>
        <rect x="48" y="2" width="4" height="10" fill="${K}"/>
        <rect x="44" y="0" width="12" height="3" fill="${K}"/>
      </svg>`
    },
    {
      cat: 'IKEA · 2026',
      title: 'Out of the Box',
      note: "IKEA's campaign motif: the Helms building emerging from a cardboard box. You don't have to draw a literal box — but the print should feel like it could sit next to that invite without explanation.",
      svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="${Y}"/>
        <polygon points="20,55 80,55 75,28 25,28" fill="${K}"/>
        <polygon points="25,28 45,18 55,18 75,28" fill="none" stroke="${K}" stroke-width="1"/>
        <polygon points="25,28 22,22 30,16 45,18" fill="${K}" opacity="0.7"/>
        <polygon points="75,28 78,22 70,16 55,18" fill="${K}" opacity="0.7"/>
        <rect x="42" y="14" width="16" height="20" fill="${Y}"/>
        <rect x="42" y="14" width="16" height="2" fill="${K}"/>
        <rect x="46" y="20" width="3" height="4" fill="${K}"/>
        <rect x="51" y="20" width="3" height="4" fill="${K}"/>
        <rect x="48" y="2" width="4" height="12" fill="${K}"/>
        <rect x="44" y="0" width="12" height="3" fill="${K}"/>
        <text x="50" y="48" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="bold" fill="${Y}">IKEA</text>
      </svg>`
    },
    {
      cat: 'Helms · 1931–1969',
      title: 'The Helms Coach',
      note: 'Helms’ delivery van. Paul Helms refused the word "truck" — "garbage is delivered in trucks." Over 1,000 of them at peak, serving Fresno to San Diego.',
      svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="${Y}"/>
        <rect x="8" y="18" width="78" height="28" rx="4" fill="${K}"/>
        <rect x="14" y="22" width="14" height="8" fill="${Y}"/>
        <rect x="32" y="22" width="14" height="8" fill="${Y}"/>
        <rect x="50" y="22" width="14" height="8" fill="${Y}"/>
        <rect x="68" y="22" width="14" height="8" fill="${Y}"/>
        <circle cx="22" cy="48" r="6" fill="${K}"/>
        <circle cx="22" cy="48" r="2.5" fill="${Y}"/>
        <circle cx="72" cy="48" r="6" fill="${K}"/>
        <circle cx="72" cy="48" r="2.5" fill="${Y}"/>
        <text x="47" y="40" text-anchor="middle" font-family="serif" font-size="5" font-weight="bold" fill="${Y}">HELMS</text>
      </svg>`
    },
    {
      cat: 'Helms · 1931–1969',
      title: 'The "H" Placard',
      note: 'Customers placed this in their front window so the Helmsman knew to stop. A small graphic that said "this is my home, come in." A near-perfect minimal symbol on its own.',
      svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="${Y}"/>
        <rect x="30" y="10" width="40" height="40" fill="${K}"/>
        <rect x="32" y="12" width="36" height="36" fill="none" stroke="${Y}" stroke-width="0.5"/>
        <text x="50" y="38" text-anchor="middle" font-family="serif" font-size="28" font-weight="bold" fill="${Y}">H</text>
      </svg>`
    },
    {
      cat: 'Helms · 1931–1969',
      title: 'The Whistle',
      note: 'Drivers blew a distinctive toot-toot arriving in each neighborhood. The audio cue every kid in mid-century LA knew. Sound waves are fair game.',
      svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="${Y}"/>
        <circle cx="25" cy="30" r="8" fill="${K}"/>
        <circle cx="25" cy="30" r="3" fill="${Y}"/>
        <path d="M 38 30 Q 50 22, 62 30" stroke="${K}" stroke-width="1.5" fill="none"/>
        <path d="M 38 30 Q 52 18, 70 30" stroke="${K}" stroke-width="1.5" fill="none"/>
        <path d="M 38 30 Q 54 14, 78 30" stroke="${K}" stroke-width="1.5" fill="none"/>
        <path d="M 38 30 Q 50 38, 62 30" stroke="${K}" stroke-width="1.5" fill="none"/>
        <path d="M 38 30 Q 52 42, 70 30" stroke="${K}" stroke-width="1.5" fill="none"/>
        <path d="M 38 30 Q 54 46, 78 30" stroke="${K}" stroke-width="1.5" fill="none"/>
      </svg>`
    },
    {
      cat: 'Helms · 1932',
      title: 'The Olympic Rings',
      note: "Helms was official bread of the 1932 LA Olympics. Rings still carved into the building's medallions today. Use with awareness — there's an IP fight in this history, but the building references are grandfathered.",
      svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="${Y}"/>
        <circle cx="28" cy="25" r="9" fill="none" stroke="${K}" stroke-width="2"/>
        <circle cx="42" cy="25" r="9" fill="none" stroke="${K}" stroke-width="2"/>
        <circle cx="56" cy="25" r="9" fill="none" stroke="${K}" stroke-width="2"/>
        <circle cx="35" cy="35" r="9" fill="none" stroke="${K}" stroke-width="2"/>
        <circle cx="49" cy="35" r="9" fill="none" stroke="${K}" stroke-width="2"/>
        <text x="50" y="53" text-anchor="middle" font-family="serif" font-size="4" fill="${K}">OLYMPIC GAMES BAKERS</text>
      </svg>`
    },
    {
      cat: 'Helms · 1969',
      title: 'First Bread on the Moon',
      note: 'Helms supplied bread to Apollo 11, weeks before the bakery closed forever. Bread → Earth → Moon is yours if you want it.',
      svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="${Y}"/>
        <circle cx="70" cy="22" r="14" fill="${K}"/>
        <circle cx="66" cy="18" r="2" fill="${Y}"/>
        <circle cx="74" cy="24" r="1.5" fill="${Y}"/>
        <circle cx="70" cy="28" r="1" fill="${Y}"/>
        <ellipse cx="30" cy="42" rx="18" ry="8" fill="${K}"/>
        <path d="M 14 42 Q 18 36, 22 42 M 22 42 Q 26 36, 30 42 M 30 42 Q 34 36, 38 42 M 38 42 Q 42 36, 46 42" stroke="${Y}" stroke-width="0.8" fill="none"/>
        <path d="M 45 38 Q 56 28, 60 24" stroke="${K}" stroke-width="0.8" stroke-dasharray="2,2" fill="none"/>
      </svg>`
    },
    {
      cat: 'Architecture · 1930',
      title: 'Zig-Zag Moderne',
      note: 'The architectural vocabulary: chevrons, stepped geometry, horizontal speed lines, soft curves on hard corners. The building exterior was deliberately preserved — not painted IKEA blue.',
      svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="${Y}"/>
        <polygon points="10,10 18,10 22,18 14,18" fill="${K}"/>
        <polygon points="22,18 30,18 34,26 26,26" fill="${K}"/>
        <polygon points="34,26 42,26 46,34 38,34" fill="${K}"/>
        <polygon points="46,34 54,34 58,42 50,42" fill="${K}"/>
        <polygon points="58,42 66,42 70,50 62,50" fill="${K}"/>
        <line x1="10" y1="22" x2="90" y2="22" stroke="${K}" stroke-width="0.5"/>
        <line x1="10" y1="26" x2="90" y2="26" stroke="${K}" stroke-width="0.5"/>
        <line x1="10" y1="44" x2="90" y2="44" stroke="${K}" stroke-width="0.5"/>
        <line x1="10" y1="48" x2="90" y2="48" stroke="${K}" stroke-width="0.5"/>
      </svg>`
    },
    {
      cat: 'Screenland · 1915–present',
      title: 'MGM Colonnade',
      note: 'The white columns at Washington Blvd, in place since 1915, still standing at Sony Pictures Studios. Walking distance from the IKEA store. Culver City has been "Heart of Screenland" since 1936.',
      svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="${Y}"/>
        <rect x="5" y="10" width="90" height="4" fill="${K}"/>
        <rect x="10" y="14" width="6" height="36" fill="${K}"/>
        <rect x="25" y="14" width="6" height="36" fill="${K}"/>
        <rect x="40" y="14" width="6" height="36" fill="${K}"/>
        <rect x="55" y="14" width="6" height="36" fill="${K}"/>
        <rect x="70" y="14" width="6" height="36" fill="${K}"/>
        <rect x="85" y="14" width="6" height="36" fill="${K}"/>
        <rect x="5" y="50" width="90" height="3" fill="${K}"/>
      </svg>`
    },
    {
      cat: 'Land · pre-freeway',
      title: 'Pacific Electric Red Car',
      note: "Streetcars served this exact corner before the freeways. The Metro E Line now stops at Culver City Station, a short walk away. Transit threads through this place's history.",
      svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="60" fill="${Y}"/>
        <rect x="10" y="22" width="75" height="22" fill="${K}"/>
        <rect x="14" y="28" width="10" height="10" fill="${Y}"/>
        <rect x="28" y="28" width="10" height="10" fill="${Y}"/>
        <rect x="42" y="28" width="10" height="10" fill="${Y}"/>
        <rect x="56" y="28" width="10" height="10" fill="${Y}"/>
        <rect x="70" y="28" width="10" height="10" fill="${Y}"/>
        <line x1="50" y1="22" x2="50" y2="10" stroke="${K}" stroke-width="0.8"/>
        <line x1="5" y1="50" x2="95" y2="50" stroke="${K}" stroke-width="0.5"/>
        <line x1="5" y1="53" x2="95" y2="53" stroke="${K}" stroke-width="0.5"/>
        <circle cx="22" cy="46" r="3" fill="${K}"/>
        <circle cx="72" cy="46" r="3" fill="${K}"/>
      </svg>`
    }
  ];

  let modalOpen = false;
  let activeIdx = 0;

  function openModal(i: number) {
    activeIdx = i;
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && modalOpen) closeModal();
  }
</script>

<svelte:window on:keydown={onKeydown} />

<div class="muralist-root">
  <div class="sheet">
    <header class="hero">
      <svg class="hero-deco deco-1" width="60" height="20" viewBox="0 0 60 20" fill="none">
        <path d="M2 10 Q 15 2, 30 10 T 58 10" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
      </svg>
      <svg class="hero-deco deco-2" width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M5 35 L 35 5" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
        <path d="M5 5 L 35 35" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
      </svg>
      <svg class="hero-deco deco-3" width="80" height="14" viewBox="0 0 80 14" fill="none">
        <circle cx="7" cy="7" r="4" fill="#1a1a1a"/>
        <circle cx="27" cy="7" r="4" fill="#1a1a1a"/>
        <circle cx="47" cy="7" r="4" fill="#1a1a1a"/>
        <circle cx="67" cy="7" r="4" fill="#1a1a1a"/>
      </svg>
      <svg class="hero-deco deco-4" width="50" height="50" viewBox="0 0 50 50" fill="none">
        <path d="M25 5 L 25 45 M5 25 L 45 25" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
      </svg>

      <div class="hero-meta">
        <span class="tag">Brief Visual Reference</span>
        <span class="tag-divider">·</span>
        <span>IKEA Culver City Grand Opening · May 2, 2026</span>
      </div>

      <p class="hero-tagline">"Out of the box. Into the city."</p>
      <h1>The Helms Bakery is the building. Paint it into the present.</h1>
      <p class="hero-lede">
        Source material for the IKEA Culver City grand opening live mural commission.
        One mural, your full palette, your style. Pull from what fits. Skip what doesn't.
      </p>
    </header>

    <div class="specs-bar">
      <div class="spec-item">
        <div class="spec-label">Medium</div>
        <div class="spec-value">Live mural</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Surface</div>
        <div class="spec-value">Plywood panel</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Size</div>
        <div class="spec-value">8 × 8 ft</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Duration</div>
        <div class="spec-value">5 hrs live</div>
      </div>
      <div class="spec-item">
        <div class="spec-label">Event date</div>
        <div class="spec-value">May 2, 2026</div>
      </div>
    </div>

    <section class="block">
      <div class="block-label">
        <span class="block-num">01</span>
        <span class="block-name">Palette — your full range</span>
      </div>
      <div class="full-palette-callout">
        <h3>Your full palette</h3>
        <p>
          Unlike the screen print commission, this mural has <strong>no color limitation</strong>. Bring your full range. The historical Helms yellow + navy two-tone shown in the iconography below is reference material for the building's history — not a constraint on your palette. Paint as you paint.
        </p>
      </div>
    </section>

    <section class="block">
      <div class="block-label">
        <span class="block-num">02</span>
        <span class="block-name">Iconography library — pull what fits your style</span>
      </div>
      <div class="icon-grid">
        {#each refs as r, i (i)}
          <button class="icon-card" type="button" on:click={() => openModal(i)}>
            <div class="icon-svg">{@html r.svg}</div>
            <div>
              <div class="icon-cat">{r.cat}</div>
              <div class="icon-title">{r.title}</div>
            </div>
          </button>
        {/each}
      </div>
    </section>

    <section class="block">
      <div class="block-label">
        <span class="block-num">03</span>
        <span class="block-name">Do / Don't</span>
      </div>
      <div class="dodont">
        <div class="dodont-col do">
          <div class="dodont-head">DO</div>
          <ul>
            <li>Make it unmistakably <em>your</em> work</li>
            <li>Treat the location as the subject, IKEA as the host</li>
            <li>Echo "Out of the box. Into the city." — something arriving, opening, assembling</li>
            <li>Lean into the Helms history if it fits — building, Olympics, moon, whistle</li>
            <li>Bring your full palette — no color constraints on this piece</li>
          </ul>
        </div>
        <div class="dodont-col dont">
          <div class="dodont-head">DON'T</div>
          <ul>
            <li>Default to literal IKEA furniture line drawings</li>
            <li>Do generic Scandinavian flat-pack moodboard</li>
            <li>Use generic LA shorthand (palm trees, Hollywood sign, sunsets)</li>
            <li>Treat the iconography below as a checklist — pick what fits your voice</li>
            <li>Contact IKEA directly. Route through your AS booking contact.</li>
          </ul>
        </div>
      </div>
    </section>
  </div>

  {#if modalOpen}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div class="modal-bg" on:click|self={closeModal} role="dialog" aria-modal="true" aria-labelledby="muralist-modal-title">
      <div class="modal">
        <button class="modal-close" type="button" on:click={closeModal} aria-label="Close">×</button>
        <div class="modal-cat">{refs[activeIdx].cat}</div>
        <h3 id="muralist-modal-title">{refs[activeIdx].title}</h3>
        <p>{refs[activeIdx].note}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@500;600;700;800&display=swap');

  .muralist-root {
    --ink: #1a1a1a;
    --paper: #ffffff;
    --paper-warm: #faf8f0;
    --yellow: #F2D547;
    --yellow-soft: #F8E68A;
    --mono: 'DM Mono', ui-monospace, monospace;
    --display: 'Syne', system-ui, sans-serif;
    font-family: var(--mono);
  }

  .muralist-root,
  .muralist-root *,
  .muralist-root *::before,
  .muralist-root *::after { box-sizing: border-box; }

  .muralist-root .sheet {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--mono);
    border: 1.5px solid var(--ink);
    position: relative;
    overflow: hidden;
  }

  /* ============ HERO ============ */
  .muralist-root .hero {
    background: var(--yellow);
    color: var(--ink);
    padding: 3rem 2.5rem 2.5rem;
    position: relative;
    border-bottom: 1.5px solid var(--ink);
    overflow: hidden;
  }

  .muralist-root .hero-meta {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    font-family: var(--mono);
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 2;
  }

  .muralist-root .tag {
    background: var(--ink);
    color: var(--yellow);
    padding: 0.3rem 0.7rem;
  }

  .muralist-root .tag-divider { opacity: 0.5; }

  .muralist-root .hero h1 {
    font-family: var(--display);
    font-size: clamp(2.8rem, 7vw, 5rem);
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 0.92;
    margin: 0 0 1.5rem 0;
    max-width: 800px;
    position: relative;
    z-index: 2;
  }

  .muralist-root .hero-tagline {
    font-family: var(--display);
    font-size: 1.4rem;
    font-weight: 600;
    font-style: italic;
    margin: 0 0 1rem 0;
    position: relative;
    z-index: 2;
  }

  .muralist-root .hero-lede {
    font-family: var(--mono);
    font-size: 0.95rem;
    line-height: 1.55;
    max-width: 520px;
    margin: 0;
    position: relative;
    z-index: 2;
  }

  .muralist-root .hero-deco {
    position: absolute;
    pointer-events: none;
  }
  .muralist-root .deco-1 { top: 1.5rem; right: 4rem; }
  .muralist-root .deco-2 { top: 6rem; right: 2rem; }
  .muralist-root .deco-3 { bottom: 2rem; right: 8rem; }
  .muralist-root .deco-4 { bottom: 4rem; right: 1.5rem; }

  /* ============ BLOCKS ============ */
  .muralist-root .block {
    padding: 2.5rem;
    border-bottom: 1.5px solid var(--ink);
    position: relative;
  }

  .muralist-root .block:last-child { border-bottom: none; }

  .muralist-root .block-label {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 1.75rem;
    font-family: var(--mono);
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .muralist-root .block-num {
    font-family: var(--display);
    font-size: 1.8rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
    background: var(--ink);
    color: var(--yellow);
    padding: 0.25rem 0.6rem;
  }

  .muralist-root .block-name {
    font-weight: 500;
    flex: 1;
    border-bottom: 1px dashed var(--ink);
    padding-bottom: 0.4rem;
  }

  /* ============ FULL PALETTE CALLOUT ============ */
  .muralist-root .full-palette-callout {
    background: var(--yellow);
    border: 1.5px solid var(--ink);
    padding: 2rem 2.25rem;
    color: var(--ink);
  }

  .muralist-root .full-palette-callout h3 {
    font-family: var(--display);
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 0.75rem 0;
    line-height: 1;
  }

  .muralist-root .full-palette-callout p {
    font-family: var(--mono);
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0;
  }

  .muralist-root .full-palette-callout strong {
    font-weight: 500;
    background: var(--ink);
    color: var(--yellow);
    padding: 0.05rem 0.4rem;
  }

  /* ============ ICON GRID ============ */
  .muralist-root .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    border-left: 1.5px solid var(--ink);
    border-top: 1.5px solid var(--ink);
  }

  .muralist-root .icon-card {
    background: var(--paper);
    border: none;
    border-right: 1.5px solid var(--ink);
    border-bottom: 1.5px solid var(--ink);
    padding: 1.25rem;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    color: inherit;
    transition: background 0.15s;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .muralist-root .icon-card:hover { background: var(--yellow); }

  .muralist-root .icon-svg {
    aspect-ratio: 100 / 60;
    background: var(--paper-warm);
    border: 1.5px solid var(--ink);
    overflow: hidden;
  }

  .muralist-root .icon-svg :global(svg) { width: 100%; height: 100%; display: block; }

  .muralist-root .icon-cat {
    font-family: var(--mono);
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.6;
  }

  .muralist-root .icon-title {
    font-family: var(--display);
    font-size: 1.05rem;
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  /* ============ DO/DON'T ============ */
  .muralist-root .dodont {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1.5px solid var(--ink);
  }

  @media (max-width: 640px) {
    .muralist-root .dodont { grid-template-columns: 1fr; }
    .muralist-root .dodont-col.do { border-right: none; border-bottom: 1.5px solid var(--ink); }
  }

  .muralist-root .dodont-col { padding: 1.5rem; }

  .muralist-root .dodont-col.do {
    background: var(--yellow);
    color: var(--ink);
    border-right: 1.5px solid var(--ink);
  }

  .muralist-root .dodont-col.dont {
    background: var(--ink);
    color: var(--paper);
  }

  .muralist-root .dodont-head {
    font-family: var(--display);
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid currentColor;
  }

  .muralist-root .dodont-col ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .muralist-root .dodont-col li {
    font-size: 0.88rem;
    line-height: 1.5;
    padding-left: 1.5rem;
    position: relative;
  }

  .muralist-root .dodont-col.do li::before {
    content: '✓';
    position: absolute;
    left: 0;
    font-weight: 700;
  }

  .muralist-root .dodont-col.dont li::before {
    content: '✕';
    position: absolute;
    left: 0;
    font-weight: 700;
    color: var(--yellow);
  }

  .muralist-root em { font-style: italic; }

  /* ============ SPECS BAR ============ */
  .muralist-root .specs-bar {
    background: var(--ink);
    color: var(--yellow);
    padding: 1.25rem 2.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 2.5rem;
    font-family: var(--mono);
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .muralist-root .spec-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .muralist-root .spec-label { opacity: 0.55; font-size: 0.65rem; }
  .muralist-root .spec-value { font-family: var(--display); font-size: 1.05rem; font-weight: 600; letter-spacing: -0.01em; text-transform: none; }

  /* ============ MODAL ============ */
  .muralist-root .modal-bg {
    position: fixed;
    inset: 0;
    background: rgba(26, 26, 26, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 1rem;
  }

  .muralist-root .modal {
    background: var(--paper);
    border: 2px solid var(--ink);
    max-width: 520px;
    padding: 2rem;
    position: relative;
  }

  .muralist-root .modal-close {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    color: var(--ink);
    line-height: 1;
    padding: 0.25rem;
  }

  .muralist-root .modal-cat {
    font-family: var(--mono);
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.6;
    margin-bottom: 0.5rem;
  }

  .muralist-root .modal h3 {
    font-family: var(--display);
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    letter-spacing: -0.02em;
  }

  .muralist-root .modal p {
    font-family: var(--mono);
    font-size: 0.88rem;
    line-height: 1.6;
    margin: 0;
  }
</style>
