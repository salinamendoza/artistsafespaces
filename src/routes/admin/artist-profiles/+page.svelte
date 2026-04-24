<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ artists } = data);

  let editingId: number | null = null;
  let showNew = false;
</script>

<svelte:head><title>Artist Profiles | Admin</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="artist-profiles" />

  <div class="max-w-5xl mx-auto px-6 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display text-2xl font-bold">Artist Profiles</h1>
        <p class="font-mono text-xs text-gray-500 mt-1">Public-facing profiles at /a/[slug]. Separate from booking artists.</p>
      </div>
      <button
        on:click={() => { showNew = !showNew; editingId = null; }}
        class="px-3 py-1.5 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300"
      >
        {showNew ? 'Cancel' : '+ New Profile'}
      </button>
    </div>

    {#if showNew}
      <form
        method="POST"
        action="?/create"
        use:enhance={() =>
          async ({ update, result }) => {
            await update({ reset: true });
            if (result.type === 'success') showNew = false;
          }}
        class="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4"
      >
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label for="n-name" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Display name</label>
            <input id="n-name" name="display_name" required class="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-black" />
          </div>
          <div>
            <label for="n-slug" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Slug (auto if blank)</label>
            <input id="n-slug" name="slug" class="w-full px-3 py-2 border border-gray-200 rounded text-sm font-mono focus:outline-none focus:border-brand-black" />
          </div>
          <div>
            <label for="n-ig" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Instagram handle</label>
            <input id="n-ig" name="instagram_handle" placeholder="no @" class="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-black" />
          </div>
          <div>
            <label for="n-head" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Headshot URL (optional)</label>
            <input id="n-head" name="headshot_url" class="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-black" />
          </div>
        </div>
        <div>
          <label for="n-bio" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Bio</label>
          <textarea id="n-bio" name="bio" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-black"></textarea>
        </div>
        <label class="flex items-center gap-2 font-mono text-xs text-gray-600">
          <input type="checkbox" name="is_public" checked class="w-4 h-4" />
          Public (uncheck to 404 the profile)
        </label>
        {#if form?.error}<p class="font-mono text-xs text-red-600">{form.error}</p>{/if}
        <button type="submit" class="px-4 py-2 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300">Create</button>
      </form>
    {/if}

    {#if artists.length === 0}
      <div class="text-center py-20 border border-gray-200 rounded-lg">
        <p class="font-mono text-gray-400 text-sm">No profiles yet.</p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each artists as a (a.id)}
          <div class="border border-gray-200 rounded-lg p-4">
            {#if editingId === a.id}
              <form
                method="POST"
                action="?/update"
                use:enhance={() =>
                  async ({ update, result }) => {
                    await update({ reset: false });
                    if (result.type === 'success') editingId = null;
                  }}
                class="space-y-4"
              >
                <input type="hidden" name="id" value={a.id} />
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <label for={`e-name-${a.id}`} class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Display name</label>
                    <input id={`e-name-${a.id}`} name="display_name" value={a.display_name} required class="w-full px-3 py-2 border border-gray-200 rounded text-sm" />
                  </div>
                  <div>
                    <label for={`e-slug-${a.id}`} class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Slug</label>
                    <input id={`e-slug-${a.id}`} name="slug" value={a.slug} required class="w-full px-3 py-2 border border-gray-200 rounded text-sm font-mono" />
                  </div>
                  <div>
                    <label for={`e-ig-${a.id}`} class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Instagram handle</label>
                    <input id={`e-ig-${a.id}`} name="instagram_handle" value={a.instagram_handle ?? ''} class="w-full px-3 py-2 border border-gray-200 rounded text-sm" />
                  </div>
                  <div>
                    <label for={`e-head-${a.id}`} class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Headshot URL</label>
                    <input id={`e-head-${a.id}`} name="headshot_url" value={a.headshot_url ?? ''} class="w-full px-3 py-2 border border-gray-200 rounded text-sm" />
                  </div>
                </div>
                <div>
                  <label for={`e-bio-${a.id}`} class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Bio</label>
                  <textarea id={`e-bio-${a.id}`} name="bio" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded text-sm">{a.bio ?? ''}</textarea>
                </div>
                <label class="flex items-center gap-2 font-mono text-xs text-gray-600">
                  <input type="checkbox" name="is_public" checked={!!a.is_public} class="w-4 h-4" />
                  Public
                </label>
                {#if form?.error}<p class="font-mono text-xs text-red-600">{form.error}</p>{/if}
                <div class="flex gap-2">
                  <button type="submit" class="px-4 py-2 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300">Save</button>
                  <button type="button" on:click={() => (editingId = null)} class="px-4 py-2 border border-gray-200 font-mono text-xs text-gray-500 rounded hover:text-brand-black">Cancel</button>
                </div>
              </form>
            {:else}
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <a href={`/a/${a.slug}`} target="_blank" rel="noopener" class="font-mono text-sm font-bold text-brand-black hover:underline">{a.display_name}</a>
                    {#if !a.is_public}
                      <span class="px-2 py-0.5 rounded-full border bg-gray-50 border-gray-200 text-gray-500 font-mono text-[10px] uppercase tracking-widest">hidden</span>
                    {/if}
                  </div>
                  <div class="font-mono text-[10px] text-gray-500 mt-0.5">
                    /a/{a.slug}
                    {#if a.instagram_handle} · @{a.instagram_handle}{/if}
                    · {a.campaign_count} campaign{a.campaign_count === 1 ? '' : 's'}
                  </div>
                  {#if a.bio}<p class="text-sm text-gray-600 mt-2">{a.bio}</p>{/if}
                </div>
                <button
                  on:click={() => { editingId = a.id; showNew = false; }}
                  class="px-3 py-1.5 border border-gray-200 font-mono text-[10px] text-gray-500 rounded hover:text-brand-black hover:border-gray-400 whitespace-nowrap"
                >Edit</button>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
