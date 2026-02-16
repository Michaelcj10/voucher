import OpenAI from "openai";
import giftcards from "./data/giftcards.json";

export interface GeneratedContent {
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutTitle: string;
  aboutBody: string;
  whyBuyTitle: string;
  whyBuyBody: string;
  faqs: { question: string; answer: string }[];
  denominations: { value: number; currency: string; label: string }[];
}

type GiftCard = (typeof giftcards)[number];

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const client = OPENAI_API_KEY
  ? new OpenAI({
      apiKey: OPENAI_API_KEY,
    })
  : null;

export async function generateContent(
  card: GiftCard,
): Promise<GeneratedContent> {
  if (!client) {
    console.warn(
      `[openai] No API key set — using mock content for "${card.name}"`,
    );
    return mockContent(card);
  }

  const prompt = `You are a senior SEO copywriter for a gift card e-commerce site similar to recharge.com. Your tone is professional but approachable — informative, not stuffy. Use second person ("you", "your loved ones"). Emphasise the international gifting angle — many buyers are purchasing gift cards to send to family and friends living abroad.

Generate JSON content for a landing page selling "${card.name}" gift cards.

=== CARD DATA ===
Card name: ${card.name}
Description: ${card.description ?? "N/A"}
Available for use in: ${card.countriesAvailableForUse.map((c) => `${c.name} (${c.iso})`).join(", ")}
Redeemable in: ${card.countriesAvailableForUse.map((c) => `${c.name} (${c.iso})`).join(", ")}
How to redeem: ${card.howToRedeem ?? "N/A"}
Expiry: ${card.expiry ?? "N/A"}
Additional terms: ${card.additionalTerms ?? "N/A"}
Where to use: ${card.locations ?? "N/A"}
Support/contact: ${card.contact ?? "N/A"}
Categories: ${card.productCategories.join(", ")}

=== OUTPUT FORMAT ===
Return ONLY valid JSON with this exact shape:
{
  "metaTitle": "SEO page title. Format: 'Buy {Brand} Gift Card Online | Instant Delivery to {top country or region}'. Max 60 chars.",
  "metaDescription": "SEO meta description. Mention the brand, instant delivery, and a key country. Max 155 chars.",
  "heroHeadline": "Short punchy headline, 3-8 words. Include the brand name.",
  "heroSubheadline": "1-2 sentences. Must mention a SPECIFIC benefit — e.g. the number of countries it works in, instant delivery, or what the platform offers. NOT generic filler like 'the perfect gift for any occasion'.",
  "aboutTitle": "Section heading, e.g. 'About {Brand} Gift Cards'",
  "aboutBody": "3 paragraphs wrapped in <p> tags. Paragraph 1: What is this gift card and what can the recipient use it for — be specific about the platform/store and its products. Paragraph 2: Who is it perfect for — mention the international gifting use case and name specific countries from the data. Paragraph 3: How the purchase and delivery works — instant digital delivery, code by email, ready to redeem. Include the brand name naturally 2-3 times for SEO. Do NOT use generic filler.",
  "whyBuyTitle": "Section heading, e.g. 'Why Buy a {Brand} Gift Card?'",
  "whyBuyBody": "3 paragraphs wrapped in <p> tags. Paragraph 1: The instant digital delivery advantage — no shipping, no waiting, code arrives in seconds. Paragraph 2: The international/cross-border gifting angle — name specific countries from the data, explain why this matters for expats and families abroad. Paragraph 3: Trust, security, and payment flexibility.",
  "faqs": [
    { "question": "string", "answer": "string — 2-4 sentences, not one-liners. Can include basic HTML like <strong> and <a> tags." }
  ],
  "denominations": [
    { "value": 10, "currency": "USD", "label": "$10" }
  ]
}

=== FAQ REQUIREMENTS ===
Generate exactly 6 FAQs. Use the actual card data to make answers specific. Include:
1. How to redeem this gift card (step-by-step from the redemption data)
2. Does it expire? (use the expiry data)
3. Which countries can I use it in? (list specific countries)
4. What happens to unused balance?
5. Can I get a refund? (use the terms data)
6. How quickly will I receive my code?

=== DENOMINATION REQUIREMENTS ===
Generate 4-6 denominations. Use the CORRECT currency for the card's primary market:
- If redeemable in USA: USD ($10, $25, $50, $100, $200)
- If redeemable in Pakistan: PKR (₨500, ₨1000, ₨2000, ₨5000)
- If redeemable in Qatar: QAR (50 QAR, 100 QAR, 200 QAR, 500 QAR)
- If redeemable in multiple regions including USA: default to USD
- Use realistic values for that market

=== QUALITY EXAMPLE ===
Here is an example of a good aboutBody for reference:
"<p>A Spotify Premium gift card gives your loved ones access to over 100 million songs, podcasts, and audiobooks — all ad-free. Whether they're in the United States, United Kingdom, or India, they can redeem the code and start listening instantly.</p><p>It's the perfect gift for music lovers living abroad. Simply purchase the card, receive the PIN code by email in under 30 seconds, and share it with anyone — no matter where in the world they are.</p><p>The balance is added directly to their Spotify account and can be used for Premium subscriptions, audiobook purchases, or any Spotify service. No physical card needed, no shipping delays.</p>"

Match this quality and specificity. Do NOT produce generic filler content.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("Empty response from OpenAI");

    return JSON.parse(raw) as GeneratedContent;
  } catch (err) {
    console.error(`[openai] Error generating content for ${card.name}:`, err);
    return mockContent(card);
  }
}

function mockContent(card: GiftCard): GeneratedContent {
  const countries = card.countriesAvailableForUse.map((c) => c.name).join(", ");
  const primaryCountry = card.countriesAvailableForUse[0]?.name ?? "worldwide";

  return {
    metaTitle: `Buy ${card.name} Gift Card Online | Instant Digital Delivery`,
    metaDescription: `Purchase ${card.name} gift cards online with instant delivery. Available in ${primaryCountry} and more. Safe, secure, and trusted by millions.`,
    heroHeadline: `${card.name} Gift Card`,
    heroSubheadline:
      card.description ??
      `Send a ${card.name} gift card instantly to your loved ones. Digital delivery, no hassle.`,
    aboutTitle: `About ${card.name} Gift Cards`,
    aboutBody: `<p>${
      card.description ??
      `${card.name} gift cards are the perfect digital gift for friends and family.`
    }</p>
<p>Available for use in ${countries}. Purchase securely and receive your code instantly via email — ready to redeem in seconds.</p>
<p>${
      card.expiry ?? "Check the provider's website for expiry and usage terms."
    }</p>`,
    whyBuyTitle: `Why Buy a ${card.name} Gift Card?`,
    whyBuyBody: `<p>A ${card.name} gift card is the perfect way to show someone you care — no matter where they are in the world. Choose from multiple denominations and send the code instantly.</p>
<p>Our platform ensures safe and secure payments with instant digital delivery. Your recipient gets their code by email within seconds.</p>
<p>Whether it's a birthday, holiday, or just because — a ${card.name} gift card is always the right choice.</p>`,
    faqs: [
      {
        question: `How do I redeem my ${card.name} gift card?`,
        answer:
          card.howToRedeem ??
          `Visit the ${card.name} website or app, sign in to your account, and enter the gift card code to add the balance.`,
      },
      {
        question: `Does the ${card.name} gift card expire?`,
        answer:
          card.expiry ??
          `Please check the provider's website for expiry information.`,
      },
      {
        question: `Which countries can I use this gift card in?`,
        answer: `This gift card is available for use in: ${countries}.`,
      },
      {
        question: `How quickly will I receive my gift card code?`,
        answer: `Your code is delivered instantly via email after purchase. Most customers receive it within 30 seconds.`,
      },
      {
        question: `Can I get a refund on my ${card.name} gift card?`,
        answer:
          card.additionalTerms ??
          `Gift cards are generally non-refundable. Please check the terms and conditions for details.`,
      },
      {
        question: `Is it safe to buy gift cards online?`,
        answer: `Yes! We use secure payment processing and are a certified reseller. Your purchase is protected.`,
      },
    ],
    denominations: [
      { value: 10, currency: "USD", label: "$10" },
      { value: 25, currency: "USD", label: "$25" },
      { value: 50, currency: "USD", label: "$50" },
      { value: 100, currency: "USD", label: "$100" },
      { value: 200, currency: "USD", label: "$200" },
    ],
  };
}
