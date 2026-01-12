<script lang="ts">
  export let value: string;
  export let label: string;
  export let dark: boolean = false;
</script>

<div class="text-center p-6">
  <p class="font-display text-4xl md:text-5xl font-bold mb-2" class:text-brand-black={!dark} class:text-brand-yellow={dark}>
    {value}
  </p>
  <p class="text-sm uppercase tracking-wide" class:text-gray-600={!dark} class:text-gray-300={dark}>
    {label}
  </p>
</div>
