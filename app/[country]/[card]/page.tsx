import giftcards from "../../../data/giftcards.json";
import { notFound } from "next/navigation";
import { countryToSlug, slugToCountry } from "../../../utils/countrySlug";
import { Box, Container, Typography } from "@mui/material";

export default function CardPage({
  params,
}: {
  params: { country: string; card: string };
}) {
  const { country, card } = params;
  const countryName = slugToCountry(country);
  const cardData = (giftcards as any[]).find(
    (c) =>
      c.url === card &&
      (c.countriesAvailableForUse || []).some(
        (cc: any) => countryToSlug(cc.name) === country,
      ),
  );
  if (!cardData) return notFound();

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          {cardData.name} in {countryName}
        </Typography>
        <Typography variant="body1" sx={{ color: "#888", mb: 5 }}>
          {cardData.description}
        </Typography>
        {/* Add more card details here as needed */}
      </Container>
    </Box>
  );
}
