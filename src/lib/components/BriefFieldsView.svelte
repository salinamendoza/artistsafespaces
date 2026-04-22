<script lang="ts">
  import type { BriefFieldDef } from '$lib/types/brief-schema';

  export let schema: BriefFieldDef[] = [];
  export let data: Record<string, string> = {};
  export let dark = true;

  function valueFor(key: string): string {
    return data?.[key] ?? '';
  }
</script>

<dl class="grid sm:grid-cols-2 gap-x-6 gap-y-4">
  {#each schema as field}
    <div>
      <dt class="font-mono text-[10px] uppercase tracking-widest mb-1 {dark ? 'text-white/40' : 'text-gray-500'}">
        {field.label}
      </dt>
      <dd class="font-mono text-sm {dark ? 'text-white' : 'text-brand-black'} whitespace-pre-wrap break-words">
        {valueFor(field.key) || '—'}
      </dd>
    </div>
  {/each}
</dl>
