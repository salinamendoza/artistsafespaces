<script lang="ts">
  import type { ZoneColor } from './zoneColors';
  export let label: string;
  export let color: ZoneColor;
  export let size: 'sm' | 'md' = 'md';

  $: cls = size === 'sm'
    ? 'px-2 py-0.5 text-[10px]'
    : 'px-2.5 py-1 text-[11px]';
</script>

<span class="inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-widest whitespace-nowrap {cls} {color.pill}">
  <span class="w-1.5 h-1.5 rounded-full {color.dot}"></span>
  {label}
</span>
