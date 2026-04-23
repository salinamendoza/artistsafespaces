<script lang="ts">
  import type { Artist, ActivationType } from '$lib/types/db-types';

  export let artist: Partial<Artist> = {};
  export let activationTypes: Pick<ActivationType, 'slug' | 'name'>[] = [];
  export let submitLabel = 'Save';
  export let error: string | null = null;

  function parseSpecialties(json: string | null | undefined): Set<string> {
    if (!json) return new Set();
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) return new Set(parsed as string[]);
    } catch {}
    return new Set();
  }

  $: selectedSpecialties = parseSpecialties(artist.specialties_json);

  function parseStyleImages(json: string | null | undefined): string[] {
    if (!json) return [];
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) return parsed.map((s) => String(s));
    } catch {}
    return [];
  }

  $: styleImages = parseStyleImages(artist.style_images_json);
</script>

<form method="POST" class="space-y-5">
  {#if error}
    <p class="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{error}</p>
  {/if}

  <div class="grid sm:grid-cols-2 gap-4">
    <div>
      <label for="name" class="block font-mono text-xs text-gray-600 mb-1.5">Name <span class="text-red-500">*</span></label>
      <input id="name" name="name" type="text" required value={artist.name ?? ''} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black focus:outline-none focus:border-brand-black" />
    </div>
    <div>
      <label for="city" class="block font-mono text-xs text-gray-600 mb-1.5">City</label>
      <input id="city" name="city" type="text" value={artist.city ?? ''} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black focus:outline-none focus:border-brand-black" />
    </div>
    <div>
      <label for="email" class="block font-mono text-xs text-gray-600 mb-1.5">Email</label>
      <input id="email" name="email" type="email" value={artist.email ?? ''} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black focus:outline-none focus:border-brand-black" />
    </div>
    <div>
      <label for="phone" class="block font-mono text-xs text-gray-600 mb-1.5">Phone</label>
      <input id="phone" name="phone" type="tel" value={artist.phone ?? ''} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black focus:outline-none focus:border-brand-black" />
    </div>
    <div>
      <label for="portfolio_url" class="block font-mono text-xs text-gray-600 mb-1.5">Portfolio URL</label>
      <input id="portfolio_url" name="portfolio_url" type="url" value={artist.portfolio_url ?? ''} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black focus:outline-none focus:border-brand-black" />
    </div>
    <div>
      <label for="instagram_handle" class="block font-mono text-xs text-gray-600 mb-1.5">Instagram</label>
      <input id="instagram_handle" name="instagram_handle" type="text" placeholder="@handle" value={artist.instagram_handle ?? ''} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
    </div>
  </div>

  <div>
    <label for="bio" class="block font-mono text-xs text-gray-600 mb-1.5">Bio</label>
    <textarea id="bio" name="bio" rows="3" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black focus:outline-none focus:border-brand-black">{artist.bio ?? ''}</textarea>
  </div>

  <div class="space-y-4 border-t border-gray-200 pt-5">
    <div>
      <p class="block font-mono text-xs text-gray-600 mb-1">Images</p>
      <p class="font-mono text-[10px] text-gray-500">Upload via <a href="/admin/images" class="underline hover:text-brand-black">/admin/images</a>, then paste the <code class="text-gray-700">/api/images/&hellip;</code> path below.</p>
    </div>

    <div class="grid sm:grid-cols-2 gap-4">
      <div>
        <label for="headshot_url" class="block font-mono text-xs text-gray-600 mb-1.5">Headshot URL</label>
        <input id="headshot_url" name="headshot_url" type="text" placeholder="/api/images/artists/name-headshot.jpg" value={artist.headshot_url ?? ''} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
      </div>
      <div>
        <label for="studio_url" class="block font-mono text-xs text-gray-600 mb-1.5">Studio / Gallery Shot URL <span class="text-gray-400">(optional)</span></label>
        <input id="studio_url" name="studio_url" type="text" placeholder="/api/images/artists/name-studio.jpg" value={artist.studio_url ?? ''} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
      </div>
    </div>

    <div>
      <p class="block font-mono text-xs text-gray-600 mb-1.5">Style Images <span class="text-gray-400">(up to 3, for quick-glance reference)</span></p>
      <div class="space-y-2">
        {#each [0, 1, 2] as i}
          <input name={`style_image_${i + 1}`} type="text" placeholder={`Style image ${i + 1} URL`} value={styleImages[i] ?? ''} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
        {/each}
      </div>
    </div>
  </div>

  {#if activationTypes.length}
    <div>
      <p class="block font-mono text-xs text-gray-600 mb-1.5">Specialties</p>
      <div class="grid sm:grid-cols-2 gap-2">
        {#each activationTypes as t}
          <label class="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded cursor-pointer hover:border-gray-300">
            <input type="checkbox" name="specialties" value={t.slug} checked={selectedSpecialties.has(t.slug)} class="accent-brand-yellow" />
            <span class="font-mono text-xs text-gray-800">{t.name}</span>
          </label>
        {/each}
      </div>
    </div>
  {/if}

  <div>
    <label for="internal_notes" class="block font-mono text-xs text-gray-600 mb-1.5">Internal Notes</label>
    <textarea id="internal_notes" name="internal_notes" rows="3" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black focus:outline-none focus:border-brand-black">{artist.internal_notes ?? ''}</textarea>
  </div>

  <div class="flex items-center gap-3">
    <button type="submit" class="px-4 py-2 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors">{submitLabel}</button>
  </div>
</form>
