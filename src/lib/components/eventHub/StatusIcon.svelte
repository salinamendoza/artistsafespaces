<script lang="ts">
  import type { TaskStatus } from '$lib/types/db-types';
  export let status: TaskStatus;
  export let size: 'sm' | 'md' = 'md';

  $: dim = size === 'sm' ? 'w-4 h-4' : 'w-[18px] h-[18px]';
  $: stroke = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';
</script>

{#if status === 'done'}
  <span class="inline-flex items-center justify-center {dim} rounded-sm border border-green-600 text-green-700" aria-label="Done">
    <svg viewBox="0 0 16 16" class={stroke} fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="3 8 7 12 13 4" />
    </svg>
  </span>
{:else if status === 'blocked'}
  <span class="inline-block {dim} rounded-sm border border-amber-500" aria-label="Blocked"></span>
{:else}
  <span class="inline-block {dim} rounded-sm border border-gray-300" aria-label="Open"></span>
{/if}
