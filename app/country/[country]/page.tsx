import giftcardsData from "../../../data/giftcards.json";
import { countryToSlug, slugToCountry } from "../../../utils/countrySlug";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Box, Container, Typography, Grid, Card } from "@mui/material";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type GiftCard = {
  id: string;
  name: string;
  country: string;
  brand: string;
  denominations: number[];
  url: string;
  countriesAvailableForUse: { name: string; iso: string }[];
  description: string;
  howToRedeem: string;
  expiry: string;
  additionalTerms: string;
  locations: string[];
  contact: string;
  productCategories: string[];
};

function getCardInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function generateStaticParams() {
  const countries = new Set<string>();
  (giftcardsData as GiftCard[]).forEach((card) => {
    (card.countriesAvailableForUse || []).forEach((c) => countries.add(c.name));
  });
  return Array.from(countries).map((name) => ({
    country: countryToSlug(name),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const countryName = slugToCountry(country);
  return {
    title: `Buy Gift Cards in ${countryName} | Digital Vouchers`,
    description: `Browse and buy digital gift cards available for use in ${countryName}. Fast delivery, secure checkout, and top brands.`,
    openGraph: {
      title: `Buy Gift Cards in ${countryName}`,
      description: `Browse and buy digital gift cards available for use in ${countryName}.`,
      url: `/country/${country}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Buy Gift Cards in ${countryName}`,
      description: `Browse and buy digital gift cards available for use in ${countryName}.`,
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: countryParam } = await params;
  const countryName = slugToCountry(countryParam);
  const giftcards = giftcardsData as GiftCard[];
  const cards = giftcards.filter((card) =>
    (card.countriesAvailableForUse || []).some(
      (c) =>
        typeof c.name === "string" && countryToSlug(c.name) === countryParam,
    ),
  );

  if (!cards.length) return notFound();

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Gift Cards for {countryName}
        </Typography>
        <Typography variant="body1" sx={{ color: "#888", mb: 5 }}>
          Buy digital gift cards available for use in {countryName}.
        </Typography>
        <Grid container spacing={2}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.url}>
              <Link
                href={`/${countryParam}/${card.url}`}
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
    </Box>
  );
}
