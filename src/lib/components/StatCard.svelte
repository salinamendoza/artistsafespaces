<script lang="ts">
  export let value: string;
  export let label: string;
</script>

<div class="text-center p-6">
  <p class="text-brand-yellow font-display text-4xl md:text-5xl font-bold mb-2">
    {value}
  </p>
  <p class="text-gray-300 text-sm uppercase tracking-wide">
    {label}
  </p>
</div>
