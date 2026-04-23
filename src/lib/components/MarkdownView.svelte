<script lang="ts">
  export let source: string = '';
  export let dark = true;

  function escapeHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderInline(s: string): string {
    let out = escapeHtml(s);
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline hover:text-brand-yellow">$1</a>');
    return out;
  }

  function render(md: string): string {
    const lines = md.split(/\r?\n/);
    const out: string[] = [];
    let inList = false;
    let paragraph: string[] = [];

    const flushParagraph = () => {
      if (paragraph.length) {
        out.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
        paragraph = [];
      }
    };
    const closeList = () => {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
    };

    for (const raw of lines) {
      const line = raw;
      if (/^\s*$/.test(line)) {
        flushParagraph();
        closeList();
        continue;
      }
      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        flushParagraph();
        closeList();
        const level = h[1].length;
        out.push(`<h${level}>${renderInline(h[2])}</h${level}>`);
        continue;
      }
      const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (img) {
        flushParagraph();
        closeList();
        out.push(`<img src="${escapeHtml(img[2])}" alt="${escapeHtml(img[1])}" class="rounded-lg max-w-full my-4" loading="lazy" />`);
        continue;
      }
      const li = line.match(/^\s*[-*]\s+(.*)$/);
      if (li) {
        flushParagraph();
        if (!inList) {
          out.push('<ul>');
          inList = true;
        }
        out.push(`<li>${renderInline(li[1])}</li>`);
        continue;
      }
      paragraph.push(line.trim());
    }
    flushParagraph();
    closeList();
    return out.join('\n');
  }

  $: html = render(source ?? '');
</script>

<div class="prose-md {dark ? 'prose-dark' : 'prose-light'}">
  {@html html}
</div>

<style>
  .prose-md :global(h1) { font-family: var(--font-display); font-size: 1.75rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
  .prose-md :global(h2) { font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 1.25rem 0 0.5rem; }
  .prose-md :global(h3) { font-family: var(--font-display); font-size: 1.15rem; font-weight: 600; margin: 1rem 0 0.4rem; }
  .prose-md :global(p) { margin: 0.5rem 0; line-height: 1.65; }
  .prose-md :global(ul) { margin: 0.5rem 0 0.75rem 1.25rem; list-style: disc; }
  .prose-md :global(li) { margin: 0.25rem 0; line-height: 1.5; }
  .prose-md :global(img) { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1rem 0; }
  .prose-md :global(strong) { font-weight: 700; }
  .prose-md :global(code) { font-family: var(--font-mono); font-size: 0.9em; padding: 0.1em 0.35em; border-radius: 3px; }

  .prose-dark { color: rgba(255,255,255,0.85); }
  .prose-dark :global(h1), .prose-dark :global(h2), .prose-dark :global(h3) { color: white; }
  .prose-dark :global(code) { background: rgba(255,255,255,0.08); color: var(--color-brand-yellow); }

  .prose-light { color: var(--color-brand-black); }
  .prose-light :global(code) { background: #f1f1f1; color: var(--color-brand-black); }
</style>
