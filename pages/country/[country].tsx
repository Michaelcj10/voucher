import giftcards from "../../data/giftcards.json";
import { GetStaticPaths, GetStaticProps } from "next";
import { Box, Container, Typography, Grid, Card } from "@mui/material";
import Link from "next/link";
import { countryToSlug, slugToCountry } from "../../utils/countrySlug";

type GiftCard = (typeof giftcards)[number];

type Props = {
  country: string;
  cards: GiftCard[];
};

export default function CountryPage({ country, cards }: Props) {
  const countryName = slugToCountry(country);
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
                href={`/${card.url}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card
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
                    {card.name
                      .split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
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
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const countries = new Set<string>();
  (giftcards as GiftCard[]).forEach((card) => {
    (card.countriesAvailableForUse || []).forEach((c) =>
      countries.add(countryToSlug(c.name)),
    );
  });
  return {
    paths: Array.from(countries).map((country) => ({ params: { country } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const country = context.params?.country as string;
  const cards = (giftcards as GiftCard[]).filter((card) =>
    (card.countriesAvailableForUse || []).some(
      (c) => countryToSlug(c.name) === country,
    ),
  );
  return {
    props: {
      country,
      cards,
    },
  };
};
