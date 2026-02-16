# Prompt for VS Code

I have a Next.js app that generates SEO-rich landing pages for gift cards. The app is in this workspace. Here's what I need you to do:

## Context
- Reference site for design/content quality: https://www.recharge.com/en/ie/amazon
- Gift card data is in `src/data/giftcards.json`
- Content generation is in `src/lib/openai.ts` — it calls OpenAI at build time, but falls back to mock content when no API key is set
- The mock content in the `mockContent()` function in `src/lib/openai.ts` is too generic and thin right now

## What needs improving

### 1. OpenAI prompt quality (`src/lib/openai.ts` → the `prompt` variable in `generateContent()`)

The current prompt is too vague and produces generic, thin content. Rewrite it to be much more specific and directive. Here's what to fix:

**Feed it ALL the card data, not just a summary.** Currently it only passes description, howToRedeem, expiry, and additionalTerms. Also pass in:
- `locations` (where the card can be used — this is critical for geo-targeted SEO)
- `contact` (support info)
- `countriesAvailableForUse` with full country names AND ISO codes
- `redeemableIn` countries
- `productCategories`

**Give it the reference site tone.** Add this to the system/prompt context:
> Write in the style of recharge.com product pages — professional but approachable, informative but not stuffy. Use second person ("you", "your loved ones"). Emphasise the international gifting angle — many buyers are sending gift cards to family abroad.

**Be much more specific about what each field should contain:**

- `aboutBody`: "Write 3 paragraphs. Paragraph 1: What is this gift card and what can it be used for — be specific about the platform/store. Paragraph 2: Who is it perfect for — mention the international gifting use case, specific countries where it works. Paragraph 3: How the purchase and delivery works on our platform. Use `<p>` tags. Include the brand name naturally for SEO. Do NOT use generic filler like 'perfect for any occasion'."
- `whyBuyBody`: "Write 3 paragraphs. Paragraph 1: The instant digital delivery advantage. Paragraph 2: The international/cross-border gifting angle — be specific about countries from the data. Paragraph 3: Trust and security. Use `<p>` tags."
- `faqs`: "Generate 6 FAQs. Each answer must be 2-4 sentences, not one-liners. Include FAQs about: (1) how to redeem step by step, (2) expiry/validity, (3) which countries it works in, (4) what happens to unused balance, (5) refund policy, (6) how quickly the code is delivered. Use the actual card data to make answers specific."
- `heroSubheadline`: "Must mention a specific benefit — e.g. the number of countries, instant delivery, or the platform's strength. Not generic."
- `metaTitle`: "Format: 'Buy {Brand} Gift Card Online | Instant Delivery to {top country or region}' — max 60 chars"
- `denominations`: "Use the correct currency for the card's primary market. If the card is redeemable in Pakistan, use PKR with values like 500, 1000, 2000, 5000. If USA, use USD. If multiple regions, default to USD."

**Add a few-shot example.** Include a short example of what good output looks like for one field so the model understands the quality bar:
```
Example of a good aboutBody for a similar product:
"<p>A Spotify Premium gift card gives your loved ones access to over 100 million songs, podcasts, and audiobooks — all ad-free. Whether they're in the United States, United Kingdom, or India, they can redeem the code and start listening instantly.</p><p>It's the perfect gift for music lovers living abroad. Simply purchase the card, receive the PIN code by email in under 30 seconds, and share it with anyone — no matter where in the world they are.</p><p>The balance is added directly to their Spotify account and can be used for Premium subscriptions, audiobook purchases, or any Spotify service. No physical card needed, no shipping delays.</p>"
```

### 2. Mock content quality (`src/lib/openai.ts` → `mockContent()`)
The fallback mock content is bland and repetitive. Make it **card-specific and rich**, using the actual data from each gift card's JSON (description, howToRedeem, expiry, additionalTerms, locations, contact, countriesAvailableForUse). 

For cards with rich data (like Amazon, Apple), the mock content should be nearly as good as what OpenAI would generate. For cards with sparse data (like BIGO Live, Daraz), generate sensible defaults but keep them honest — don't invent claims.

Specifically:
- **aboutBody**: Write 2-3 substantial HTML paragraphs using the card's `description`, `locations`, and `countriesAvailableForUse`. Mention specific countries. Mention what the card can be used for. Don't be generic.
- **whyBuyBody**: Write 2-3 paragraphs about why someone would buy THIS specific card — instant delivery, international gifting angle, the specific platform's strengths.
- **faqs**: Generate 5-6 FAQs that are genuinely useful. Pull from `howToRedeem`, `expiry`, `additionalTerms`, `locations`, and `contact`. Each answer should be detailed (2-4 sentences), not one-liners.
- **heroSubheadline**: Make it specific to the card, not generic "send a gift card instantly" boilerplate.
- **metaTitle** and **metaDescription**: SEO-optimised, include the brand name, "gift card", and a key country/region.
- **denominations**: Vary by card — not every card should be USD. If the card is for Pakistan (Daraz), use PKR. If for Qatar (BIGO Live), use QAR. Use realistic denominations for that market.

### 3. Landing page design (`src/app/[slug]/page.tsx`)
The current page layout is functional but could be richer. Looking at https://www.recharge.com/en/ie/amazon as reference:

- Add a **payment methods** visual row (Visa, Mastercard, PayPal, Apple Pay icons/badges) — not just text
- Add a **"How it works"** 3-step section with icons (1. Choose amount → 2. Pay securely → 3. Receive code instantly)
- The **How to Redeem** section should render the markdown-like content from the JSON more nicely (parse numbered lists, bold text, links)
- Add **related cards** section at the bottom (other cards available in the same countries)
- The hero section needs more visual weight — consider a subtle gradient or pattern background behind the card icon

### 4. Index page (`src/app/page.tsx`)
- Add a **search/filter** input at the top to filter cards by name
- Add **category pills** (gifts, shopping, popular) based on `productCategories` from the data
- Show the card's description as a subtitle in each card tile

### 5. SEO enhancements
- The JSON-LD structured data is good, keep it
- Add `<link rel="canonical">` tags
- Add Open Graph image meta tags (can use a placeholder pattern)
- Generate a `sitemap.xml` at build time listing all card pages

### 6. Delete `.content-cache.json` before rebuilding
The cached content from a previous build may override your improvements. Delete it so the mock content regenerates fresh.

## Don't change
- The overall project structure (Next.js App Router, Tailwind v4, TypeScript)
- The OpenAI integration approach (it's fine, just improve the fallback)
- The `giftcards.json` data file
