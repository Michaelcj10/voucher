import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Clock,
  AlertCircle,
  Phone,
  Globe,
} from "lucide-react";
import giftcards from "./data/giftcards.json";
import { getContentForCard } from "./content-cache";
import { TrustBadges } from "./TrustBadges";
import { FAQAccordion } from "./FAQAccordion";
import { DenominationSelector } from "./DenominationSelector";

type GiftCard = (typeof giftcards)[number];

const brandColors: Record<string, { bg: string; text: string }> = {
  Amazon: { bg: "from-amber-400 to-amber-600", text: "text-amber-700" },
  "Apple Gift Card": {
    bg: "from-slate-700 to-slate-900",
    text: "text-slate-700",
  },
  "BIGO Live": {
    bg: "from-blue-400 to-indigo-600",
    text: "text-indigo-700",
  },
  Daraz: { bg: "from-orange-400 to-orange-600", text: "text-orange-700" },
};

function getFlagEmoji(iso: string) {
  return iso
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

function getCardInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// -- Static params --
export async function generateStaticParams() {
  return giftcards.map((card) => ({ slug: card.url }));
}

// -- Metadata --
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContentForCard(slug);
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: "website",
    },
  };
}

// -- Page --
export default async function GiftCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = giftcards.find((c) => c.url === slug);
  if (!card) return <div>Card not found</div>;

  const content = await getContentForCard(slug);
  const colors = brandColors[card.name] ?? {
    bg: "from-brand-500 to-brand-700",
    text: "text-brand-700",
  };

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-1.5 text-sm text-ink-muted">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-ink font-medium">{card.name}</span>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left: Card info */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-start gap-5">
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg shrink-0`}
              >
                {getCardInitials(card.name)}
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">
                  {content.heroHeadline}
                </h1>
                <p className="mt-2 text-ink-muted text-base leading-relaxed max-w-lg">
                  {content.heroSubheadline}
                </p>
                <div className="mt-4">
                  <TrustBadges variant="compact" />
                </div>
              </div>
            </div>

            {/* Countries */}
            <div className="flex flex-wrap gap-2">
              {card.countriesAvailableForUse.map((c) => (
                <span
                  key={c.iso}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-sm text-ink-muted"
                >
                  <span>{getFlagEmoji(c.iso)}</span>
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Denomination selector */}
          <div className="lg:col-span-2">
            <DenominationSelector
              denominations={content.denominations}
              cardName={card.name}
            />
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-y border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <TrustBadges />
        </div>
      </section>

      {/* Content sections */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <div>
              <h2 className="font-display text-2xl text-ink mb-4">
                {content.aboutTitle}
              </h2>
              <div
                className="prose prose-slate max-w-none text-ink-muted leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.aboutBody }}
              />
            </div>

            {/* Why Buy */}
            <div>
              <h2 className="font-display text-2xl text-ink mb-4">
                {content.whyBuyTitle}
              </h2>
              <div
                className="prose prose-slate max-w-none text-ink-muted leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.whyBuyBody }}
              />
            </div>

            {/* How to Redeem */}
            {card.howToRedeem && (
              <div>
                <h2 className="font-display text-2xl text-ink mb-4">
                  How to Redeem
                </h2>
                <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100">
                  <div className="prose prose-sm prose-slate max-w-none text-ink-muted whitespace-pre-line">
                    {card.howToRedeem}
                  </div>
                </div>
              </div>
            )}

            {/* FAQs */}
            <div>
              <h2 className="font-display text-2xl text-ink mb-4">
                Frequently Asked Questions
              </h2>
              <FAQAccordion faqs={content.faqs} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick facts */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h3 className="font-medium text-ink text-sm uppercase tracking-wider">
                Quick Facts
              </h3>

              {card.expiry && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-ink-faint mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-ink">Expiry</p>
                    <p className="text-sm text-ink-muted">{card.expiry}</p>
                  </div>
                </div>
              )}

              {card.locations && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-ink-faint mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-ink">Where to Use</p>
                    <p className="text-sm text-ink-muted whitespace-pre-line">
                      {(Array.isArray(card.locations)
                        ? card.locations.join(", ")
                        : card.locations
                      ).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-ink-faint mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-ink">Available In</p>
                  <p className="text-sm text-ink-muted">
                    {card.countriesAvailableForUse
                      .map((c) => c.name)
                      .join(", ")}
                  </p>
                </div>
              </div>

              {card.contact && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-ink-faint mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-ink">Support</p>
                    <p className="text-sm text-ink-muted">
                      {card.contact.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            {card.additionalTerms && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-ink-faint" />
                  <h3 className="font-medium text-ink text-sm uppercase tracking-wider">
                    Terms & Conditions
                  </h3>
                </div>
                <div className="text-sm text-ink-muted space-y-1 whitespace-pre-line">
                  {card.additionalTerms}
                </div>
              </div>
            )}

            {/* Sticky buy CTA */}
            <div className="hidden lg:block sticky top-24">
              <DenominationSelector
                denominations={content.denominations}
                cardName={card.name}
              />
            </div>
          </aside>
        </div>
      </section>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${card.name} Gift Card`,
            description: content.metaDescription,
            brand: { "@type": "Brand", name: card.name },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "USD",
              lowPrice: content.denominations[0]?.value.toString() ?? "10",
              highPrice:
                content.denominations[
                  content.denominations.length - 1
                ]?.value.toString() ?? "200",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: content.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer.replace(/<[^>]*>/g, ""),
              },
            })),
          }),
        }}
      />
    </>
  );
}
