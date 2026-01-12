<script lang="ts">
  export let eyebrow: string | undefined = undefined;
  export let title: string;
  export let description: string | undefined = undefined;
  export let centered: boolean = false;
</script>

<div class={centered ? 'text-center' : ''}>
  {#if eyebrow}
    <p class="text-brand-yellow text-sm font-semibold uppercase tracking-widest mb-3">
      {eyebrow}
    </p>
  {/if}
  <h2 class="font-display text-4xl md:text-5xl font-bold text-white mb-4">
    {title}
  </h2>
  {#if description}
    <p class="text-gray-300 text-lg md:text-xl max-w-3xl {centered ? 'mx-auto' : ''}">
      {description}
    </p>
  {/if}
</div>
