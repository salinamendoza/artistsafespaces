import source from '$lib/content/artist-engagement-standards.md?raw';

export const prerender = true;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInline(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, href) => {
    const safeHref = href.replace(/"/g, '&quot;');
    return `<a href="${safeHref}">${text}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  return out;
}

function renderMarkdown(md: string): string {
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let para: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let inBlockquote = false;

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${renderInline(para.join(' '))}</p>`);
      para = [];
    }
  };
  const closeList = () => {
    if (listType) {
      out.push(`</${listType}>`);
      listType = null;
    }
  };
  const closeBlockquote = () => {
    if (inBlockquote) {
      out.push('</blockquote>');
      inBlockquote = false;
    }
  };

  for (const raw of lines) {
    if (/^\s*$/.test(raw)) {
      flushPara();
      closeList();
      closeBlockquote();
      continue;
    }

    const heading = raw.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushPara();
      closeList();
      closeBlockquote();
      const level = heading[1].length;
      out.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const hr = raw.match(/^\s*(?:-{3,}|_{3,}|\*{3,})\s*$/);
    if (hr) {
      flushPara();
      closeList();
      closeBlockquote();
      out.push('<hr />');
      continue;
    }

    const bq = raw.match(/^>\s?(.*)$/);
    if (bq) {
      flushPara();
      closeList();
      if (!inBlockquote) {
        out.push('<blockquote>');
        inBlockquote = true;
      }
      out.push(`<p>${renderInline(bq[1])}</p>`);
      continue;
    }

    const ul = raw.match(/^\s*[-*]\s+(.*)$/);
    const ol = raw.match(/^\s*\d+\.\s+(.*)$/);
    if (ul || ol) {
      flushPara();
      closeBlockquote();
      const want: 'ul' | 'ol' = ul ? 'ul' : 'ol';
      if (listType && listType !== want) closeList();
      if (!listType) {
        out.push(`<${want}>`);
        listType = want;
      }
      out.push(`<li>${renderInline((ul || ol)![1])}</li>`);
      continue;
    }

    closeList();
    closeBlockquote();
    para.push(raw.trim());
  }

  flushPara();
  closeList();
  closeBlockquote();
  return out.join('\n');
}

export function load() {
  return {
    html: renderMarkdown(source)
  };
}
