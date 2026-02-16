import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gift Cards — Buy & Send Instantly",
  description:
    "Browse and buy digital gift cards with instant delivery. Safe, secure, and trusted worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M12 4v16" />
                  <path d="M2 12h20" />
                  <path d="M7 4c0 0 5 4 5 8" />
                  <path d="M17 4c0 0-5 4-5 8" />
                </svg>
              </div>
              <span className="font-display text-xl text-ink">GiftCards</span>
            </a>
            <nav className="hidden sm:flex items-center gap-6 text-sm text-ink-muted">
              <a href="/" className="hover:text-brand-600 transition-colors">
                All Cards
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-slate-200 mt-20 py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-ink-muted">
            <p>
              © {new Date().getFullYear()} GiftCards. Instant digital delivery
              worldwide.
            </p>
            <p className="mt-2">
              Safe & secure payments · Certified reseller · Trusted by millions
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
