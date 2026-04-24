<script lang="ts">
  import { enhance } from '$app/forms';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ campaign, attached, available } = data);
</script>

<svelte:head><title>{campaign.title} | Campaigns | Admin</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="campaigns" crumbs={[{ label: campaign.title }]} />

  <div class="max-w-4xl mx-auto px-6 py-8 space-y-10">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold">{campaign.title}</h1>
        <p class="font-mono text-xs text-gray-500 mt-1">slug: {campaign.slug}</p>
      </div>
      {#if campaign.is_active}
        <span class="px-2 py-0.5 rounded-full border bg-green-50 border-green-200 text-green-700 font-mono text-[10px] uppercase tracking-widest">active</span>
      {:else}
        <span class="px-2 py-0.5 rounded-full border bg-gray-50 border-gray-200 text-gray-500 font-mono text-[10px] uppercase tracking-widest">off</span>
      {/if}
    </div>

    <!-- Edit campaign -->
    <section>
      <h2 class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-3">Campaign details</h2>
      <form method="POST" action="?/update" use:enhance class="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label for="title" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Title</label>
            <input id="title" name="title" value={campaign.title} required class="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-black" />
          </div>
          <div>
            <label for="slug" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Slug</label>
            <input id="slug" name="slug" value={campaign.slug} required class="w-full px-3 py-2 border border-gray-200 rounded text-sm font-mono focus:outline-none focus:border-brand-black" />
          </div>
          <div>
            <label for="event_date" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Event date</label>
            <input id="event_date" type="date" name="event_date" value={campaign.event_date ?? ''} class="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-black" />
          </div>
          <div>
            <label for="location" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Location</label>
            <input id="location" name="location" value={campaign.location ?? ''} class="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-black" />
          </div>
        </div>
        <div>
          <label for="description" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Short public description</label>
          <textarea id="description" name="description" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-black">{campaign.description ?? ''}</textarea>
        </div>
        <label class="flex items-center gap-2 font-mono text-xs text-gray-600">
          <input type="checkbox" name="is_active" checked={!!campaign.is_active} class="w-4 h-4" />
          Active (artists on this campaign see giveaway form on their public profile)
        </label>
        {#if form?.error}<p class="font-mono text-xs text-red-600">{form.error}</p>{/if}
        <div class="flex items-center justify-between">
          <button type="submit" class="px-4 py-2 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors">Save</button>
        </div>
      </form>
    </section>

    <!-- Artists on this campaign -->
    <section>
      <h2 class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-3">Artists on this campaign</h2>

      {#if attached.length === 0}
        <p class="font-mono text-xs text-gray-400 mb-4">No artists attached yet.</p>
      {:else}
        <div class="space-y-3 mb-6">
          {#each attached as a (a.campaign_artist_id)}
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-start justify-between gap-3 mb-3">
                <div>
                  <a href={`/a/${a.slug}`} target="_blank" rel="noopener" class="font-mono text-sm font-bold text-brand-black hover:underline">{a.display_name}</a>
                  <div class="font-mono text-[10px] text-gray-500 mt-0.5">
                    /a/{a.slug}{a.role ? ` · ${a.role}` : ''}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  {#if a.has_active_giveaway}
                    <span class="px-2 py-0.5 rounded-full border bg-brand-yellow text-brand-black border-yellow-400 font-mono text-[10px] uppercase tracking-widest font-bold">giveaway live</span>
                  {/if}
                  <span class="font-mono text-[10px] text-gray-500">{a.entry_count} entries</span>
                </div>
              </div>

              <div class="flex items-start gap-3 flex-wrap">
                {#if !a.has_active_giveaway}
                  <form method="POST" action="?/createGiveaway" use:enhance class="flex items-end gap-2 flex-wrap">
                    <input type="hidden" name="campaign_artist_id" value={a.campaign_artist_id} />
                    <div>
                      <label for={`g-title-${a.campaign_artist_id}`} class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Giveaway title</label>
                      <input id={`g-title-${a.campaign_artist_id}`} name="title" placeholder="Win a custom mural" required class="px-3 py-1.5 border border-gray-200 rounded text-xs" />
                    </div>
                    <div>
                      <label for={`g-desc-${a.campaign_artist_id}`} class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Description</label>
                      <input id={`g-desc-${a.campaign_artist_id}`} name="description" placeholder="Rules, what’s included" class="px-3 py-1.5 border border-gray-200 rounded text-xs w-72" />
                    </div>
                    <div>
                      <label for={`g-open-${a.campaign_artist_id}`} class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Opens (opt)</label>
                      <input id={`g-open-${a.campaign_artist_id}`} type="datetime-local" name="opens_at" class="px-2 py-1.5 border border-gray-200 rounded text-xs" />
                    </div>
                    <div>
                      <label for={`g-close-${a.campaign_artist_id}`} class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Closes (opt)</label>
                      <input id={`g-close-${a.campaign_artist_id}`} type="datetime-local" name="closes_at" class="px-2 py-1.5 border border-gray-200 rounded text-xs" />
                    </div>
                    <button type="submit" class="px-3 py-1.5 bg-brand-yellow text-brand-black font-mono text-[10px] font-bold rounded hover:bg-yellow-300">Start giveaway</button>
                  </form>
                {/if}

                <form method="POST" action="?/detachArtist" use:enhance>
                  <input type="hidden" name="campaign_artist_id" value={a.campaign_artist_id} />
                  <button type="submit" class="px-3 py-1.5 border border-gray-200 font-mono text-[10px] text-gray-500 rounded hover:text-red-500 hover:border-red-300">Remove</button>
                </form>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if available.length > 0}
        <form method="POST" action="?/attachArtist" use:enhance class="flex items-end gap-3 flex-wrap border-t border-gray-100 pt-4">
          <div>
            <label for="artist_profile_id" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Attach artist</label>
            <select id="artist_profile_id" name="artist_profile_id" class="px-3 py-2 border border-gray-200 rounded text-sm">
              {#each available as a (a.id)}
                <option value={a.id}>{a.display_name}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for="role" class="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Role</label>
            <input id="role" name="role" placeholder="Live Muralist" class="px-3 py-2 border border-gray-200 rounded text-sm" />
          </div>
          <button type="submit" class="px-4 py-2 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300">Attach</button>
        </form>
      {:else if attached.length === 0}
        <p class="font-mono text-xs text-gray-400">
          Create artist profiles at <a href="/admin/artist-profiles" class="underline hover:text-brand-black">/admin/artist-profiles</a> first.
        </p>
      {/if}
    </section>
  </div>
</div>
