<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<svelte:head>
  <title>Admin Login | Artist Safespaces</title>
</svelte:head>

<div class="min-h-screen bg-white flex items-center justify-center px-4">
  <div class="w-full max-w-sm">
    <h1 class="font-mono text-brand-black text-2xl font-bold mb-8 text-center">admin</h1>

    {#if form?.error}
      <div class="mb-4 px-4 py-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-300 text-sm font-mono">
        {form.error}
      </div>
    {/if}

    <form method="POST" use:enhance class="space-y-4">
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        autocomplete="current-password"
        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-brand-black font-mono placeholder:text-gray-400 focus:outline-none focus:border-brand-yellow/50"
      />
      <button
        type="submit"
        class="w-full px-4 py-3 bg-brand-yellow text-brand-black font-mono font-bold rounded-lg hover:bg-brand-yellow/90 transition-colors"
      >
        Log in
      </button>
    </form>
  </div>
</div>
