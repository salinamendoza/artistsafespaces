<script lang="ts">
  import { onDestroy } from 'svelte';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: ({ images } = data);

  const FOLDERS = [
    'headshots/artist',
    'headshots/partner',
    'studios',
    'style',
    'events',
    'visual-sheets',
    'logos',
    'team',
    'murals',
    'community',
    'art-therapy'
  ];

  type Converted = {
    originalName: string;
    originalSize: number;
    webpName: string;
    webpSize: number;
    blobUrl: string;
  };

  let folder = 'headshots/artist';
  let quality = 82;
  let maxDim = 2400;
  let converting = 0;
  let converted: Converted[] = [];
  let dragOver = false;
  let convertError: string | null = null;

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function safeName(filename: string): string {
    const base = filename.replace(/\.[^.]+$/, '');
    const slug = base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return (slug || 'image') + '.webp';
  }

  async function convertOne(file: File): Promise<Converted> {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });

    let { width, height } = bitmap;
    if (maxDim > 0) {
      const longest = Math.max(width, height);
      if (longest > maxDim) {
        const ratio = maxDim / longest;
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality / 100)
    );
    if (!blob) throw new Error('Browser refused to encode WebP');

    return {
      originalName: file.name,
      originalSize: file.size,
      webpName: safeName(file.name),
      webpSize: blob.size,
      blobUrl: URL.createObjectURL(blob)
    };
  }

  async function handleFiles(files: FileList | File[]) {
    convertError = null;
    const list = Array.from(files);
    for (const file of list) {
      converting++;
      try {
        const result = await convertOne(file);
        converted = [...converted, result];
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        convertError = `Couldn’t convert ${file.name}: ${msg}`;
      } finally {
        converting--;
      }
    }
  }

  function onPick(e: Event) {
    const t = e.target as HTMLInputElement;
    if (t.files?.length) handleFiles(t.files);
    t.value = '';
  }

  function onDrop(e: DragEvent) {
    dragOver = false;
    if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
  }

  function clearConverted() {
    converted.forEach((c) => URL.revokeObjectURL(c.blobUrl));
    converted = [];
    convertError = null;
  }

  onDestroy(() => {
    converted.forEach((c) => URL.revokeObjectURL(c.blobUrl));
  });

  $: grouped = images.reduce<Record<string, typeof images>>((acc, img) => {
    const parts = img.key.split('/');
    const folderName = parts.length > 1 ? parts.slice(0, -1).join('/') : '(root)';
    (acc[folderName] ??= []).push(img);
    return acc;
  }, {});
</script>

<svelte:head>
  <title>Image Manager | Admin</title>
</svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="images" />

  <div class="max-w-4xl mx-auto px-6 py-8">
    <!-- Converter -->
    <section class="mb-12">
      <h2 class="font-mono text-sm font-bold text-brand-black mb-2">Convert to WebP</h2>
      <p class="font-mono text-[11px] text-gray-500 leading-relaxed mb-5">
        Drop any image — it’s converted in your browser, nothing is uploaded.
        Download the .webp, drop it into <code class="text-gray-700">static/images/&lt;folder&gt;/</code>,
        commit, push.
      </p>

      <div class="flex flex-wrap gap-4 mb-4">
        <div>
          <label for="cv-folder" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Target folder</label>
          <select
            id="cv-folder"
            bind:value={folder}
            class="font-mono text-xs border border-gray-300 rounded px-2 py-1.5 bg-white"
          >
            {#each FOLDERS as f}<option value={f}>static/images/{f}/</option>{/each}
          </select>
        </div>
        <div>
          <label for="cv-quality" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Quality</label>
          <input
            id="cv-quality"
            type="number"
            min="40"
            max="100"
            bind:value={quality}
            class="font-mono text-xs border border-gray-300 rounded px-2 py-1.5 w-20"
          />
        </div>
        <div>
          <label for="cv-maxdim" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Max edge (px, 0 = none)</label>
          <input
            id="cv-maxdim"
            type="number"
            min="0"
            bind:value={maxDim}
            class="font-mono text-xs border border-gray-300 rounded px-2 py-1.5 w-24"
          />
        </div>
      </div>

      <label
        class="block border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors {dragOver ? 'border-brand-black bg-gray-50' : 'border-gray-300 hover:border-brand-black'}"
        on:dragover|preventDefault={() => (dragOver = true)}
        on:dragleave={() => (dragOver = false)}
        on:drop|preventDefault={onDrop}
      >
        <input type="file" accept="image/*" multiple class="hidden" on:change={onPick} />
        <p class="font-mono text-xs text-gray-600">
          {#if converting > 0}
            Converting {converting}…
          {:else}
            Drop images here, or click to pick
          {/if}
        </p>
      </label>

      {#if convertError}
        <p class="mt-3 font-mono text-[11px] text-red-500">{convertError}</p>
      {/if}

      {#if converted.length > 0}
        <div class="mt-5 space-y-2">
          {#each converted as c (c.blobUrl)}
            <div class="flex items-center gap-3 border border-gray-200 rounded p-2">
              <img src={c.blobUrl} alt={c.webpName} class="w-14 h-14 object-cover rounded flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="font-mono text-[11px] text-brand-black truncate">{c.webpName}</p>
                <p class="font-mono text-[10px] text-gray-500">
                  {formatSize(c.originalSize)} → {formatSize(c.webpSize)}
                  {#if c.webpSize < c.originalSize}
                    <span class="text-gray-400">({Math.round((1 - c.webpSize / c.originalSize) * 100)}% smaller)</span>
                  {/if}
                </p>
                <p class="font-mono text-[10px] text-gray-400 truncate">static/images/{folder}/{c.webpName}</p>
              </div>
              <a
                href={c.blobUrl}
                download={c.webpName}
                class="px-3 py-1.5 bg-brand-yellow text-brand-black font-mono text-[11px] font-bold uppercase tracking-widest rounded hover:opacity-90"
              >Download</a>
            </div>
          {/each}
          <button
            type="button"
            on:click={clearConverted}
            class="font-mono text-[11px] text-gray-500 underline hover:text-brand-black mt-1"
          >clear list</button>
        </div>
      {/if}
    </section>

    <!-- Existing images -->
    <section>
      <h2 class="font-mono text-sm font-bold text-brand-black mb-2">
        Stored Images <span class="text-gray-400 font-normal">({images.length})</span>
      </h2>
      <p class="font-mono text-[11px] text-gray-500 leading-relaxed mb-6">
        Already in <code class="text-gray-700">static/images/</code>. Click a file to copy its path.
      </p>

      {#if images.length === 0}
        <p class="font-mono text-xs text-gray-400 py-10 text-center">No images yet.</p>
      {:else}
        {#each Object.entries(grouped) as [folderName, folderImages]}
          <div class="mb-6">
            <h3 class="font-mono text-xs text-gray-700 font-semibold mb-2">{folderName}/</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {#each folderImages as img (img.key)}
                <div class="group relative bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src="/images/{img.key}"
                    alt={img.key}
                    class="w-full aspect-square object-cover"
                    loading="lazy"
                  />
                  <div class="p-2">
                    <p class="font-mono text-[10px] text-gray-500 truncate">{img.key.split('/').pop()}</p>
                    <p class="font-mono text-[10px] text-gray-400">{formatSize(img.size)}</p>
                  </div>
                  <button
                    type="button"
                    class="absolute top-1 left-1 px-2 py-0.5 bg-brand-yellow text-brand-black font-bold rounded text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                    on:click={() => navigator.clipboard.writeText(`/images/${img.key}`)}
                  >
                    copy path
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      {/if}
    </section>
  </div>
</div>
