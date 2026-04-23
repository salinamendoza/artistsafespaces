<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ images } = data);

  let folder = '';
  let dragOver = false;

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // Group images by folder
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
    <!-- Upload form -->
    <form
      method="POST"
      action="?/upload"
      enctype="multipart/form-data"
      use:enhance
      class="mb-10 border border-gray-200 rounded-lg p-6"
    >
      <h2 class="font-mono text-sm font-bold text-brand-black mb-4">Upload Images</h2>

      <div class="flex gap-3 mb-4">
        <div class="flex-1">
          <label for="folder" class="block font-mono text-[10px] text-gray-500 mb-1">Folder path</label>
          <input
            id="folder"
            type="text"
            name="folder"
            bind:value={folder}
            placeholder="e.g. murals or art-therapy/2025"
            class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-yellow/30"
          />
        </div>
      </div>

      <!-- Drop zone -->
      <label
        class="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          {dragOver ? 'border-brand-yellow bg-brand-yellow/5' : 'border-gray-200 hover:border-gray-300'}"
        on:dragover|preventDefault={() => dragOver = true}
        on:dragleave={() => dragOver = false}
        on:drop|preventDefault={(e) => { dragOver = false; }}
      >
        <input type="file" name="files" accept="image/*" multiple class="hidden" />
        <p class="font-mono text-sm text-gray-500">
          Click to select or drag images here
        </p>
        <p class="font-mono text-[10px] text-gray-300 mt-1">
          WebP, JPG, PNG, GIF, AVIF — max 10 MB each
        </p>
      </label>

      <button
        type="submit"
        class="mt-4 px-5 py-2 bg-brand-yellow text-brand-black font-mono text-sm font-bold rounded-lg hover:bg-brand-yellow/90 transition-colors"
      >
        Upload
      </button>

      {#if form?.error}
        <p class="mt-3 font-mono text-xs text-red-400">{form.error}</p>
      {/if}
      {#if form?.success}
        <p class="mt-3 font-mono text-xs text-green-400">Uploaded successfully!</p>
      {/if}
    </form>

    <!-- Image list -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-mono text-sm font-bold text-brand-black">
          Stored Images <span class="text-gray-400 font-normal">({images.length})</span>
        </h2>
      </div>

      {#if images.length === 0}
        <p class="font-mono text-xs text-gray-400 py-10 text-center">No images uploaded yet.</p>
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
                  <!-- Copy path button -->
                  <button
                    type="button"
                    class="absolute top-1 left-1 px-1.5 py-0.5 bg-black/60 rounded text-[10px] font-mono text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    on:click={() => navigator.clipboard.writeText(`/api/images/${img.key}`)}
                  >
                    copy path
                  </button>
                  <!-- Delete -->
                  <form method="POST" action="?/delete" use:enhance class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <input type="hidden" name="key" value={img.key} />
                    <button
                      type="submit"
                      class="px-1.5 py-0.5 bg-red-500/80 rounded text-[10px] font-mono text-brand-black hover:bg-red-500 transition-colors"
                      on:click|stopPropagation
                    >
                      delete
                    </button>
                  </form>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <!-- Usage hint -->
    <div class="mt-10 border border-gray-100 rounded-lg p-4">
      <h3 class="font-mono text-xs font-bold text-gray-500 mb-2">How to use</h3>
      <p class="font-mono text-[10px] text-gray-400 leading-relaxed">
        Upload images here, then reference them in <code class="text-gray-700">images.ts</code> using the path
        <code class="text-gray-700">/api/images/your-folder/filename.webp</code>.
        Images are served with 30-day caching from Cloudflare R2.
      </p>
    </div>
  </div>
</div>
