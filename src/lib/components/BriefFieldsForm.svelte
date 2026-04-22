<script lang="ts">
  import type { BriefFieldDef } from '$lib/types/brief-schema';

  export let schema: BriefFieldDef[] = [];
  export let data: Record<string, string> = {};
  export let namePrefix = 'field_';

  function valueFor(key: string): string {
    return data?.[key] ?? '';
  }
</script>

<div class="space-y-5">
  {#each schema as field}
    <div>
      <label for={`${namePrefix}${field.key}`} class="block font-mono text-xs text-white/60 mb-1.5">
        {field.label}
        {#if field.required}<span class="text-brand-yellow">*</span>{/if}
      </label>

      {#if field.type === 'textarea'}
        <textarea
          id={`${namePrefix}${field.key}`}
          name={`${namePrefix}${field.key}`}
          rows="3"
          required={field.required}
          class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-brand-yellow/40"
          value={valueFor(field.key)}
        ></textarea>
      {:else if field.type === 'select'}
        <select
          id={`${namePrefix}${field.key}`}
          name={`${namePrefix}${field.key}`}
          required={field.required}
          class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono text-white focus:outline-none focus:border-brand-yellow/40"
          value={valueFor(field.key)}
        >
          <option value="" class="bg-brand-black">Select…</option>
          {#each field.options ?? [] as opt}
            <option value={opt} class="bg-brand-black">{opt}</option>
          {/each}
        </select>
      {:else if field.type === 'dimensions'}
        <input
          id={`${namePrefix}${field.key}`}
          name={`${namePrefix}${field.key}`}
          type="text"
          required={field.required}
          placeholder="e.g. 24 x 36 in"
          class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-brand-yellow/40"
          value={valueFor(field.key)}
        />
      {:else}
        <input
          id={`${namePrefix}${field.key}`}
          name={`${namePrefix}${field.key}`}
          type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
          required={field.required}
          class="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-brand-yellow/40"
          value={valueFor(field.key)}
        />
      {/if}

      {#if field.help}
        <p class="mt-1 font-mono text-[10px] text-white/30">{field.help}</p>
      {/if}
    </div>
  {/each}
</div>
