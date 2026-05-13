<script lang="ts">
  import type { TaskStatus } from '$lib/types/db-types';
  export let status: TaskStatus;
  export let size: 'sm' | 'md' = 'md';

  $: dim = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
</script>

{#if status === 'done'}
  <span class="inline-flex items-center justify-center {dim} rounded border border-green-300 bg-green-50 text-green-700" aria-label="Done">
    <svg viewBox="0 0 16 16" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="3 8 7 12 13 4" />
    </svg>
  </span>
{:else if status === 'blocked'}
  <span class="inline-flex items-center justify-center {dim} rounded border-2 border-amber-400 bg-amber-50" aria-label="Blocked">
    <span class="w-1.5 h-1.5 rounded-sm bg-amber-500"></span>
  </span>
{:else}
  <span class="inline-block {dim} rounded border border-gray-300 bg-white" aria-label="Open"></span>
{/if}
