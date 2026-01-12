<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  let investment = 125000;

  const displayValue = tweened(investment, {
    duration: 300,
    easing: cubicOut
  });

  $: displayValue.set(investment);

  // Calculate impacts based on investment
  $: parks = investment >= 250000 ? 2 : 1;
  $: years = investment >= 125000 ? 4 : investment >= 100000 ? 3 : investment >= 75000 ? 2 : 1;
  $: events = years * 12;
  $: muralSqFt = parks * 600 * years;
  $: artistsCompensated = events * 5;
  $: isFoundingSponsor = investment >= 125000;
  $: hasExtendedProgramming = investment >= 250000;

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  // Impact items with their unlock thresholds
  $: impacts = [
    {
      icon: '🏛️',
      value: parks,
      label: parks === 1 ? 'Art Park Launched' : 'Art Parks Launched',
      unlocked: true
    },
    {
      icon: '📅',
      value: years,
      label: years === 1 ? 'Year of Operations' : 'Years of Operations',
      unlocked: true
    },
    {
      icon: '🎨',
      value: events,
      label: 'Community Events',
      unlocked: true
    },
    {
      icon: '🖼️',
      value: muralSqFt.toLocaleString(),
      label: 'Sq Ft of Mural Space',
      unlocked: true
    },
    {
      icon: '👩‍🎨',
      value: `${artistsCompensated}+`,
      label: 'Artists Compensated',
      unlocked: true
    },
    {
      icon: '✨',
      value: '',
      label: 'Extended Programming Fund',
      unlocked: hasExtendedProgramming,
      isBonus: true
    }
  ];
</script>

<div class="bg-brand-black rounded-2xl p-8 md:p-12 border border-white/10">
  <!-- Header -->
  <div class="text-center mb-10">
    <p class="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-3">Impact Calculator</p>
    <h3 class="text-white font-display text-3xl md:text-4xl font-bold">See What You Build</h3>
  </div>

  <!-- Investment Display -->
  <div class="text-center mb-8">
    <p class="text-gray-400 text-sm mb-2">Your Investment</p>
    <p class="text-brand-yellow font-display text-5xl md:text-6xl font-bold">
      {formatCurrency($displayValue)}
    </p>
    {#if isFoundingSponsor}
      <span class="inline-block mt-4 px-4 py-2 bg-brand-yellow text-brand-black text-sm font-bold rounded-full animate-pulse">
        Founding Sponsor
      </span>
    {/if}
  </div>

  <!-- Slider -->
  <div class="mb-12 px-4">
    <input
      type="range"
      min="50000"
      max="250000"
      step="25000"
      bind:value={investment}
      class="w-full h-3 rounded-full appearance-none cursor-pointer slider-thumb"
      style="background: linear-gradient(to right, #fbfc53 0%, #fbfc53 {((investment - 50000) / 200000) * 100}%, rgba(255,255,255,0.2) {((investment - 50000) / 200000) * 100}%, rgba(255,255,255,0.2) 100%);"
    />
    <div class="flex justify-between mt-3 text-sm text-gray-500">
      <span>$50K</span>
      <span>$125K</span>
      <span>$250K</span>
    </div>
  </div>

  <!-- You're Building Section -->
  <div class="bg-white/5 rounded-xl p-6 md:p-8">
    <p class="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-6 text-center">
      You're Building
    </p>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {#each impacts.filter(i => i.unlocked) as impact (impact.label)}
        <div
          class="text-center p-4 rounded-lg transition-all duration-300 {impact.isBonus ? 'bg-brand-yellow/10 border border-brand-yellow/30' : ''}"
          class:scale-105={impact.isBonus}
        >
          <span class="text-3xl md:text-4xl block mb-2">{impact.icon}</span>
          {#if impact.value}
            <p class="text-white font-display text-2xl md:text-3xl font-bold">{impact.value}</p>
          {/if}
          <p class="text-gray-400 text-sm mt-1">{impact.label}</p>
        </div>
      {/each}
    </div>
  </div>

  <!-- CTA -->
  <div class="mt-10 text-center">
    <a
      href="/partners/apply"
      class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-brand-yellow text-brand-black hover:bg-yellow-300 transition-colors"
    >
      Become a {isFoundingSponsor ? 'Founding ' : ''}Sponsor
    </a>
  </div>
</div>

<style>
  .slider-thumb::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #fbfc53;
    cursor: pointer;
    border: 4px solid #1a1a1a;
    box-shadow: 0 0 0 4px rgba(251, 252, 83, 0.3);
    transition: box-shadow 0.2s ease;
  }

  .slider-thumb::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 8px rgba(251, 252, 83, 0.3);
  }

  .slider-thumb::-moz-range-thumb {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #fbfc53;
    cursor: pointer;
    border: 4px solid #1a1a1a;
    box-shadow: 0 0 0 4px rgba(251, 252, 83, 0.3);
    transition: box-shadow 0.2s ease;
  }

  .slider-thumb::-moz-range-thumb:hover {
    box-shadow: 0 0 0 8px rgba(251, 252, 83, 0.3);
  }
</style>
