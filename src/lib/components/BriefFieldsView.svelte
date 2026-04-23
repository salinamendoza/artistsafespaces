<script lang="ts">
  import type { BriefFieldDef } from '$lib/types/brief-schema';

  export let schema: BriefFieldDef[] = [];
  export let data: Record<string, string> = {};
  export let dark = true;

  function valueFor(key: string): string {
    return data?.[key] ?? '';
  }

  function isLongField(field: BriefFieldDef): boolean {
    if (field.type === 'textarea') return true;
    const val = valueFor(field.key);
    return val.length > 80;
  }

  $: shortFields = schema.filter((f) => !isLongField(f) && valueFor(f.key));
  $: longFields = schema.filter((f) => isLongField(f) && valueFor(f.key));
  $: emptyFields = schema.filter((f) => !valueFor(f.key));
</script>

{#if shortFields.length}
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
    {#each shortFields as field}
      <div>
        <dt class="font-mono text-[10px] uppercase tracking-widest mb-1.5 {dark ? 'text-white/40' : 'text-gray-500'}">
          {field.label}
        </dt>
        <dd class="text-sm font-semibold {dark ? 'text-white' : 'text-brand-black'}">
          {valueFor(field.key)}
        </dd>
      </div>
    {/each}
  </div>
{/if}

{#if longFields.length}
  <div class="space-y-5 {shortFields.length ? 'mt-6 pt-6 border-t ' + (dark ? 'border-white/10' : 'border-gray-200') : ''}">
    {#each longFields as field}
      <div>
        <dt class="font-mono text-[10px] uppercase tracking-widest mb-2 {dark ? 'text-white/40' : 'text-gray-500'}">
          {field.label}
        </dt>
        <dd class="text-sm leading-relaxed whitespace-pre-wrap {dark ? 'text-white/90' : 'text-brand-black'}">
          {valueFor(field.key)}
        </dd>
      </div>
    {/each}
  </div>
{/if}

{#if emptyFields.length}
  <div class="flex flex-wrap gap-x-6 gap-y-1 {shortFields.length || longFields.length ? 'mt-4 pt-4 border-t ' + (dark ? 'border-white/5' : 'border-gray-100') : ''}">
    {#each emptyFields as field}
      <span class="font-mono text-[10px] {dark ? 'text-white/20' : 'text-gray-300'}">{field.label}: —</span>
    {/each}
  </div>
{/if}
