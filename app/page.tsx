import giftcards from "../data/giftcards.json";
import { countryToSlug } from "../utils/countrySlug";
import { ChevronRight, Globe } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import {
  Box,
  Typography,
  Card,
  Grid,
  Container,
  Stack,
  Divider,
} from "@mui/material";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LockIcon from "@mui/icons-material/Lock";
import VerifiedIcon from "@mui/icons-material/Verified";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EmailIcon from "@mui/icons-material/Email";
import RedeemIcon from "@mui/icons-material/Redeem";
import AppleIcon from "@mui/icons-material/Apple";
import ShopIcon from "@mui/icons-material/Shop";
import PublicIcon from "@mui/icons-material/Public";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

type GiftCard = (typeof giftcards)[number];
type Country = { name: string; iso: string };

function groupByCountry(
  cards: GiftCard[],
): [string, { iso: string; cards: GiftCard[] }][] {
  const map = new Map<string, { iso: string; cards: GiftCard[] }>();
  for (const card of cards) {
    for (const country of card.countriesAvailableForUse as Country[]) {
      if (!map.has(country.name)) {
        map.set(country.name, { iso: country.iso, cards: [] });
      }
      map.get(country.name)!.cards.push(card);
    }
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function getCardInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const trustBadges = [
  { icon: <FlashOnIcon fontSize="small" />, label: "Instant digital delivery" },
  { icon: <LockIcon fontSize="small" />, label: "Safe & secure payment" },
  { icon: <VerifiedIcon fontSize="small" />, label: "Certified reseller" },
  {
    icon: <PeopleIcon fontSize="small" />,
    label: "Millions of happy customers",
  },
];

const howItWorks = [
  {
    icon: <ShoppingCartIcon sx={{ fontSize: 28 }} />,
    title: "1. Choose",
    description: "Pick a gift card and select the amount you want to send.",
  },
  {
    icon: <EmailIcon sx={{ fontSize: 28 }} />,
    title: "2. Pay & Receive",
    description:
      "Complete your payment securely. The code arrives by email in seconds.",
  },
  {
    icon: <RedeemIcon sx={{ fontSize: 28 }} />,
    title: "3. Redeem",
    description:
      "Share the code with your recipient — they redeem it instantly.",
  },
];

export default function Page() {
  const grouped = groupByCountry(giftcards);
  const totalCountries = grouped.length;
  const totalCards = giftcards.length;

  // Popular cards (first 6 unique brands)
  const popularCards = giftcards.slice(0, 6);

  // All unique countries for quick links
  const allCountries: { name: string; iso: string }[] = [];
  const seen = new Set<string>();
  for (const card of giftcards) {
    for (const c of card.countriesAvailableForUse as Country[]) {
      if (!seen.has(c.name)) {
        seen.add(c.name);
        allCountries.push(c);
      }
    }
  }
  allCountries.sort((a, b) => a.name.localeCompare(b.name));

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ding Gift Cards",
    url: "https://giftcards.ding.com",
    logo: "https://giftcards.ding.com/logo.png",
    description: `Buy digital gift cards online with instant delivery. ${totalCards} gift cards available across ${totalCountries} countries.`,
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ding Gift Cards",
    url: "https://giftcards.ding.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://giftcards.ding.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Head>
        <title>
          Buy Digital Gift Cards Online | Instant Delivery Worldwide
        </title>
        <meta
          name="description"
          content={`Browse ${totalCards} digital gift cards available in ${totalCountries} countries. Instant delivery by email. Safe, secure, and trusted by millions.`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </Head>

      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        {/* ───── Hero ───── */}
        <Container
          maxWidth="lg"
          sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 4, md: 6 } }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", color: "#888", mb: 2 }}
          >
            <Globe style={{ width: 18, height: 18 }} />
            <Typography variant="body2" sx={{ color: "#888" }}>
              {totalCards} gift cards · {totalCountries} countries
            </Typography>
          </Stack>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: 28, md: 40 },
              color: "#111",
              mb: 1.5,
            }}
          >
            Digital Gift Cards,
            <br />
            Delivered Instantly
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#888", maxWidth: 520, fontSize: 17, mb: 3 }}
          >
            Browse our collection of digital gift cards. Purchase securely and
            receive your code by email in seconds — perfect for loved ones
            anywhere in the world.
          </Typography>

          {/* App download badges */}
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <a
              href="https://apps.apple.com/app/ding-top-up"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "#111",
                  color: "#fff",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "background 0.15s",
                  "&:hover": { bgcolor: "#333" },
                }}
              >
                <AppleIcon sx={{ fontSize: 20 }} />
                App Store
              </Box>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.ding"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "#111",
                  color: "#fff",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "background 0.15s",
                  "&:hover": { bgcolor: "#333" },
                }}
              >
                <ShopIcon sx={{ fontSize: 20 }} />
                Google Play
              </Box>
            </a>
          </Stack>
        </Container>

        <Divider />

        {/* ───── Trust Badges ───── */}
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 4 }}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            {trustBadges.map((badge) => (
              <Stack
                key={badge.label}
                direction="row"
                spacing={1}
                sx={{ alignItems: "center" }}
              >
                <Box sx={{ color: "#4caf50", display: "flex" }}>
                  {badge.icon}
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#555", fontWeight: 500 }}
                >
                  {badge.label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Container>

        <Divider />

        {/* ───── How It Works ───── */}
        <Box sx={{ bgcolor: "#fafafa" }}>
          <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 700,
                color: "#111",
                mb: 1,
                textAlign: "center",
              }}
            >
              How it works
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#888", mb: 5, textAlign: "center" }}
            >
              Three simple steps to send a gift card anywhere in the world.
            </Typography>
            <Grid container spacing={4}>
              {howItWorks.map((step) => (
                <Grid item xs={12} sm={4} key={step.title}>
                  <Stack
                    spacing={1.5}
                    sx={{
                      alignItems: { xs: "flex-start", sm: "center" },
                      textAlign: { xs: "left", sm: "center" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: "#fff",
                        border: "1px solid #eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#111",
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: "#111" }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#888", maxWidth: 280 }}
                    >
                      {step.description}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        <Divider />

        {/* ───── Popular Gift Cards ───── */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 700, color: "#111", mb: 1 }}
          >
            Popular Gift Cards
          </Typography>
          <Typography variant="body1" sx={{ color: "#888", mb: 4 }}>
            Our most popular digital gift cards, loved by customers worldwide.
          </Typography>
          <Grid container spacing={2}>
            {popularCards.map((card) => (
              <Grid item xs={12} sm={6} md={4} key={`popular-${card.url}`}>
                <Link
                  href={`/${card.url}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #eee",
                      cursor: "pointer",
                      transition: "border-color 0.15s",
                      "&:hover": { borderColor: "#ccc" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 1.5,
                        bgcolor: "#f5f5f5",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 15,
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      {getCardInitials(card.name)}
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="body1"
                        noWrap
                        sx={{ fontWeight: 600, color: "#111" }}
                      >
                        {card.name}
                      </Typography>
                      <Typography variant="body2" noWrap sx={{ color: "#999" }}>
                        {card.productCategories.join(", ")}
                      </Typography>
                    </Box>
                    <ChevronRight
                      style={{
                        width: 20,
                        height: 20,
                        color: "#ccc",
                        flexShrink: 0,
                      }}
                    />
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Divider />

        {/* ───── Browse by Country ───── */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 700, color: "#111", mb: 1 }}
          >
            Browse by Country
          </Typography>
          <Typography variant="body1" sx={{ color: "#888", mb: 5 }}>
            Find gift cards available in your country or send to loved ones
            abroad.
          </Typography>

          <Stack spacing={5}>
            {grouped.map(([country, { iso, cards }]) => (
              <Box key={country} id={countryToSlug(country)}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: "center", mb: 2 }}
                >
                  <img
                    src={`https://imagerepo.ding.com/flag/${iso.toUpperCase()}.png?height=40&compress=none`}
                    alt={`${country} flag`}
                    width={28}
                    height={28}
                    style={{ borderRadius: "50%" }}
                  />
                  <Link
                    href={`/country/${countryToSlug(country)}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography
                      variant="subtitle1"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        color: "#111",
                        "&:hover": { color: "#444" },
                      }}
                    >
                      {country}
                    </Typography>
                  </Link>
                  <Typography variant="body2" sx={{ color: "#aaa" }}>
                    {cards.length} {cards.length === 1 ? "card" : "cards"}
                  </Typography>
                </Stack>

                <Grid container spacing={2}>
                  {cards.map((card) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={`${country}-${card.url}`}
                    >
                      <Link
                        href={`/${card.url}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Card
                          elevation={0}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid #eee",
                            cursor: "pointer",
                            transition: "border-color 0.15s",
                            "&:hover": { borderColor: "#ccc" },
                          }}
                        >
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: 1.5,
                              bgcolor: "#f5f5f5",
                              color: "#333",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: 15,
                              mr: 2,
                              flexShrink: 0,
                            }}
                          >
                            {getCardInitials(card.name)}
                          </Box>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                              variant="body1"
                              noWrap
                              sx={{ fontWeight: 600, color: "#111" }}
                            >
                              {card.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ color: "#999" }}
                            >
                              {card.productCategories.join(", ")}
                            </Typography>
                          </Box>
                          <ChevronRight
                            style={{
                              width: 20,
                              height: 20,
                              color: "#ccc",
                              flexShrink: 0,
                            }}
                          />
                        </Card>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Stack>
        </Container>

        <Divider />

        {/* ───── Country Quick Links ───── */}
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 700, color: "#111", mb: 1 }}
          >
            All Countries
          </Typography>
          <Typography variant="body1" sx={{ color: "#888", mb: 4 }}>
            Jump to gift cards by country.
          </Typography>
          <Grid container spacing={1.5}>
            {allCountries.map((c) => (
              <Grid item xs={6} sm={4} md={3} key={c.iso}>
                <Link
                  href={`/country/${countryToSlug(c.name)}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: "center",
                      p: 1.5,
                      borderRadius: 1.5,
                      border: "1px solid #eee",
                      transition: "border-color 0.15s",
                      "&:hover": { borderColor: "#ccc" },
                    }}
                  >
                    <img
                      src={`https://imagerepo.ding.com/flag/${c.iso.toUpperCase()}.png?height=32&compress=none`}
                      alt={`${c.name} flag`}
                      width={22}
                      height={22}
                      style={{ borderRadius: "50%" }}
                    />
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ fontWeight: 500, color: "#333" }}
                    >
                      {c.name}
                    </Typography>
                  </Stack>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Divider />

        {/* ───── SEO Content ───── */}
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: 700, color: "#111", mb: 2 }}
              >
                Send Digital Gift Cards Internationally
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}
              >
                Buying a gift for someone abroad used to mean expensive
                shipping, customs delays, and crossed fingers. Digital gift
                cards change that entirely. Choose a card, pay securely, and
                your recipient gets a redeemable code by email in under 30
                seconds — no matter where in the world they are.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#555", lineHeight: 1.8, mb: 2 }}
              >
                Whether you're an expat sending a birthday gift back home, a
                parent supporting a child studying abroad, or simply treating a
                friend in another country — our platform makes it effortless. We
                offer gift cards from top global brands that work in{" "}
                {totalCountries}+ countries.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#555", lineHeight: 1.8 }}
              >
                Every purchase is backed by secure payment processing, instant
                delivery, and dedicated customer support. No account required —
                just pick, pay, and send.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <PublicIcon sx={{ color: "#111", fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#111", mb: 0.5 }}
                    >
                      Works in {totalCountries}+ countries
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      Gift cards available across the Americas, Europe, Asia,
                      Africa, and the Middle East. Send globally, redeem
                      locally.
                    </Typography>
                  </Box>
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CardGiftcardIcon sx={{ color: "#111", fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#111", mb: 0.5 }}
                    >
                      {totalCards}+ gift cards
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      From gaming and entertainment to shopping and dining — we
                      carry top brands your recipients already know and love.
                    </Typography>
                  </Box>
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FlashOnIcon sx={{ color: "#111", fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#111", mb: 0.5 }}
                    >
                      Delivered in seconds
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      No shipping, no waiting. Your recipient gets the code by
                      email instantly — ready to redeem right away.
                    </Typography>
                  </Box>
                </Stack>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <SupportAgentIcon sx={{ color: "#111", fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#111", mb: 0.5 }}
                    >
                      Dedicated support
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      Something not right? Our customer support team is here to
                      help with any order issues or questions.
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>

        <Divider />

        {/* ───── Download App CTA ───── */}
        <Box sx={{ bgcolor: "#fafafa" }}>
          <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={4}
              sx={{
                alignItems: { md: "center" },
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 700, color: "#111", mb: 1 }}
                >
                  Send gift cards on the go
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#888", maxWidth: 440 }}
                >
                  Download the Ding app to buy and send digital gift cards from
                  your phone. Available on iOS and Android.
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <a
                  href="https://apps.apple.com/app/ding-top-up"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "#111",
                      color: "#fff",
                      px: 2.5,
                      py: 1.25,
                      borderRadius: 2,
                      fontSize: 14,
                      fontWeight: 600,
                      transition: "background 0.15s",
                      "&:hover": { bgcolor: "#333" },
                    }}
                  >
                    <AppleIcon sx={{ fontSize: 22 }} />
                    App Store
                  </Box>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.ding"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "#111",
                      color: "#fff",
                      px: 2.5,
                      py: 1.25,
                      borderRadius: 2,
                      fontSize: 14,
                      fontWeight: 600,
                      transition: "background 0.15s",
                      "&:hover": { bgcolor: "#333" },
                    }}
                  >
                    <ShopIcon sx={{ fontSize: 22 }} />
                    Google Play
                  </Box>
                </a>
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* ───── Footer ───── */}
        <Divider />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <Typography variant="body2" sx={{ color: "#aaa" }}>
              © {new Date().getFullYear()} Ding. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography
                variant="body2"
                component="a"
                href="/terms"
                sx={{
                  color: "#aaa",
                  textDecoration: "none",
                  "&:hover": { color: "#666" },
                }}
              >
                Terms
              </Typography>
              <Typography
                variant="body2"
                component="a"
                href="/privacy"
                sx={{
                  color: "#aaa",
                  textDecoration: "none",
                  "&:hover": { color: "#666" },
                }}
              >
                Privacy
              </Typography>
              <Typography
                variant="body2"
                component="a"
                href="/contact"
                sx={{
                  color: "#aaa",
                  textDecoration: "none",
                  "&:hover": { color: "#666" },
                }}
              >
                Contact
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
