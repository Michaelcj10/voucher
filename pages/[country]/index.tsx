import giftcardsData from "../../data/giftcards.json";
import { countryToSlug, slugToCountry } from "../../utils/countrySlug";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { Box, Container, Typography, Grid, Card } from "@mui/material";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type GiftCard = (typeof giftcardsData)[number];
type Country = { name: string; iso: string };

function getCardInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const getStaticPaths: GetStaticPaths = async () => {
  const countries = new Set<string>();
  (giftcardsData as GiftCard[]).forEach((card) => {
    (card.countriesAvailableForUse as Country[]).forEach((c) =>
      countries.add(c.name),
    );
  });
  return {
    paths: Array.from(countries).map((name) => ({
      params: { country: countryToSlug(name) },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const countryParam = context.params?.country as string;
  const countryName = slugToCountry(countryParam);
  const cards = (giftcardsData as GiftCard[]).filter((card) =>
    (card.countriesAvailableForUse as Country[]).some(
      (c) =>
        typeof c.name === "string" && countryToSlug(c.name) === countryParam,
    ),
  );

  if (!cards.length) {
    return { notFound: true };
  }

  return {
    props: {
      cards: JSON.parse(JSON.stringify(cards)),
      countryName,
      countryParam,
    },
  };
};

export default function CountryPage({
  cards,
  countryName,
  countryParam,
}: {
  cards: GiftCard[];
  countryName: string;
  countryParam: string;
}) {
  return (
    <>
      <Head>
        <title>Buy Gift Cards in {countryName} | Digital Vouchers</title>
        <meta
          name="description"
          content={`Browse and buy digital gift cards available for use in ${countryName}. Fast delivery, secure checkout, and top brands.`}
        />
        <meta
          property="og:title"
          content={`Buy Gift Cards in ${countryName}`}
        />
        <meta
          property="og:description"
          content={`Browse and buy digital gift cards available for use in ${countryName}.`}
        />
        <meta property="og:url" content={`/${countryParam}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Buy Gift Cards in ${countryName}`}
        />
        <meta
          name="twitter:description"
          content={`Browse and buy digital gift cards available for use in ${countryName}.`}
        />
      </Head>

      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, mb: 2 }}
          >
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
                    {card.operatorCode ? (
                      <img
                        src={`https://imagerepo.ding.com/logo/${card.operatorCode}.png?width=245&compress=none`}
                        alt={`${card.name} logo`}
                        width={85}
                        height={50}
                        style={{ borderRadius: 6, marginRight: 16 }}
                      />
                    ) : (
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
                    )}
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
    </>
  );
}
