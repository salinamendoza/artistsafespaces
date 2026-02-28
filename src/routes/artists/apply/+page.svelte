<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import { artistMediums, artistInterests } from '$lib/data/site';

  let formData = {
    name: '',
    email: '',
    location: '',
    website: '',
    instagram: '',
    medium: '',
    bio: '',
    interests: [] as string[],
    referral: ''
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
    if (!formData.name || !formData.email || !formData.location || !formData.medium || !formData.bio) {
      error = 'Please fill in all required fields.';
      return;
    }

    submitting = true;
    error = '';

    try {
      // TODO: Replace with actual form submission
      // await fetch('https://submit-form.com/YOUR_ID', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      await new Promise(r => setTimeout(r, 1000)); // Simulate delay
      success = true;
    } catch (e) {
      error = 'Something went wrong. Please try again.';
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Apply as Artist | Artist Safespaces</title>
  <meta name="description" content="Join our network of compensated artists. Apply to perform at Art Therapy, create murals, lead workshops, and more." />
</svelte:head>

<!-- Hero Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto text-center">
      <SectionHeader
        eyebrow="Join Us"
        title="Apply as Artist"
        description="Tell us about yourself and your work. We'll be in touch about upcoming opportunities."
        centered={true}
      />
    </div>
  </div>
</section>

<!-- Application Form -->
<section class="pb-20 md:pb-32">
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
    {#if success}
      <div class="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center">
        <div class="w-16 h-16 mx-auto mb-6 bg-brand-black rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-brand-black font-display text-2xl font-bold mb-4">Application Received!</h3>
        <p class="text-gray-600 mb-6">
          Thank you for your interest in Artist Safespaces. We'll review your application and reach out about upcoming opportunities that match your skills and interests.
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

        <!-- Name -->
        <div>
          <label for="name" class="block text-brand-black font-medium mb-2">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            bind:value={formData.name}
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

        <!-- Location -->
        <div>
          <label for="location" class="block text-brand-black font-medium mb-2">
            Location / City <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            bind:value={formData.location}
            required
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
            placeholder="City, State"
          />
        </div>

        <!-- Website (optional) -->
        <div>
          <label for="website" class="block text-brand-black font-medium mb-2">
            Website URL <span class="text-gray-500">(optional)</span>
          </label>
          <input
            type="url"
            id="website"
            bind:value={formData.website}
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
            placeholder="https://yoursite.com"
          />
        </div>

        <!-- Instagram (optional) -->
        <div>
          <label for="instagram" class="block text-brand-black font-medium mb-2">
            Instagram Handle <span class="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            id="instagram"
            bind:value={formData.instagram}
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
            placeholder="@yourhandle"
          />
        </div>

        <!-- Medium -->
        <div>
          <label for="medium" class="block text-brand-black font-medium mb-2">
            Primary Art Style / Medium <span class="text-red-500">*</span>
          </label>
          <select
            id="medium"
            bind:value={formData.medium}
            required
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
          >
            <option value="" disabled>Select your primary medium</option>
            {#each artistMediums as medium}
              <option value={medium}>{medium}</option>
            {/each}
          </select>
        </div>

        <!-- Bio -->
        <div>
          <label for="bio" class="block text-brand-black font-medium mb-2">
            About Your Work <span class="text-red-500">*</span>
          </label>
          <textarea
            id="bio"
            bind:value={formData.bio}
            required
            rows="4"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black resize-none"
            placeholder="Tell us about your artistic practice, style, and experience..."
          ></textarea>
        </div>

        <!-- Interests -->
        <div>
          <label class="block text-brand-black font-medium mb-4">
            What events interest you?
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {#each artistInterests as interest}
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

        <!-- Referral (optional) -->
        <div>
          <label for="referral" class="block text-brand-black font-medium mb-2">
            How did you hear about us? <span class="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            id="referral"
            bind:value={formData.referral}
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
            placeholder="Instagram, friend, event, etc."
          />
        </div>

        <!-- Submit -->
        <div class="pt-4">
          <Button type="submit" disabled={submitting} size="lg">
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    {/if}
  </div>
</section>
