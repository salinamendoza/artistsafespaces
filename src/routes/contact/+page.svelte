<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
  import { siteConfig } from '$lib/data/site';

  let formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  let submitting = false;
  let success = false;
  let error = '';

  async function handleSubmit() {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
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
  <title>Contact | Artist Safespaces</title>
  <meta name="description" content="Get in touch with Artist Safespaces. Questions about Art Parks, partnerships, or how to get involved? We'd love to hear from you." />
</svelte:head>

<!-- Hero Section -->
<section class="py-20 md:py-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto text-center">
      <SectionHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Questions, ideas, or just want to say hello? We'd love to hear from you."
        centered={true}
      />
    </div>
  </div>
</section>

<!-- Contact Section -->
<section class="pb-20 md:pb-32">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-3 gap-12">
      <!-- Contact Info -->
      <div class="lg:col-span-1">
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-8">
          <h3 class="text-brand-black font-semibold text-xl mb-6">Contact Info</h3>

          <div class="space-y-6">
            <div>
              <p class="text-gray-500 font-semibold text-sm uppercase tracking-widest mb-2">Email</p>
              <a href="mailto:{siteConfig.email.general}" class="text-brand-black hover:text-gray-600 transition-colors">
                {siteConfig.email.general}
              </a>
            </div>

            <div>
              <p class="text-gray-500 font-semibold text-sm uppercase tracking-widest mb-2">Follow Us</p>
              <div class="flex gap-4">
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-600 hover:text-brand-black transition-colors"
                  aria-label="Instagram"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href={siteConfig.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-600 hover:text-brand-black transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <hr class="my-8 border-gray-200" />

          <div class="space-y-4">
            <a href="/partners/apply" class="flex items-center gap-3 text-gray-600 hover:text-brand-black transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Partnership Inquiries
            </a>
            <a href="/artists/apply" class="flex items-center gap-3 text-gray-600 hover:text-brand-black transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Artist Applications
            </a>
            <a href="/donate" class="flex items-center gap-3 text-gray-600 hover:text-brand-black transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Donation Inquiries
            </a>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="lg:col-span-2">
        {#if success}
          <div class="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center">
            <div class="w-16 h-16 mx-auto mb-6 bg-brand-black rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-brand-black font-display text-2xl font-bold mb-4">Message Sent!</h3>
            <p class="text-gray-600 mb-6">
              Thank you for reaching out. We'll get back to you as soon as possible.
            </p>
            <a href="/" class="text-brand-black font-semibold hover:underline">Return to homepage</a>
          </div>
        {:else}
          <form on:submit|preventDefault={handleSubmit} class="space-y-6">
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
                placeholder="Your name"
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

            <!-- Subject -->
            <div>
              <label for="subject" class="block text-brand-black font-medium mb-2">
                Subject <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                bind:value={formData.subject}
                required
                class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
                placeholder="What's this about?"
              />
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-brand-black font-medium mb-2">
                Message <span class="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                bind:value={formData.message}
                required
                rows="6"
                class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-brand-black placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black resize-none"
                placeholder="Your message..."
              ></textarea>
            </div>

            <!-- Submit -->
            <div>
              <Button type="submit" disabled={submitting} size="lg">
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        {/if}
      </div>
    </div>
  </div>
</section>
