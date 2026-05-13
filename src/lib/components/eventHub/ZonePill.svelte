<script lang="ts">
  import type { ZoneColor } from './zoneColors';
  export let label: string;
  export let color: ZoneColor;
  export let size: 'sm' | 'md' = 'md';

  $: cls = size === 'sm'
    ? 'px-2 py-0.5 text-[10px]'
    : 'px-2.5 py-0.5 text-[11px]';
</script>

<span class="inline-flex items-center rounded-full border font-mono uppercase tracking-widest whitespace-nowrap {cls} {color.pill}">
  {label}
</span>
