import giftcards from "./data/giftcards.json";
import { Gift, ChevronRight, Globe } from "lucide-react";
import Link from "next/link";
import { TrustBadges } from "./TrustBadges";

type GiftCard = (typeof giftcards)[number];

function groupByCountry(cards: GiftCard[]) {
  const map = new Map<string, { iso: string; cards: GiftCard[] }>();
  for (const card of cards) {
    for (const country of card.countriesAvailableForUse) {
      if (!map.has(country.name)) {
        map.set(country.name, { iso: country.iso, cards: [] });
      }
      map.get(country.name)!.cards.push(card);
    }
  }
  // Sort countries alphabetically
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

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

const brandColors: Record<string, string> = {
  Amazon: "from-amber-400 to-amber-600",
  "Apple Gift Card": "from-slate-700 to-slate-900",
  "BIGO Live": "from-blue-400 to-indigo-600",
  Daraz: "from-orange-400 to-orange-600",
};

export default function HomePage() {
  const grouped = groupByCountry(giftcards);
  const totalCountries = grouped.length;
  const totalCards = giftcards.length;

  return (
    <>
      {/* Hero */}
      <section className="hero mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm mb-6">
            <Globe className="w-4 h-4" />
            <span>
              {totalCards} gift cards · {totalCountries} countries
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-2">
            Digital Gift Cards,
            <br />
            Delivered Instantly
          </h1>
          <p className="mt-6 text-lg text-white/90 max-w-lg">
            Browse our collection of digital gift cards. Purchase securely and
            receive your code by email in seconds — perfect for loved ones
            anywhere in the world.
          </p>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <TrustBadges />
        </div>
      </section>

      {/* Cards grouped by country */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display text-2xl sm:text-3xl text-ink mb-2">
          Browse by Country
        </h2>
        <p className="text-ink-muted mb-10">
          Find gift cards available in your country or send to loved ones
          abroad.
        </p>
        <div className="space-y-10">
          {grouped.map(([country, { iso, cards }]) => (
            <div key={country} id={iso.toLowerCase()}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl" role="img" aria-label={country}>
                  {getFlagEmoji(iso)}
                </span>
                <h3 className="font-display text-xl text-ink">{country}</h3>
                <span className="text-sm text-ink-faint ml-1">
                  {cards.length} {cards.length === 1 ? "card" : "cards"}
                </span>
              </div>
              <div className="card-list">
                {cards.map((card) => (
                  <Link
                    key={`${country}-${card.url}`}
                    href={`/${card.url}`}
                    className="card group flex items-center gap-4"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${brandColors[card.name] ?? "from-brand-500 to-brand-700"} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                    >
                      {getCardInitials(card.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ink truncate">
                        {card.name}
                      </p>
                      <p className="text-sm text-ink-muted truncate">
                        {card.productCategories.join(", ")}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-faint group-hover:text-brand-600 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
