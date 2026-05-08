<script lang="ts">
  export let data: { html: string };

  const url = 'https://artistsafespaces.org/standards';
  const title = 'Artist Engagement Standards | Artist Safespaces';
  const description =
    'How Artist Safespaces engages with artists across our programs: compensation, crediting, data handling, and working conditions.';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
</svelte:head>

<article class="mx-auto max-w-3xl px-6 py-16 md:py-24">
  <div class="standards-prose">
    {@html data.html}
  </div>
</article>

<style>
  .standards-prose {
    color: var(--color-brand-black);
    font-family: var(--font-body);
    font-size: 1.0625rem;
    line-height: 1.75;
  }

  .standards-prose :global(h1) {
    font-family: var(--font-display);
    font-size: clamp(2.25rem, 4.5vw, 3rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0 0 2rem;
  }
  .standards-prose :global(h2) {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.01em;
    margin: 3rem 0 1rem;
  }
  .standards-prose :global(h3) {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 600;
    line-height: 1.3;
    margin: 2rem 0 0.75rem;
  }
  .standards-prose :global(h4) {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 600;
    margin: 1.5rem 0 0.5rem;
  }

  .standards-prose :global(p) {
    margin: 0 0 1.25rem;
  }
  .standards-prose :global(ul),
  .standards-prose :global(ol) {
    margin: 0 0 1.5rem 1.25rem;
    padding: 0;
  }
  .standards-prose :global(ul) { list-style: disc; }
  .standards-prose :global(ol) { list-style: decimal; }
  .standards-prose :global(li) {
    margin: 0.4rem 0;
    padding-left: 0.25rem;
  }
  .standards-prose :global(li > p) { margin: 0; }

  .standards-prose :global(a) {
    color: var(--color-brand-black);
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
    text-decoration-color: var(--color-brand-yellow);
    transition: background-color 120ms ease;
  }
  .standards-prose :global(a:hover) {
    background-color: var(--color-brand-yellow);
  }

  .standards-prose :global(strong) { font-weight: 700; }
  .standards-prose :global(em) { font-style: italic; }

  .standards-prose :global(blockquote) {
    margin: 2rem 0;
    padding: 0.25rem 0 0.25rem 1.25rem;
    border-left: 3px solid var(--color-brand-black);
    color: #444;
    font-style: normal;
  }
  .standards-prose :global(blockquote p) { margin: 0.5rem 0; }

  .standards-prose :global(hr) {
    border: 0;
    border-top: 1px solid #e5e5e5;
    margin: 3rem 0;
  }

  .standards-prose :global(code) {
    font-family: var(--font-mono);
    font-size: 0.92em;
    background: #f1f1f1;
    padding: 0.1em 0.35em;
    border-radius: 3px;
  }
</style>
