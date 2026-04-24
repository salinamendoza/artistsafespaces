<script lang="ts">
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: ({ images } = data);

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

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
    <div class="mb-8">
      <h2 class="font-mono text-sm font-bold text-brand-black mb-2">
        Stored Images <span class="text-gray-400 font-normal">({images.length})</span>
      </h2>
      <p class="font-mono text-[11px] text-gray-500 leading-relaxed">
        Images live in <code class="text-gray-700">static/images/</code> and ship with each deploy.
        To add one: WebP-compress first, drop it in the matching folder, then commit and push.
        Reference images as <code class="text-gray-700">/images/folder/file.webp</code>.
      </p>
    </div>

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
  </div>
</div>
