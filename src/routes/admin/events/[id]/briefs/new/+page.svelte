<script lang="ts">
  import AdminHeader from '$lib/components/AdminHeader.svelte';
  import BriefFieldsForm from '$lib/components/BriefFieldsForm.svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: ({ event, activationTypes, selectedType, schema, prefillData } = data);
</script>

<svelte:head><title>New Brief | Admin</title></svelte:head>

<div class="min-h-screen bg-brand-black text-white">
  <AdminHeader section="events" crumbs={[{ label: event.name, href: `/admin/events/${event.id}` }, { label: 'new brief' }]} />

  <div class="max-w-5xl mx-auto px-6 py-8">
    <h1 class="font-display text-2xl font-bold text-white mb-6">New Brief</h1>

    {#if form?.error}
      <p class="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{form.error}</p>
    {/if}

    {#if !selectedType}
      <!-- Step 1: pick activation type -->
      <div>
        <p class="font-mono text-sm text-white/60 mb-4">Pick an activation type to start.</p>
        <div class="grid sm:grid-cols-2 gap-3">
          {#each activationTypes as t}
            <a href={`?type=${t.slug}`} class="block border border-white/10 rounded-lg p-5 hover:border-brand-yellow/40 transition-colors">
              <p class="font-display text-lg font-bold text-white">{t.name}</p>
              {#if t.description}<p class="font-mono text-xs text-white/50 mt-1">{t.description}</p>{/if}
            </a>
          {/each}
        </div>
      </div>
    {:else}
      <!-- Step 2: fill the form -->
      <p class="font-mono text-xs text-white/50 mb-5">
        Activation type: <span class="text-brand-yellow">{selectedType.name}</span>
        · <a href="." class="underline hover:text-white">change</a>
      </p>

      <form method="POST" class="grid lg:grid-cols-2 gap-8">
        <input type="hidden" name="activation_type_id" value={selectedType.id} />

        <!-- Left: structured fields -->
        <div class="space-y-5">
          <div>
            <label for="title" class="block font-mono text-xs text-white/60 mb-1.5">Brief Title <span class="text-brand-yellow">*</span></label>
            <input id="title" name="title" type="text" required value="{selectedType.name} — {event.name}" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-brand-yellow/40" />
          </div>

          <div class="pt-2 border-t border-white/10">
            <p class="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-4 mt-4">Structured Fields</p>
            <BriefFieldsForm {schema} data={prefillData} />
          </div>
        </div>

        <!-- Right: markdown body + terms -->
        <div class="space-y-5">
          <div>
            <label for="brief_body" class="block font-mono text-xs text-white/60 mb-1.5">Brief Body (Markdown)</label>
            <textarea id="brief_body" name="brief_body" rows="20" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs font-mono text-white focus:outline-none focus:border-brand-yellow/40">{selectedType.brief_body_template ?? ''}</textarea>
          </div>
          <div>
            <label for="terms_markdown" class="block font-mono text-xs text-white/60 mb-1.5">Terms (Markdown)</label>
            <textarea id="terms_markdown" name="terms_markdown" rows="14" class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs font-mono text-white focus:outline-none focus:border-brand-yellow/40">{selectedType.terms_template ?? ''}</textarea>
          </div>
        </div>

        <div class="lg:col-span-2">
          <button type="submit" class="px-4 py-2 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors">Create Brief</button>
        </div>
      </form>
    {/if}
  </div>
</div>
