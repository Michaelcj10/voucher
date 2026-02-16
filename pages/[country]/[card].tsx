import giftcards from "../../data/giftcards.json";
import { countryToSlug, slugToCountry } from "../../utils/countrySlug";
import Link from "next/link";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { generateContent, GeneratedContent } from "../../openai";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EmailIcon from "@mui/icons-material/Email";
import RedeemIcon from "@mui/icons-material/Redeem";
import { ChevronRight } from "lucide-react";

type GiftCard = (typeof giftcards)[number];
type Country = { name: string; iso: string };

function getCardInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Generate all country+card combinations
export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { country: string; card: string } }[] = [];
  for (const gc of giftcards) {
    for (const c of gc.countriesAvailableForUse as Country[]) {
      paths.push({
        params: {
          country: countryToSlug(c.name),
          card: gc.url,
        },
      });
    }
  }
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const countryParam = context.params?.country as string;
  const cardParam = context.params?.card as string;
  const countryName = slugToCountry(countryParam);

  const card = giftcards.find((c) => c.url === cardParam);
  if (!card) return { notFound: true };

  // Verify card is available in this country
  const validCountry = (card.countriesAvailableForUse as Country[]).some(
    (c) => countryToSlug(c.name) === countryParam,
  );
  if (!validCountry) return { notFound: true };

  const generated = await generateContent(card);

  // Related cards in the same country (excluding current)
  const related = giftcards
    .filter(
      (gc) =>
        gc.url !== card.url &&
        (gc.countriesAvailableForUse as Country[]).some(
          (c) => countryToSlug(c.name) === countryParam,
        ),
    )
    .slice(0, 6);

  return {
    props: {
      card: JSON.parse(JSON.stringify(card)),
      generated,
      countryName,
      countryParam,
      related: JSON.parse(JSON.stringify(related)),
    },
  };
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | string[] | null;
}) {
  if (!value) return null;
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
  countryName,
  countryParam,
  related,
}: {
  card: GiftCard;
  generated: GeneratedContent;
  countryName: string;
  countryParam: string;
  related: GiftCard[];
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://giftcards.ding.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: countryName,
        item: `https://giftcards.ding.com/${countryParam}`,
      },
      { "@type": "ListItem", position: 3, name: card.name },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${card.name} Gift Card`,
    description: generated.heroSubheadline,
    brand: { "@type": "Brand", name: card.name },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: generated.denominations[0]?.currency || "USD",
      lowPrice: Math.min(...generated.denominations.map((d) => d.value)),
      highPrice: Math.max(...generated.denominations.map((d) => d.value)),
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "1243",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: generated.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <Head>
        <title>{generated.metaTitle}</title>
        <meta name="description" content={generated.metaDescription} />
        <meta property="og:title" content={generated.metaTitle} />
        <meta property="og:description" content={generated.metaDescription} />
        <meta property="og:url" content={`/${countryParam}/${card.url}`} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={generated.metaTitle} />
        <meta name="twitter:description" content={generated.metaDescription} />
        <link
          rel="canonical"
          href={`https://giftcards.ding.com/${countryParam}/${card.url}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
            <Link
              href="/"
              style={{ textDecoration: "none", color: "#888", fontSize: 14 }}
            >
              Home
            </Link>
            <NavigateNextIcon sx={{ fontSize: 16, color: "#ccc" }} />
            <Link
              href={`/${countryParam}`}
              style={{ textDecoration: "none", color: "#888", fontSize: 14 }}
            >
              {countryName}
            </Link>
            <NavigateNextIcon sx={{ fontSize: 16, color: "#ccc" }} />
            <Typography variant="body2" sx={{ color: "#111", fontWeight: 500 }}>
              {card.name}
            </Typography>
          </Stack>

          {/* Hero */}
          <Box sx={{ mb: 5 }}>
            {card.operatorCode && (
              <img
                src={`https://imagerepo.ding.com/logo/${card.operatorCode}.png?width=245&compress=none`}
                alt={`${card.name} logo`}
                width={120}
                height={70}
                style={{
                  borderRadius: 8,
                  objectFit: "contain",
                  marginBottom: 16,
                }}
              />
            )}
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
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* How It Works */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{ mb: 5 }}
          >
            {[
              {
                icon: <ShoppingCartIcon sx={{ fontSize: 20 }} />,
                label: "1. Choose amount",
              },
              {
                icon: <EmailIcon sx={{ fontSize: 20 }} />,
                label: "2. Pay & receive code",
              },
              {
                icon: <RedeemIcon sx={{ fontSize: 20 }} />,
                label: "3. Redeem instantly",
              },
            ].map((step) => (
              <Stack
                key={step.label}
                direction="row"
                spacing={1}
                sx={{ alignItems: "center" }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    bgcolor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#111",
                  }}
                >
                  {step.icon}
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "#333" }}
                >
                  {step.label}
                </Typography>
              </Stack>
            ))}
          </Stack>

          {/* Denominations */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700, color: "#111", mb: 2 }}
            >
              Choose Amount
            </Typography>
            <Grid container spacing={1.5}>
              {generated.denominations.map((d) => (
                <Grid item xs={4} sm={3} md={2} key={d.value}>
                  <Box
                    sx={{
                      border: "1px solid #eee",
                      borderRadius: 2,
                      py: 1.5,
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "border-color 0.15s",
                      "&:hover": { borderColor: "#111" },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 700, color: "#111" }}
                    >
                      {d.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ mb: 5 }} />

          {/* Card details */}
          <Card
            elevation={0}
            sx={{ border: "1px solid #eee", borderRadius: 2, mb: 5 }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#111", mb: 1.5 }}
              >
                {card.name} Details
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <DetailRow
                label="Available in"
                value={(card.countriesAvailableForUse as Country[]).map(
                  (c) => c.name,
                )}
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
                    : card.locations
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

          {/* Related cards */}
          {related.length > 0 && (
            <>
              <Divider sx={{ mb: 4 }} />
              <Box sx={{ mb: 5 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 700, color: "#111", mb: 3 }}
                >
                  More Gift Cards in {countryName}
                </Typography>
                <Grid container spacing={2}>
                  {related.map((rc) => (
                    <Grid item xs={12} sm={6} md={4} key={rc.url}>
                      <Link
                        href={`/${countryParam}/${rc.url}`}
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
                          {rc.operatorCode ? (
                            <img
                              src={`https://imagerepo.ding.com/logo/${rc.operatorCode}.png?width=245&compress=none`}
                              alt={`${rc.name} logo`}
                              width={60}
                              height={36}
                              style={{ borderRadius: 4, marginRight: 12 }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: 1,
                                bgcolor: "#f5f5f5",
                                color: "#333",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: 13,
                                mr: 1.5,
                                flexShrink: 0,
                              }}
                            >
                              {getCardInitials(rc.name)}
                            </Box>
                          )}
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ fontWeight: 600, color: "#111", flex: 1 }}
                          >
                            {rc.name}
                          </Typography>
                          <ChevronRight
                            style={{
                              width: 18,
                              height: 18,
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
            </>
          )}
        </Container>
      </Box>
    </>
  );
}
