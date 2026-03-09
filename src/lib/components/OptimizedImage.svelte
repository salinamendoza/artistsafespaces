<script lang="ts">
  export let src: string;
  export let alt: string;
  export let aspect: 'square' | 'video' | '4/3' | '3/4' | 'auto' = 'square';
  export let rounded: string = 'rounded-xl';
  export let eager: boolean = false;
  export let sizes: string = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  const aspectClass: Record<string, string> = {
    square: 'aspect-square',
    video: 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/4': 'aspect-[3/4]',
    auto: ''
  };
</script>

<div class="{aspectClass[aspect]} {rounded} overflow-hidden bg-gray-100">
  <img
    {src}
    {alt}
    {sizes}
    loading={eager ? 'eager' : 'lazy'}
    decoding="async"
    class="w-full h-full object-cover transition-opacity duration-300"
  />
</div>
