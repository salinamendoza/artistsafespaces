<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import { organizationTypes, partnershipInterests } from '$lib/data/site';

  let formData = {
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    orgType: '',
    interests: [] as string[],
    message: ''
  };

  let submitting = false;
  let success = false;
  let error = '';

  function toggleInterest(interest: string) {
    if (formData.interests.includes(interest)) {
      formData.interests = formData.interests.filter(i => i !== interest);
    } else {
      formData.interests = [...formData.interests, interest];
    }
  }

  async function handleSubmit() {
    if (!formData.organizationName || !formData.contactName || !formData.email || !formData.orgType) {
      error = 'Please fill in all required fields.';
      return;
    }

    submitting = true;
    error = '';

    try {
      const res = await fetch('/api/apply/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      success = true;
    } catch (e: any) {
      error = e.message || 'Something went wrong. Please try again.';
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Partner With Us | Artist Safespaces</title>
  <meta name="description" content="Become a sponsor, city partner, or supporter. Help us build community art infrastructure across America." />
</svelte:head>

<!-- Hero Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto text-center">
      <SectionHeader
        eyebrow="Work With Us"
        title="Partner With Us"
        description="Whether you're a corporation, city, foundation, or individual, we'd love to explore how we can work together."
        centered={true}
      />
    </div>
  </div>
</section>

<!-- Partner Form -->
<section class="pb-20 md:pb-32">
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
    {#if success}
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center">
        <div class="w-16 h-16 mx-auto mb-6 bg-brand-black rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-brand-black font-display text-2xl font-bold mb-4">Inquiry Received!</h3>
        <p class="text-gray-600 mb-6">
          Thank you for your interest in partnering with Artist Safespaces. Our team will review your inquiry and reach out within 3-5 business days to discuss next steps.
        </p>
        <a href="/" class="text-brand-black font-semibold hover:underline">Return to homepage</a>
      </div>
    {:else}
      <form on:submit|preventDefault={handleSubmit} class="space-y-8">
        {#if error}
          <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
            {error}
          </div>
        {/if}

        <!-- Organization Name -->
        <div>
          <label for="organizationName" class="block text-brand-black font-medium mb-2">
            Organization Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="organizationName"
            bind:value={formData.organizationName}
            required
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
            placeholder="Your organization or company name"
          />
        </div>

        <!-- Contact Name -->
        <div>
          <label for="contactName" class="block text-brand-black font-medium mb-2">
            Contact Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contactName"
            bind:value={formData.contactName}
            required
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
            placeholder="Your full name"
          />
        </div>

        <!-- Email -->
        <div>
          <label for="email" class="block text-brand-black font-medium mb-2">
            Email <span class="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            bind:value={formData.email}
            required
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
            placeholder="your@email.com"
          />
        </div>

        <!-- Phone (optional) -->
        <div>
          <label for="phone" class="block text-brand-black font-medium mb-2">
            Phone <span class="text-gray-500">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            bind:value={formData.phone}
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
            placeholder="(555) 555-5555"
          />
        </div>

        <!-- Organization Type -->
        <div>
          <label for="orgType" class="block text-brand-black font-medium mb-2">
            Organization Type <span class="text-red-500">*</span>
          </label>
          <select
            id="orgType"
            bind:value={formData.orgType}
            required
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
          >
            <option value="" disabled>Select organization type</option>
            {#each organizationTypes as type}
              <option value={type}>{type}</option>
            {/each}
          </select>
        </div>

        <!-- Partnership Interest -->
        <div>
          <label class="block text-brand-black font-medium mb-4">
            Partnership Interest
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {#each partnershipInterests as interest}
              <button
                type="button"
                on:click={() => toggleInterest(interest)}
                class="px-4 py-3 rounded-lg border text-left transition-colors {formData.interests.includes(interest)
                  ? 'bg-brand-yellow/10 border-brand-yellow text-brand-black'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400'}"
              >
                <div class="flex items-center gap-3">
                  <div class="w-5 h-5 rounded border-2 flex items-center justify-center {formData.interests.includes(interest) ? 'bg-brand-yellow border-brand-yellow' : 'border-gray-500'}">
                    {#if formData.interests.includes(interest)}
                      <svg class="w-3 h-3 text-brand-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    {/if}
                  </div>
                  {interest}
                </div>
              </button>
            {/each}
          </div>
        </div>

        <!-- Message -->
        <div>
          <label for="message" class="block text-brand-black font-medium mb-2">
            Message / Additional Info <span class="text-gray-500">(optional)</span>
          </label>
          <textarea
            id="message"
            bind:value={formData.message}
            rows="4"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black resize-none"
            placeholder="Tell us more about your organization and what you're hoping to achieve..."
          ></textarea>
        </div>

        <!-- Submit -->
        <div class="pt-4">
          <Button type="submit" disabled={submitting} size="lg">
            {submitting ? 'Submitting...' : 'Submit Inquiry'}
          </Button>
        </div>
      </form>
    {/if}
  </div>
</section>
