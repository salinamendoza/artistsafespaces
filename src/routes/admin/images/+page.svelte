<script lang="ts">
  import { onDestroy } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  $: ({ images, r2Available } = data);

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

  type Job = {
    id: string;
    originalName: string;
    originalSize: number;
    webpName: string;
    webpSize: number;
    blobUrl: string;
    key: string;
    status: 'converting' | 'uploading' | 'done' | 'error';
    error?: string;
  };

  let folder = 'headshots/artist';
  let quality = 82;
  let maxDim = 2400;
  let jobs: Job[] = [];
  let dragOver = false;
  let copiedKey: string | null = null;

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function safeName(filename: string): string {
    const base = filename.replace(/\.[^.]+$/, '');
    const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return (slug || 'image') + '.webp';
  }

  function uniqueId(): string {
    return Math.random().toString(36).slice(2, 10);
  }

  function patchJob(id: string, patch: Partial<Job>) {
    jobs = jobs.map((j) => (j.id === id ? { ...j, ...patch } : j));
  }

  async function processFile(file: File) {
    const id = uniqueId();
    const webpName = safeName(file.name);
    const job: Job = {
      id,
      originalName: file.name,
      originalSize: file.size,
      webpName,
      webpSize: 0,
      blobUrl: '',
      key: `${folder}/${webpName}`,
      status: 'converting'
    };
    jobs = [...jobs, job];

    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      let { width, height } = bitmap;
      if (maxDim > 0 && Math.max(width, height) > maxDim) {
        const ratio = maxDim / Math.max(width, height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, 'image/webp', quality / 100)
      );
      if (!blob) throw new Error('Browser refused to encode WebP');

      const blobUrl = URL.createObjectURL(blob);
      patchJob(id, { webpSize: blob.size, blobUrl, status: 'uploading' });

      const fd = new FormData();
      fd.append('kind', 'upload');
      fd.append('key', job.key);
      fd.append('file', blob, webpName);

      const res = await fetch('/admin/images/api', { method: 'POST', body: fd });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text.slice(0, 200) || `HTTP ${res.status}`);
      }

      patchJob(id, { status: 'done' });
      await invalidateAll();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      patchJob(id, { status: 'error', error: msg });
    }
  }

  function handleFiles(files: FileList | File[]) {
    for (const file of Array.from(files)) {
      processFile(file);
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

  function clearJobs() {
    jobs.forEach((j) => j.blobUrl && URL.revokeObjectURL(j.blobUrl));
    jobs = [];
  }

  async function deleteImage(key: string) {
    if (!confirm(`Delete ${key}? This can't be undone.`)) return;
    const fd = new FormData();
    fd.append('kind', 'delete');
    fd.append('key', key);
    const res = await fetch('/admin/images/api', { method: 'POST', body: fd });
    if (res.ok) await invalidateAll();
    else alert(`Delete failed: HTTP ${res.status}`);
  }

  function copyPath(key: string) {
    const path = `/api/images/${key}`;
    navigator.clipboard.writeText(path);
    copiedKey = key;
    setTimeout(() => {
      if (copiedKey === key) copiedKey = null;
    }, 1500);
  }

  onDestroy(() => {
    jobs.forEach((j) => j.blobUrl && URL.revokeObjectURL(j.blobUrl));
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
    {#if !r2Available}
      <p class="mb-6 font-mono text-xs text-red-600">Image storage (R2) is not bound in this environment. Uploads will fail.</p>
    {/if}

    <!-- Upload + convert -->
    <section class="mb-12">
      <h2 class="font-mono text-sm font-bold text-brand-black mb-2">Upload image</h2>
      <p class="font-mono text-[11px] text-gray-500 leading-relaxed mb-5">
        Drop any image — it’s converted to WebP in your browser, then uploaded.
        Available immediately at <code class="text-gray-700">/api/images/&lt;folder&gt;/&lt;name&gt;.webp</code>.
        No commit, no deploy.
      </p>

      <div class="flex flex-wrap gap-4 mb-4">
        <div>
          <label for="cv-folder" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Folder</label>
          <select
            id="cv-folder"
            bind:value={folder}
            class="font-mono text-xs border border-gray-300 rounded px-2 py-1.5 bg-white"
          >
            {#each FOLDERS as f}<option value={f}>{f}</option>{/each}
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
        <p class="font-mono text-xs text-gray-600">Drop images here, or click to pick</p>
      </label>

      {#if jobs.length > 0}
        <div class="mt-5 space-y-2">
          {#each jobs as job (job.id)}
            <div class="flex items-center gap-3 border border-gray-200 rounded p-2">
              {#if job.blobUrl}
                <img src={job.blobUrl} alt={job.webpName} class="w-14 h-14 object-cover rounded flex-shrink-0" />
              {:else}
                <div class="w-14 h-14 bg-gray-100 rounded flex-shrink-0"></div>
              {/if}
              <div class="flex-1 min-w-0">
                <p class="font-mono text-[11px] text-brand-black truncate">{job.webpName}</p>
                {#if job.webpSize > 0}
                  <p class="font-mono text-[10px] text-gray-500">
                    {formatSize(job.originalSize)} → {formatSize(job.webpSize)}
                    {#if job.webpSize < job.originalSize}
                      <span class="text-gray-400">({Math.round((1 - job.webpSize / job.originalSize) * 100)}% smaller)</span>
                    {/if}
                  </p>
                {/if}
                <p class="font-mono text-[10px] text-gray-400 truncate">/api/images/{job.key}</p>
              </div>
              <div class="flex-shrink-0">
                {#if job.status === 'converting'}
                  <span class="font-mono text-[10px] uppercase tracking-widest text-gray-500">Converting…</span>
                {:else if job.status === 'uploading'}
                  <span class="font-mono text-[10px] uppercase tracking-widest text-gray-500">Uploading…</span>
                {:else if job.status === 'done'}
                  <button
                    type="button"
                    on:click={() => copyPath(job.key)}
                    class="px-3 py-1.5 bg-brand-yellow text-brand-black font-mono text-[11px] font-bold uppercase tracking-widest rounded hover:opacity-90"
                  >{copiedKey === job.key ? 'Copied' : 'Copy URL'}</button>
                {:else if job.status === 'error'}
                  <span class="font-mono text-[10px] text-red-500">{job.error}</span>
                {/if}
              </div>
            </div>
          {/each}
          <button
            type="button"
            on:click={clearJobs}
            class="font-mono text-[11px] text-gray-500 underline hover:text-brand-black mt-1"
          >clear list</button>
        </div>
      {/if}
    </section>

    <!-- Stored -->
    <section>
      <h2 class="font-mono text-sm font-bold text-brand-black mb-2">
        Stored Images <span class="text-gray-400 font-normal">({images.length})</span>
      </h2>
      <p class="font-mono text-[11px] text-gray-500 leading-relaxed mb-6">
        Live from R2. Click an image to copy its URL.
      </p>

      {#if images.length === 0}
        <p class="font-mono text-xs text-gray-400 py-10 text-center">No images yet — upload one above.</p>
      {:else}
        {#each Object.entries(grouped) as [folderName, folderImages]}
          <div class="mb-6">
            <h3 class="font-mono text-xs text-gray-700 font-semibold mb-2">{folderName}/</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {#each folderImages as img (img.key)}
                <div class="group relative bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src="/api/images/{img.key}"
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
                    on:click={() => copyPath(img.key)}
                  >{copiedKey === img.key ? 'copied' : 'copy URL'}</button>
                  <button
                    type="button"
                    class="absolute top-1 right-1 px-2 py-0.5 bg-white text-red-600 border border-red-200 font-bold rounded text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    on:click={() => deleteImage(img.key)}
                  >delete</button>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      {/if}
    </section>
  </div>
</div>
