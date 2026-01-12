# Artist Safespaces Website - Claude Code Implementation Prompt

Build a complete SvelteKit website for Artist Safespaces, a 501(c)(3) nonprofit creating free public art parks and running annual Art Therapy festivals.

## Tech Stack

- SvelteKit (latest)
- TypeScript
- Tailwind CSS v4
- @sveltejs/adapter-cloudflare (for Cloudflare Pages deployment)
- Static assets only, no database

## Brand Identity

### Colors
```
Yellow (Primary): #fbfc53
Black: #1a1a1a
White: #ffffff
```

### Fonts (Google Fonts)
```
Display: Playfair Display (headings, hero text)
Body: DM Sans (paragraphs, UI)
Mono: JetBrains Mono (optional, for any code/technical)
```

### Design Aesthetic
- Bold, high-contrast black backgrounds with yellow accents
- Clean, modern nonprofit feel
- Yellow used for CTAs, highlights, and key elements
- White text on dark backgrounds
- Generous whitespace
- No generic stock photo vibes - authentic community art feel

## Logo Assets

You'll need two logo files in `/static/`:
- `logo-icon.png` - Small "A" icon for favicon/header
- `logo-full.png` - Full "Artist Safespaces" wordmark for footer

(User will provide these separately)

## Site Architecture

```
/                       → Homepage
/art-parks              → Art Parks program overview
/art-parks/sponsors     → Corporate sponsor information
/art-parks/cities       → City partnership information
/art-therapy            → Annual Art Therapy Festival
/artists                → For artists - why join
/artists/apply          → Artist application form
/partners/apply         → Partner/sponsor application form
/about                  → About the organization
/donate                 → Donation page
/contact                → Contact form
```

## Centralized Data Structure

Create `/src/lib/data/site.ts` with all site content. This makes updates easy:

```typescript
export const siteConfig = {
  name: 'Artist Safespaces',
  tagline: 'Building the infrastructure for human connection in the automation era.',
  founded: 2020,
  email: {
    general: 'hello@artistsafespaces.org',
    donate: 'donate@artistsafespaces.org'
  },
  socials: {
    instagram: 'https://instagram.com/artistsafespaces',
    linkedin: 'https://linkedin.com/company/artistsafespaces'
  }
};

export const stats = [
  { value: '6+', label: 'Years of Advocacy' },
  { value: '$125K', label: '4-Year Park Investment' },
  { value: '100%', label: 'Artist Compensation' },
  { value: '0', label: 'Cost to Cities' }
];

export const artParkFeatures = [
  {
    title: 'Double-Sided Mural Walls',
    description: 'Permanent canvases for rotating community art'
  },
  {
    title: 'Permanent Installed Easels',
    description: 'Drop in and paint anytime with library card access'
  },
  {
    title: 'Small Stage Area',
    description: 'For spoken word, music, and performances'
  },
  {
    title: 'Secure Perimeter',
    description: 'Fencing with library card tap-in access system'
  },
  {
    title: 'Artist Storage Units',
    description: 'Secure container storage for supplies and works'
  },
  {
    title: 'All-White Design',
    description: 'Easy maintenance and fresh canvas aesthetic'
  }
];

export const financialModel = {
  setup: 25000,
  annualOps: 25000,
  yearOne: 50000,
  yearsTwo4: 25000,
  totalInvestment: 125000,
  breakdown: {
    maintenance: 15000,
    programming: 10000
  }
};

export const artTherapyThemes = [
  { year: 2024, theme: 'Present', description: 'Being here, now' },
  { year: 2025, theme: 'Anxiety', description: 'Confronting what weighs on us' },
  { year: 2026, theme: 'Understanding', description: 'Finding clarity together' }
];

export const trackRecord = [
  'Founded 2020 as nonprofit',
  '6+ years building offline events and safe spaces',
  'Established corporate partnerships (IKEA)',
  'Board membership at United Way level',
  'Successfully negotiated standard market-rate artist compensation',
  'Festival experience with large retail partners'
];
```

## Component Structure

### Layout Components

**Header.svelte**
- Fixed/sticky navigation
- Logo on left
- Nav links: Art Parks, Art Therapy, Artists, About
- CTA button: "Partner With Us" → /partners/apply
- Mobile hamburger menu
- Black background, white text, yellow hover states

**Footer.svelte**
- 3-column layout on desktop
- Column 1: Logo + tagline
- Column 2: Quick links (all pages)
- Column 3: Contact info + social icons
- Bottom: © 2024 Artist Safespaces. 501(c)(3) nonprofit.
- Dark background (#1a1a1a)

### Shared Components

**Button.svelte** - Reusable button with variants:
- Primary: Yellow bg, black text
- Secondary: Transparent, yellow border, yellow text
- Props: href, variant, size

**SectionHeader.svelte** - Consistent section titles:
- Eyebrow text (small, yellow, uppercase)
- Main heading (large, white)
- Optional description

**StatCard.svelte** - For displaying statistics:
- Large number/value
- Label underneath
- Yellow accent

## Page Content Details

### Homepage (/)

**Hero Section**
- Full viewport height, black bg
- Large headline: "Free Art Parks for Every City"
- Subhead: "We're building permanent creative spaces where anyone can paint, perform, and connect—no studio required."
- Two CTAs: "Learn About Art Parks" (primary) → /art-parks, "Partner With Us" (secondary) → /partners/apply
- Subtle yellow accent elements

**Stats Bar**
- Horizontal row of 4 stats (use stats array from data)
- Black bg with yellow numbers

**The Problem Section**
- Headline: "The Problem"
- Content about disappearing third spaces, youth lacking creative outlets, arts priced out of communities, rising isolation

**The Solution Section**
- Headline: "Art Parks: A New Model"
- Brief explanation of the concept
- Link to learn more → /art-parks

**Art Therapy Preview**
- Headline: "Art Therapy Festival"
- Brief about annual mental health awareness festival
- Current year theme highlight (2025: Anxiety)
- Link → /art-therapy

**CTA Section**
- "Ready to bring an Art Park to your city?"
- Two paths: For Sponsors, For Cities

### Art Parks (/art-parks)

**Hero**
- Headline: "Community Art Parks"
- Subhead: "Free, public creative spaces providing accessible venues for painting, spoken word, music, and artistic expression."

**What's Included**
- Grid of features (use artParkFeatures array)
- Icon + title + description for each

**Financial Model Overview**
- Visual breakdown of costs
- $25K setup, $25K/year operations
- Total 4-year investment: $125K

**Two CTAs**
- "For Corporate Sponsors" → /art-parks/sponsors
- "For City Partners" → /art-parks/cities

### Sponsors Page (/art-parks/sponsors)

**Hero**
- Headline: "Sponsor an Art Park"
- Subhead: "A 4-year investment in permanent community infrastructure"

**Investment Breakdown**
- Year 1: $50,000 (setup + operations)
- Years 2-4: $25,000/year
- Total: $125,000

**What Sponsors Get**
- Naming rights for 4 years
- Monthly branded event hosting (12 events/year)
- ESG/community investment metrics
- Content and marketing opportunities
- Permanent infrastructure with lasting goodwill

**ROI Comparison**
- $125K over 4 years vs traditional advertising
- Authentic community engagement vs transactional ads
- Quarterly touchpoints through events

**CTA**
- "Become a Founding Sponsor" → /partners/apply

### Cities Page (/art-parks/cities)

**Hero**
- Headline: "Partner With Us"
- Subhead: "Zero budget impact. Permanent community infrastructure."

**What Cities Provide**
- Underutilized land (vacant lots, unused park areas, school grounds)
- Daily maintenance using existing staff
- Library card system integration

**What Cities Receive**
- Zero budget impact (fully sponsor-funded)
- Permanent community infrastructure
- Enhanced cultural programming
- Increased library card adoption
- Solutions for underutilized spaces

**What Cities DON'T Do**
- Take from existing park budgets
- Handle fundraising
- Manage corporate relationships

**Library Card Integration**
- Explain tap-in gating system
- Leverages existing infrastructure
- Equitable access for all residents

**CTA**
- "Explore a Partnership" → /partners/apply

### Art Therapy (/art-therapy)

**Hero**
- Headline: "Art Therapy Festival"
- Subhead: "Annual mental health awareness through creative expression"

**About the Festival**
- One-day annual event
- Partnership with major retailers (IKEA mentioned as past partner)
- Focus on mental health awareness
- All artists compensated at market rates

**Theme Timeline**
- Visual timeline showing past/current/future themes
- 2024: Present
- 2025: Anxiety (current - highlight this)
- 2026: Understanding

**What Happens**
- Live mural painting
- Spoken word performances
- DJ sets
- Interactive art stations
- Community workshops

**Artist Participation**
- "We pay artists. Always."
- Explain standard market-rate compensation
- Link to apply → /artists/apply

### Artists (/artists)

**Hero**
- Headline: "Create With Us"
- Subhead: "Get paid to do what you love. Build community through art."

**Why Join**
- Market-rate compensation (always)
- No gatekeeping or barriers
- Community of fellow artists
- Exposure through festivals and parks
- Long-term partnership opportunities

**Opportunities**
- Art Therapy Festival performances
- Art Park murals and installations
- Workshop facilitation
- Ongoing commissioned work

**CTA**
- "Apply to Join" → /artists/apply

### Artist Application (/artists/apply)

**Form Fields**
- Name (required)
- Email (required)
- Location/City (required)
- Website URL (optional)
- Instagram handle (optional)
- Primary art style/medium (select: Visual Art, Music/DJ, Spoken Word, Dance/Performance, Workshop Facilitation, Other)
- Bio/About your work (textarea, required)
- What events interest you? (checkboxes: Live Mural Painting, Workshops, Live Art Performances, Commissioned Work)
- How did you hear about us? (optional)

**Form Behavior**
- Client-side validation
- Success state with confirmation message
- Note: Form submission placeholder - will need backend integration (Formspark, Cloudflare Workers, etc.)

### Partner Application (/partners/apply)

**Form Fields**
- Organization Name (required)
- Contact Name (required)
- Email (required)
- Phone (optional)
- Organization Type (select: Corporation, City/Municipality, Foundation, Individual, Other)
- Partnership Interest (checkboxes: Sponsor an Art Park, Host Art Therapy Event, Provide Land/Space, General Inquiry)
- Message/Additional Info (textarea)

### About (/about)

**Hero**
- Headline: "About Artist Safespaces"
- Subhead: "Building the infrastructure for human connection in the automation era."

**Our Story**
- Founded in 2020
- Started as response to disappearing creative spaces
- Evolved from events to permanent infrastructure model

**Track Record**
- List accomplishments (use trackRecord array)
- Mention IKEA partnership
- United Way board level involvement

**The Bigger Picture**
- Timing: AI/automation driving need for physical connection
- Market gap: Third spaces disappearing
- Mission: Remove barriers to artistic expression
- Vision: Art parks in every city across America

### Donate (/donate)

**Hero**
- Headline: "Support Our Mission"

**Important Notice**
- Prominent notice: "We are currently transitioning to 501(c)(3) status. During this transition, donations are NOT tax-deductible."
- Be transparent and clear about this

**How to Donate**
- Email donate@artistsafespaces.org for donation inquiries
- Explain what donations support:
  - Artist compensation
  - Festival production
  - Park development advocacy
  - Community programming

**Other Ways to Help**
- Partner with us
- Spread the word
- Apply as an artist

### Contact (/contact)

**Form Fields**
- Name (required)
- Email (required)
- Subject (required)
- Message (textarea, required)

**Contact Info**
- Email: hello@artistsafespaces.org
- Social links

## Tailwind v4 Setup

Use the new Tailwind v4 syntax:

**postcss.config.js**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
};
```

**src/app.css**
```css
@import "tailwindcss";

@theme {
  --color-brand-yellow: #fbfc53;
  --color-brand-black: #1a1a1a;
  --font-display: "Playfair Display", serif;
  --font-body: "DM Sans", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

**src/app.html** - Add Google Fonts in head:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Cloudflare Pages Config

**svelte.config.js**
```javascript
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
};

export default config;
```

## Form Handling Notes

Forms should have placeholder submission logic for now. Structure them so it's easy to add:
- Cloudflare Workers backend
- Formspark (https://formspark.io)
- Any other form service

Example placeholder:
```typescript
async function handleSubmit() {
  submitting = true;
  // TODO: Replace with actual form submission
  // await fetch('https://submit-form.com/YOUR_ID', { ... })
  await new Promise(r => setTimeout(r, 1000)); // Simulate delay
  success = true;
  submitting = false;
}
```

## Key Design Notes

1. **No bullet points in prose** - Use flowing paragraphs, not lists
2. **Yellow sparingly** - CTAs, accents, highlights only
3. **Generous padding** - Sections should breathe
4. **Mobile-first** - Ensure all layouts work on mobile
5. **Accessibility** - Proper contrast, aria-labels on icon links, semantic HTML
6. **Fast** - Minimal JS, leverage SvelteKit's SSR

## File Structure

```
src/
├── app.css
├── app.html
├── lib/
│   ├── components/
│   │   ├── Header.svelte
│   │   ├── Footer.svelte
│   │   ├── Button.svelte
│   │   ├── SectionHeader.svelte
│   │   └── StatCard.svelte
│   └── data/
│       └── site.ts
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte
│   ├── art-parks/
│   │   ├── +page.svelte
│   │   ├── sponsors/
│   │   │   └── +page.svelte
│   │   └── cities/
│   │       └── +page.svelte
│   ├── art-therapy/
│   │   └── +page.svelte
│   ├── artists/
│   │   ├── +page.svelte
│   │   └── apply/
│   │       └── +page.svelte
│   ├── partners/
│   │   └── apply/
│   │       └── +page.svelte
│   ├── about/
│   │   └── +page.svelte
│   ├── donate/
│   │   └── +page.svelte
│   └── contact/
│       └── +page.svelte
static/
├── logo-icon.png
└── logo-full.png
```

## Getting Started Commands

```bash
npm create svelte@latest artistsafespaces
cd artistsafespaces
npm install
npm install -D @tailwindcss/postcss tailwindcss @sveltejs/adapter-cloudflare
npm run dev
```

## Summary

Build a complete, production-ready website for Artist Safespaces nonprofit. Focus on:
- Clean, bold design with the yellow/black brand
- All content from the centralized data file
- Mobile-responsive layouts
- Accessible markup
- Easy-to-extend form placeholders
- Cloudflare Pages deployment ready

The site should feel professional, authentic, and community-focused—not like generic nonprofit template. Make it something artists would be proud to share.
