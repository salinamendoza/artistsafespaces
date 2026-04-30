<script lang="ts">
  import { enhance } from '$app/forms';
  import { enhanceNoReset } from '$lib/utils/enhance';
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import ActivityList from '$lib/components/ActivityList.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: ({ contacts, artistApps, partnerApps, stats, view } = data);
  $: activity = Array.isArray(data.activity) ? data.activity : [];

  function exportCsv() {
    const headers = ['ID', 'Name', 'Email', 'Subject', 'Message', 'Created At', 'Contacted', 'Contact Note', 'Archived', 'Archive Note'];
    const rows = contacts.map(c => [
      c.id,
      `"${(c.name ?? '').replace(/"/g, '""')}"`,
      `"${(c.email ?? '').replace(/"/g, '""')}"`,
      `"${(c.subject ?? '').replace(/"/g, '""')}"`,
      `"${(c.message ?? '').replace(/"/g, '""')}"`,
      c.created_at,
      c.contacted,
      `"${(c.contact_note ?? '').replace(/"/g, '""')}"`,
      c.archived,
      `"${(c.archive_note ?? '').replace(/"/g, '""')}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${view}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatDate(iso: string): string {
    return new Date(iso + 'Z').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>Admin Dashboard | Artist Safespaces</title>
</svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader section="contacts" />

  <div class="max-w-6xl mx-auto px-6 py-8">
    <!-- Recent activity -->
    <section class="mb-10">
      <div class="flex items-baseline justify-between mb-3">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500">Recent activity</p>
        {#if activity.length > 0}
          <a href="/admin/activity" class="font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-brand-black transition-colors">View all →</a>
        {/if}
      </div>
      <ActivityList {activity} />
    </section>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div class="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4">
        <p class="font-mono text-3xl font-bold text-brand-black">{stats.total}</p>
        <p class="font-mono text-xs text-gray-500 mt-1">total contacts</p>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4">
        <p class="font-mono text-3xl font-bold text-brand-black">{stats.contacted}</p>
        <p class="font-mono text-xs text-gray-500 mt-1">contacted</p>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4">
        <p class="font-mono text-3xl font-bold text-gray-500">{stats.archived}</p>
        <p class="font-mono text-xs text-gray-500 mt-1">archived</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4">
        <p class="font-mono text-3xl font-bold text-brand-black">{stats.artistApplications}</p>
        <p class="font-mono text-xs text-gray-500 mt-1">artist applications</p>
      </div>
      <div class="bg-gray-50 border border-gray-200 rounded-lg px-5 py-4">
        <p class="font-mono text-3xl font-bold text-brand-black">{stats.partnerApplications}</p>
        <p class="font-mono text-xs text-gray-500 mt-1">partner applications</p>
      </div>
    </div>

    <!-- Tabs + Export -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex gap-1 bg-gray-50 rounded-lg p-1">
        <a href="/admin" class="px-3 py-2 rounded-md font-mono text-xs transition-colors {view === 'active' ? 'bg-brand-yellow text-brand-black font-bold' : 'text-gray-500 hover:text-brand-black'}">Active</a>
        <a href="/admin?view=archived" class="px-3 py-2 rounded-md font-mono text-xs transition-colors {view === 'archived' ? 'bg-brand-yellow text-brand-black font-bold' : 'text-gray-500 hover:text-brand-black'}">Archived</a>
        <a href="/admin?view=artist-apps" class="px-3 py-2 rounded-md font-mono text-xs transition-colors {view === 'artist-apps' ? 'bg-brand-yellow text-brand-black font-bold' : 'text-gray-500 hover:text-brand-black'}">Artist Apps</a>
        <a href="/admin?view=partner-apps" class="px-3 py-2 rounded-md font-mono text-xs transition-colors {view === 'partner-apps' ? 'bg-brand-yellow text-brand-black font-bold' : 'text-gray-500 hover:text-brand-black'}">Partner Apps</a>
      </div>
      <button
        on:click={exportCsv}
        class="px-4 py-2 border border-gray-200 rounded-lg font-mono text-xs text-gray-500 hover:text-brand-black hover:border-gray-400 transition-colors"
      >
        Export CSV
      </button>
    </div>

    <!-- Content based on active tab -->
    {#if view === 'artist-apps'}
      {#if artistApps.length === 0}
        <p class="font-mono text-gray-400 text-sm text-center py-20">No artist applications yet.</p>
      {:else}
        <div class="space-y-3">
          {#each artistApps as app (app.id)}
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <div class="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 class="font-mono text-brand-black font-bold text-sm">{app.name}</h3>
                  <a href="mailto:{app.email}" class="font-mono text-xs text-gray-500 hover:text-brand-black">{app.email}</a>
                </div>
                <time class="font-mono text-[10px] text-gray-400 whitespace-nowrap">{formatDate(app.created_at)}</time>
              </div>
              <div class="grid sm:grid-cols-3 gap-3 mb-3 font-mono text-xs">
                <div><span class="text-gray-400">Location:</span> <span class="text-gray-700">{app.location}</span></div>
                <div><span class="text-gray-400">Medium:</span> <span class="text-gray-700">{app.medium}</span></div>
                {#if app.instagram}<div><span class="text-gray-400">IG:</span> <span class="text-gray-700">{app.instagram}</span></div>{/if}
              </div>
              <p class="text-sm text-gray-600 whitespace-pre-wrap">{app.bio}</p>
              {#if app.interests}
                <div class="mt-2 flex flex-wrap gap-1">
                  {#each JSON.parse(app.interests) as interest}
                    <span class="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 font-mono text-[10px] rounded-full">{interest}</span>
                  {/each}
                </div>
              {/if}
              {#if app.website}<p class="mt-2 font-mono text-xs text-gray-500"><a href={app.website} target="_blank" rel="noopener" class="underline hover:text-brand-black">{app.website}</a></p>{/if}
            </div>
          {/each}
        </div>
      {/if}
    {:else if view === 'partner-apps'}
      {#if partnerApps.length === 0}
        <p class="font-mono text-gray-400 text-sm text-center py-20">No partner applications yet.</p>
      {:else}
        <div class="space-y-3">
          {#each partnerApps as app (app.id)}
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <div class="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 class="font-mono text-brand-black font-bold text-sm">{app.organization_name}</h3>
                  <p class="font-mono text-xs text-gray-500">{app.contact_name} · <a href="mailto:{app.email}" class="hover:text-brand-black">{app.email}</a></p>
                </div>
                <time class="font-mono text-[10px] text-gray-400 whitespace-nowrap">{formatDate(app.created_at)}</time>
              </div>
              <div class="grid sm:grid-cols-3 gap-3 mb-3 font-mono text-xs">
                <div><span class="text-gray-400">Type:</span> <span class="text-gray-700">{app.org_type}</span></div>
                {#if app.phone}<div><span class="text-gray-400">Phone:</span> <span class="text-gray-700">{app.phone}</span></div>{/if}
              </div>
              {#if app.message}<p class="text-sm text-gray-600 whitespace-pre-wrap">{app.message}</p>{/if}
              {#if app.interests}
                <div class="mt-2 flex flex-wrap gap-1">
                  {#each JSON.parse(app.interests) as interest}
                    <span class="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 font-mono text-[10px] rounded-full">{interest}</span>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    {:else if contacts.length === 0}
      <div class="text-center py-20">
        <p class="font-mono text-gray-400 text-sm">
          {view === 'archived' ? 'No archived contacts.' : 'No contacts yet.'}
        </p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each contacts as contact (contact.id)}
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors">
            <!-- Header row -->
            <div class="flex items-start justify-between gap-4 mb-3">
              <div class="min-w-0">
                <div class="flex items-center gap-3 flex-wrap">
                  <h3 class="font-mono text-brand-black font-bold text-sm">{contact.name}</h3>
                  {#if contact.contacted}
                    <span class="px-2 py-0.5 bg-green-50 text-green-700 font-mono text-[10px] rounded-full border border-green-200">
                      contacted
                    </span>
                  {/if}
                </div>
                <a href="mailto:{contact.email}" class="font-mono text-xs text-gray-500 hover:text-brand-black transition-colors">
                  {contact.email}
                </a>
              </div>
              <time class="font-mono text-[10px] text-gray-400 whitespace-nowrap">
                {formatDate(contact.created_at)}
              </time>
            </div>

            <!-- Subject + Message -->
            <p class="font-mono text-xs text-brand-black font-medium mb-1">{contact.subject}</p>
            <p class="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap">{contact.message}</p>

            <!-- Notes display -->
            {#if contact.contact_note}
              <p class="font-mono text-[10px] text-gray-400 mb-1">contact note: <span class="text-gray-500">{contact.contact_note}</span></p>
            {/if}
            {#if contact.archive_note}
              <p class="font-mono text-[10px] text-gray-400 mb-1">archive note: <span class="text-gray-500">{contact.archive_note}</span></p>
            {/if}

            <!-- Actions -->
            <div class="flex items-end gap-3 mt-4 pt-4 border-t border-gray-100">
              {#if !contact.archived}
                <!-- Mark Contacted -->
                <form method="POST" action="?/markContacted" use:enhance={enhanceNoReset} class="flex items-end gap-2 flex-1">
                  <input type="hidden" name="id" value={contact.id} />
                  <input type="hidden" name="contacted" value={contact.contacted} />
                  <div class="flex-1 max-w-xs">
                    <input
                      type="text"
                      name="contact_note"
                      placeholder="Note (optional)"
                      value={contact.contact_note ?? ''}
                      class="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black"
                    />
                  </div>
                  <button
                    type="submit"
                    class="px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors {contact.contacted ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-white' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:text-brand-black hover:border-gray-400'}"
                  >
                    {contact.contacted ? 'Undo Contact' : 'Mark Contacted'}
                  </button>
                </form>

                <!-- Archive -->
                <form method="POST" action="?/archive" use:enhance={enhanceNoReset} class="flex items-end gap-2">
                  <input type="hidden" name="id" value={contact.id} />
                  <div>
                    <input
                      type="text"
                      name="archive_note"
                      placeholder="Reason (required)"
                      required
                      class="w-40 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-red-400/30"
                    />
                  </div>
                  <button
                    type="submit"
                    class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-colors"
                  >
                    Archive
                  </button>
                </form>
              {:else}
                <!-- Unarchive -->
                <form method="POST" action="?/unarchive" use:enhance={enhanceNoReset}>
                  <input type="hidden" name="id" value={contact.id} />
                  <button
                    type="submit"
                    class="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-gray-400 hover:text-brand-black hover:border-gray-400 transition-colors"
                  >
                    Unarchive
                  </button>
                </form>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
