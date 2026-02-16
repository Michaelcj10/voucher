import { ReactNode } from "react";
import MuiRootProvider from "./MuiRootProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Buy digital gift cards instantly for any country. Fast delivery, secure checkout, and top brands."
        />
        <meta
          property="og:title"
          content="Digital Gift Cards, Delivered Instantly"
        />
        <meta
          property="og:description"
          content="Buy digital gift cards instantly for any country. Fast delivery, secure checkout, and top brands."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta
          property="og:image"
          content="https://yourdomain.com/og-image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Digital Gift Cards, Delivered Instantly"
        />
        <meta
          name="twitter:description"
          content="Buy digital gift cards instantly for any country. Fast delivery, secure checkout, and top brands."
        />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/og-image.png"
        />
        <link rel="canonical" href="https://yourdomain.com/" />
      </head>
      <body>
        <MuiRootProvider>{children}</MuiRootProvider>
      </body>
    </html>
  );
}
