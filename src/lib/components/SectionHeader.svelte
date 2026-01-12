<script lang="ts">
  export let eyebrow: string | undefined = undefined;
  export let title: string;
  export let description: string | undefined = undefined;
  export let centered: boolean = false;
  export let dark: boolean = false;
</script>

<div class={centered ? 'text-center' : ''}>
  {#if eyebrow}
    <p class="text-brand-black/60 text-sm font-semibold uppercase tracking-widest mb-3" class:text-brand-yellow={dark}>
      {eyebrow}
    </p>
  {/if}
  <h2 class="font-display text-4xl md:text-5xl font-bold mb-4" class:text-brand-black={!dark} class:text-white={dark}>
    {title}
  </h2>
  {#if description}
    <p class="text-lg md:text-xl max-w-3xl {centered ? 'mx-auto' : ''}" class:text-gray-600={!dark} class:text-gray-300={dark}>
      {description}
    </p>
  {/if}
</div>
