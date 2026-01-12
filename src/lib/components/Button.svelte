<script lang="ts">
  export let href: string | undefined = undefined;
  export let variant: 'primary' | 'secondary' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let type: 'button' | 'submit' = 'button';
  export let disabled: boolean = false;

  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-black focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-brand-black text-white hover:bg-gray-800 active:bg-gray-900',
    secondary: 'bg-transparent border-2 border-brand-black text-brand-black hover:bg-brand-black hover:text-white'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-lg'
  };

  $: classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
</script>

{#if href}
  <a {href} class={classes}>
    <slot />
  </a>
{:else}
  <button {type} {disabled} class={classes} on:click>
    <slot />
  </button>
{/if}
