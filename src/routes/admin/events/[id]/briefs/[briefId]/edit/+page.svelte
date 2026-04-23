<script lang="ts">
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import BriefFieldsForm from '$lib/components/BriefFieldsForm.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ event, brief, activationType, schema, briefData } = data);
</script>

<svelte:head><title>Edit {brief.title} | Admin</title></svelte:head>

<div class="min-h-screen bg-white text-brand-black">
  <AdminHeader
    section="events"
    crumbs={[
      { label: event.name, href: `/admin/events/${event.id}` },
      { label: brief.title, href: `/admin/events/${event.id}/briefs/${brief.id}` },
      { label: 'edit' }
    ]}
  />

  <div class="max-w-5xl mx-auto px-6 py-8">
    <h1 class="font-display text-2xl font-bold text-brand-black mb-2">Edit Brief</h1>
    <p class="font-mono text-xs text-gray-500 mb-6">Activation type: <span class="text-brand-black font-semibold">{activationType?.name ?? '—'}</span> (cannot be changed)</p>

    {#if form?.error}
      <p class="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    {/if}

    <form method="POST" class="grid lg:grid-cols-2 gap-8">
      <div class="space-y-5">
        <div>
          <label for="title" class="block font-mono text-xs text-gray-600 mb-1.5">Brief Title <span class="text-red-500">*</span></label>
          <input id="title" name="title" type="text" required value={brief.title} class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black focus:outline-none focus:border-brand-yellow/40" />
        </div>

        <div class="pt-2 border-t border-gray-200">
          <p class="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-4 mt-4">Structured Fields</p>
          <BriefFieldsForm {schema} data={briefData} />
        </div>
      </div>

      <div class="space-y-5">
        <div>
          <label for="brief_body" class="block font-mono text-xs text-gray-600 mb-1.5">Brief Body (Markdown)</label>
          <textarea id="brief_body" name="brief_body" rows="20" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-brand-black focus:outline-none focus:border-brand-yellow/40">{brief.brief_body ?? ''}</textarea>
        </div>
        <div>
          <label for="terms_markdown" class="block font-mono text-xs text-gray-600 mb-1.5">Terms (Markdown)</label>
          <textarea id="terms_markdown" name="terms_markdown" rows="14" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-brand-black focus:outline-none focus:border-brand-yellow/40">{brief.terms_markdown ?? ''}</textarea>
        </div>
      </div>

      <div class="lg:col-span-2 flex gap-3">
        <button type="submit" class="px-4 py-2 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors">Save Changes</button>
        <a href={`/admin/events/${event.id}/briefs/${brief.id}`} class="px-4 py-2 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-700 hover:text-brand-black transition-colors">Cancel</a>
      </div>
    </form>
  </div>
</div>
