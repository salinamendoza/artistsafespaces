<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  export let data: PageData;

  $: ({ contacts, stats, view } = data);

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

<div class="min-h-screen bg-brand-black text-white">
  <!-- Top bar -->
  <header class="border-b border-white/10 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class="font-mono text-brand-yellow text-sm font-bold">admin</span>
      <span class="text-white/30 font-mono text-xs">/</span>
      <span class="font-mono text-white/60 text-sm">contacts</span>
    </div>
    <div class="flex items-center gap-4">
      <a href="/admin/images" class="text-white/40 hover:text-brand-yellow font-mono text-xs transition-colors">
        images
      </a>
      <form method="POST" action="?/logout" use:enhance>
        <button type="submit" class="text-white/40 hover:text-white font-mono text-xs transition-colors">
          logout
        </button>
      </form>
    </div>
  </header>

  <div class="max-w-6xl mx-auto px-6 py-8">
    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="bg-white/5 border border-white/10 rounded-lg px-5 py-4">
        <p class="font-mono text-3xl font-bold text-white">{stats.total}</p>
        <p class="font-mono text-xs text-white/40 mt-1">total contacts</p>
      </div>
      <div class="bg-white/5 border border-white/10 rounded-lg px-5 py-4">
        <p class="font-mono text-3xl font-bold text-brand-yellow">{stats.contacted}</p>
        <p class="font-mono text-xs text-white/40 mt-1">contacted</p>
      </div>
      <div class="bg-white/5 border border-white/10 rounded-lg px-5 py-4">
        <p class="font-mono text-3xl font-bold text-white/50">{stats.archived}</p>
        <p class="font-mono text-xs text-white/40 mt-1">archived</p>
      </div>
    </div>

    <!-- Tabs + Export -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex gap-1 bg-white/5 rounded-lg p-1">
        <a
          href="/admin"
          class="px-4 py-2 rounded-md font-mono text-sm transition-colors {view === 'active' ? 'bg-brand-yellow text-brand-black font-bold' : 'text-white/50 hover:text-white'}"
        >
          Active
        </a>
        <a
          href="/admin?view=archived"
          class="px-4 py-2 rounded-md font-mono text-sm transition-colors {view === 'archived' ? 'bg-brand-yellow text-brand-black font-bold' : 'text-white/50 hover:text-white'}"
        >
          Archived
        </a>
      </div>
      <button
        on:click={exportCsv}
        class="px-4 py-2 border border-white/10 rounded-lg font-mono text-xs text-white/50 hover:text-brand-yellow hover:border-brand-yellow/30 transition-colors"
      >
        Export CSV
      </button>
    </div>

    <!-- Contact Cards -->
    {#if contacts.length === 0}
      <div class="text-center py-20">
        <p class="font-mono text-white/30 text-sm">
          {view === 'archived' ? 'No archived contacts.' : 'No contacts yet.'}
        </p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each contacts as contact (contact.id)}
          <div class="bg-white/[0.03] border border-white/10 rounded-lg p-5 hover:border-white/20 transition-colors">
            <!-- Header row -->
            <div class="flex items-start justify-between gap-4 mb-3">
              <div class="min-w-0">
                <div class="flex items-center gap-3 flex-wrap">
                  <h3 class="font-mono text-white font-bold text-sm">{contact.name}</h3>
                  {#if contact.contacted}
                    <span class="px-2 py-0.5 bg-brand-yellow/10 text-brand-yellow font-mono text-[10px] rounded-full border border-brand-yellow/20">
                      contacted
                    </span>
                  {/if}
                </div>
                <a href="mailto:{contact.email}" class="font-mono text-xs text-white/40 hover:text-brand-yellow transition-colors">
                  {contact.email}
                </a>
              </div>
              <time class="font-mono text-[10px] text-white/30 whitespace-nowrap">
                {formatDate(contact.created_at)}
              </time>
            </div>

            <!-- Subject + Message -->
            <p class="font-mono text-xs text-brand-yellow/70 mb-1">{contact.subject}</p>
            <p class="text-sm text-white/60 leading-relaxed mb-4 whitespace-pre-wrap">{contact.message}</p>

            <!-- Notes display -->
            {#if contact.contact_note}
              <p class="font-mono text-[10px] text-white/30 mb-1">contact note: <span class="text-white/50">{contact.contact_note}</span></p>
            {/if}
            {#if contact.archive_note}
              <p class="font-mono text-[10px] text-white/30 mb-1">archive note: <span class="text-white/50">{contact.archive_note}</span></p>
            {/if}

            <!-- Actions -->
            <div class="flex items-end gap-3 mt-4 pt-4 border-t border-white/5">
              {#if !contact.archived}
                <!-- Mark Contacted -->
                <form method="POST" action="?/markContacted" use:enhance class="flex items-end gap-2 flex-1">
                  <input type="hidden" name="id" value={contact.id} />
                  <input type="hidden" name="contacted" value={contact.contacted} />
                  <div class="flex-1 max-w-xs">
                    <input
                      type="text"
                      name="contact_note"
                      placeholder="Note (optional)"
                      value={contact.contact_note ?? ''}
                      class="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-brand-yellow/30"
                    />
                  </div>
                  <button
                    type="submit"
                    class="px-3 py-1.5 rounded text-xs font-mono font-bold transition-colors {contact.contacted ? 'bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 hover:bg-transparent' : 'bg-white/5 text-white/50 border border-white/10 hover:text-brand-yellow hover:border-brand-yellow/30'}"
                  >
                    {contact.contacted ? 'Undo Contact' : 'Mark Contacted'}
                  </button>
                </form>

                <!-- Archive -->
                <form method="POST" action="?/archive" use:enhance class="flex items-end gap-2">
                  <input type="hidden" name="id" value={contact.id} />
                  <div>
                    <input
                      type="text"
                      name="archive_note"
                      placeholder="Reason (required)"
                      required
                      class="w-40 px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-red-400/30"
                    />
                  </div>
                  <button
                    type="submit"
                    class="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs font-mono text-white/30 hover:text-red-400 hover:border-red-400/30 transition-colors"
                  >
                    Archive
                  </button>
                </form>
              {:else}
                <!-- Unarchive -->
                <form method="POST" action="?/unarchive" use:enhance>
                  <input type="hidden" name="id" value={contact.id} />
                  <button
                    type="submit"
                    class="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs font-mono text-white/30 hover:text-brand-yellow hover:border-brand-yellow/30 transition-colors"
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
