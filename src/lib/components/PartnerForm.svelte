<script lang="ts">
  import type { EventPartner } from '$lib/types/db-types';

  export let partner: Partial<EventPartner> = {};
  export let submitLabel = 'Save';
  export let error: string | null = null;
</script>

<form method="POST" class="space-y-5">
  {#if error}
    <p class="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-xs">{error}</p>
  {/if}

  <div class="grid sm:grid-cols-2 gap-4">
    <div>
      <label for="name" class="block font-mono text-xs text-gray-600 mb-1.5">Name <span class="text-red-500">*</span></label>
      <input id="name" name="name" type="text" required value={partner.name ?? ''} placeholder="Art Supply Warehouse" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
    </div>
    <div>
      <label for="role" class="block font-mono text-xs text-gray-600 mb-1.5">Role</label>
      <input id="role" name="role" type="text" value={partner.role ?? ''} placeholder="Designated art store partner" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
    </div>
  </div>

  <div class="grid sm:grid-cols-2 gap-4">
    <div>
      <p class="block font-mono text-xs text-gray-600 mb-1.5">Paid by</p>
      <div class="flex gap-2">
        {#each [['us', 'Us'], ['client', 'Client'], ['none', 'Not paid']] as [value, label]}
          <label class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded cursor-pointer hover:border-gray-300 has-[:checked]:border-brand-black has-[:checked]:bg-white">
            <input type="radio" name="paid_by" {value} checked={(partner.paid_by ?? 'none') === value} class="accent-brand-yellow" />
            <span class="font-mono text-xs text-gray-800">{label}</span>
          </label>
        {/each}
      </div>
      <p class="font-mono text-[10px] text-gray-500 mt-1">Partner spend tracks what's paid by us and by the client — artist totals are unaffected.</p>
    </div>
    <div>
      <label for="amount" class="block font-mono text-xs text-gray-600 mb-1.5">Amount <span class="text-gray-400">(optional)</span></label>
      <input id="amount" name="amount" type="number" step="0.01" min="0" value={partner.amount ?? ''} placeholder="0.00" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
    </div>
  </div>

  <div class="grid sm:grid-cols-2 gap-4">
    <div>
      <label for="website" class="block font-mono text-xs text-gray-600 mb-1.5">Website</label>
      <input id="website" name="website" type="url" value={partner.website ?? ''} placeholder="https://" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
    </div>
    <div>
      <label for="contact" class="block font-mono text-xs text-gray-600 mb-1.5">Contact</label>
      <input id="contact" name="contact" type="text" value={partner.contact ?? ''} placeholder="email or phone" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black" />
    </div>
  </div>

  <div>
    <label for="notes" class="block font-mono text-xs text-gray-600 mb-1.5">Notes</label>
    <textarea id="notes" name="notes" rows="3" placeholder="What they bring, how they promote, any on-site details…" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-black">{partner.notes ?? ''}</textarea>
  </div>

  <div class="flex items-center gap-3">
    <button type="submit" class="px-4 py-2 bg-brand-yellow text-brand-black font-mono text-xs font-bold rounded hover:bg-yellow-300 transition-colors">{submitLabel}</button>
  </div>
</form>
