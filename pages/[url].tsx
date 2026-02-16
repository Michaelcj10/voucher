import giftcards from "../data/giftcards.json";
import Link from "next/link";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { generateContent, GeneratedContent } from "../openai";
import {
  Box,
  Typography,
  Container,
  Stack,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Rating,
} from "@mui/material";
import {
  ArrowBack,
  Send,
  ShoppingCart,
  Email,
  Redeem,
  NavigateNext,
  Star,
} from "@mui/icons-material";

type GiftCard = (typeof giftcards)[number];
type Country = { name: string; iso: string };

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: giftcards.map((card) => ({ params: { url: card.url } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const url = context.params?.url;
  const card = giftcards.find((c) => c.url === url);
  if (!card) {
    return { notFound: true };
  }
  const generated = await generateContent(card);

  // Find related cards (same country, different card)
  const primaryCountry = card.countriesAvailableForUse[0]?.name;
  const related = primaryCountry
    ? giftcards
        .filter(
          (c) =>
            c.url !== card.url &&
            c.countriesAvailableForUse.some(
              (co: Country) => co.name === primaryCountry,
            ),
        )
        .slice(0, 6)
    : [];

  return { props: { card, generated, related } };
};

const products = [
  { label: "$5", price: "€4.75", popular: false },
  { label: "$10", price: "€9.50", popular: false },
  { label: "$25", price: "€23.50", popular: true },
  { label: "$50", price: "€47.00", popular: false },
  { label: "$100", price: "€94.00", popular: false },
  { label: "$200", price: "€188.00", popular: false },
];

const howItWorks = [
  {
    icon: <ShoppingCart sx={{ fontSize: 28 }} />,
    title: "1. Choose",
    description: "Pick a gift card and select your amount",
  },
  {
    icon: <Email sx={{ fontSize: 28 }} />,
    title: "2. Pay & Receive",
    description: "Complete payment and get the code by email in seconds",
  },
  {
    icon: <Redeem sx={{ fontSize: 28 }} />,
    title: "3. Redeem",
    description: "Share the code — your recipient redeems it instantly",
  },
];

// Hardcoded reviews for POC
const reviews = [
  {
    name: "Sarah K.",
    rating: 5,
    text: "Code arrived in under a minute. My sister in the US was thrilled!",
    date: "2025-01-14",
  },
  {
    name: "Raj P.",
    rating: 5,
    text: "Super easy process. Have bought several times now for family abroad.",
    date: "2025-01-28",
  },
  {
    name: "Maria G.",
    rating: 4,
    text: "Quick delivery and worked perfectly. Will use again.",
    date: "2025-02-03",
  },
];

function getCardInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | string[];
}) {
  const display = Array.isArray(value) ? value.join(", ") : value;
  return (
    <Box sx={{ py: 0.75 }}>
      <Typography
        variant="body2"
        component="span"
        sx={{ fontWeight: 600, color: "#111", mr: 1 }}
      >
        {label}:
      </Typography>
      <Typography variant="body2" component="span" sx={{ color: "#666" }}>
        {display}
      </Typography>
    </Box>
  );
}

export default function VoucherPage({
  card,
  generated,
  related,
}: {
  card: GiftCard;
  generated: GeneratedContent;
  related: GiftCard[];
}) {
  const countries = card.countriesAvailableForUse as Country[];
  const primaryCountry = countries[0]?.name ?? "worldwide";

  // --- Structured Data ---
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${card.name} Gift Card`,
    description: generated.metaDescription,
    brand: { "@type": "Brand", name: card.brand },
    category: "Gift Cards",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: generated.denominations[0]?.currency ?? "USD",
      lowPrice: generated.denominations[0]?.value ?? 5,
      highPrice:
        generated.denominations[generated.denominations.length - 1]?.value ??
        200,
      offerCount: generated.denominations.length,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Ding Gift Cards" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "1243",
      bestRating: "5",
      worstRating: "1",
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.date,
      reviewBody: r.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
      },
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: generated.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.replace(/<[^>]*>/g, ""),
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://giftcards.ding.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: primaryCountry,
        item: `https://giftcards.ding.com/#${countries[0]?.iso?.toLowerCase()}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${card.name} Gift Card`,
        item: `https://giftcards.ding.com/${card.url}`,
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Buy and Send a ${card.name} Gift Card`,
    step: [
      {
        "@type": "HowToStep",
        name: "Choose your gift card",
        text: `Select the ${card.name} gift card and pick a denomination.`,
      },
      {
        "@type": "HowToStep",
        name: "Complete payment",
        text: "Pay securely and receive the gift card code by email in seconds.",
      },
      {
        "@type": "HowToStep",
        name: "Share and redeem",
        text: `Share the code with your recipient. They redeem it at ${card.brand} instantly.`,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{generated.metaTitle}</title>
        <meta name="description" content={generated.metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      </Head>

      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 }, px: 2 }}>
          {/* Breadcrumbs */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: "center", mb: 3, flexWrap: "wrap" }}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#888",
                  "&:hover": { color: "#111" },
                  cursor: "pointer",
                }}
              >
                Home
              </Typography>
            </Link>
            <NavigateNext sx={{ fontSize: 16, color: "#ccc" }} />
            <Link
              href={`/#${countries[0]?.iso?.toLowerCase()}`}
              style={{ textDecoration: "none" }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#888",
                  "&:hover": { color: "#111" },
                  cursor: "pointer",
                }}
              >
                {primaryCountry}
              </Typography>
            </Link>
            <NavigateNext sx={{ fontSize: 16, color: "#ccc" }} />
            <Typography variant="body2" sx={{ color: "#111", fontWeight: 600 }}>
              {card.name}
            </Typography>
          </Stack>

          {/* Hero */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: 26, md: 34 },
                color: "#111",
                mb: 1,
              }}
            >
              {generated.heroHeadline}
            </Typography>
            <Typography variant="body1" sx={{ color: "#888", fontSize: 17 }}>
              {generated.heroSubheadline}
            </Typography>
            {/* Inline rating summary */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", mt: 1.5 }}
            >
              <Rating value={4.7} precision={0.1} size="small" readOnly />
              <Typography variant="body2" sx={{ color: "#888" }}>
                4.7 out of 5 · 1,243 reviews
              </Typography>
            </Stack>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Products */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700, color: "#111", mb: 2 }}
            >
              Choose an amount
            </Typography>
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={6} sm={4} key={product.label}>
                  <Card
                    elevation={0}
                    sx={{
                      border: "1px solid #eee",
                      borderRadius: 2,
                      textAlign: "center",
                      py: 2.5,
                      px: 2,
                      cursor: "pointer",
                      position: "relative",
                      transition: "border-color 0.15s",
                      "&:hover": { borderColor: "#111" },
                    }}
                  >
                    {product.popular && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "#4caf50",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 700,
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          lineHeight: 1.4,
                        }}
                      >
                        Popular
                      </Box>
                    )}
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "#111", mb: 0.5 }}
                    >
                      {product.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      {product.price}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              size="large"
              endIcon={<Send />}
              disableElevation
              sx={{
                mt: 3,
                bgcolor: "#111",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 5,
                py: 1.5,
                fontSize: 16,
                "&:hover": { bgcolor: "#333" },
              }}
            >
              Send Gift Card
            </Button>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* How It Works */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700, color: "#111", mb: 3 }}
            >
              How it works
            </Typography>
            <Grid container spacing={3}>
              {howItWorks.map((step) => (
                <Grid item xs={12} sm={4} key={step.title}>
                  <Stack
                    spacing={1}
                    sx={{
                      alignItems: { xs: "flex-start", sm: "center" },
                      textAlign: { xs: "left", sm: "center" },
                    }}
                  >
                    <Box sx={{ color: "#111", display: "flex" }}>
                      {step.icon}
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#111" }}
                    >
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      {step.description}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Card details */}
          <Card
            elevation={0}
            sx={{ border: "1px solid #eee", borderRadius: 2, mb: 5 }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: 700, color: "#111", mb: 1.5 }}
              >
                {card.brand}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <DetailRow
                label="Available in"
                value={countries.map((c) => c.name)}
              />
              <DetailRow
                label="Denominations"
                value={generated.denominations.map((d) => d.label)}
              />
              <DetailRow label="How to Redeem" value={card.howToRedeem} />
              <DetailRow label="Expiry" value={card.expiry} />
              <DetailRow
                label="Additional Terms"
                value={card.additionalTerms}
              />
              <DetailRow label="Contact" value={card.contact} />
              <DetailRow
                label="Where to Use"
                value={
                  Array.isArray(card.locations)
                    ? card.locations
                    : String(card.locations)
                }
              />
              <DetailRow label="Categories" value={card.productCategories} />
            </CardContent>
          </Card>

          {/* About */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700, color: "#111", mb: 1 }}
            >
              {generated.aboutTitle}
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ color: "#555", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: generated.aboutBody }}
            />
          </Box>

          {/* Why Buy */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700, color: "#111", mb: 1 }}
            >
              {generated.whyBuyTitle}
            </Typography>
            <Typography
              variant="body1"
              component="div"
              sx={{ color: "#555", lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: generated.whyBuyBody }}
            />
          </Box>

          {/* FAQs */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700, color: "#111", mb: 3 }}
            >
              FAQs
            </Typography>
            <Stack spacing={2}>
              {generated.faqs.map((faq, i) => (
                <Box key={i} sx={{ borderBottom: "1px solid #eee", pb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "#111", mb: 0.5 }}
                  >
                    {faq.question}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ color: "#666", lineHeight: 1.6 }}
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Reviews */}
          <Box sx={{ mb: 5 }}>
            <Stack
              direction="row"
              spacing={2}
              sx={{ alignItems: "center", mb: 3 }}
            >
              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: 700, color: "#111" }}
              >
                Customer Reviews
              </Typography>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ alignItems: "center" }}
              >
                <Star sx={{ fontSize: 18, color: "#faaf00" }} />
                <Typography variant="body2" sx={{ color: "#888" }}>
                  4.7 (1,243)
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing={2}>
              {reviews.map((review, i) => (
                <Box key={i} sx={{ borderBottom: "1px solid #eee", pb: 2 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center", mb: 0.5 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#111" }}
                    >
                      {review.name}
                    </Typography>
                    <Rating value={review.rating} size="small" readOnly />
                    <Typography variant="caption" sx={{ color: "#aaa" }}>
                      {review.date}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {review.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Related Gift Cards */}
          {related.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: 700, color: "#111", mb: 2 }}
              >
                Other gift cards in {primaryCountry}
              </Typography>
              <Grid container spacing={2}>
                {related.map((r) => (
                  <Grid item xs={12} sm={6} md={4} key={r.url}>
                    <Link
                      href={`/${r.url}`}
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
                            width: 40,
                            height: 40,
                            borderRadius: 1.5,
                            bgcolor: "#f5f5f5",
                            color: "#333",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 14,
                            mr: 1.5,
                            flexShrink: 0,
                          }}
                        >
                          {getCardInitials(r.name)}
                        </Box>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ fontWeight: 600, color: "#111", flex: 1 }}
                        >
                          {r.name}
                        </Typography>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
}
