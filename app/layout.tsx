import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const siteUrl = "https://airwatergo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Global Air & Water Observatory",
    template: "%s | Global Air & Water Observatory",
  },
  description:
    "Track global air quality and safe drinking-water coverage with transparent methodology and public data sources.",
  applicationName: "Global Air & Water Observatory",
  keywords: [
    "air quality",
    "PM2.5",
    "water quality",
    "drinking water",
    "OpenAQ",
    "World Bank",
    "environment dashboard",
    "climate data",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Global Air & Water Observatory",
    title: "Global Air & Water Observatory",
    description:
      "Open-data dashboards for PM2.5 air quality and safely managed drinking water coverage.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Air & Water Observatory",
    description:
      "Open-data dashboards for PM2.5 air quality and safely managed drinking water coverage.",
  },
  category: "environment",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Global Air & Water Observatory",
  url: siteUrl,
  logo: `${siteUrl}/globe.svg`,
  sameAs: ["https://github.com/SongZstrong/airwatermonitor"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@airwatermonitor.org",
      availableLanguage: ["English"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NavBar />
        <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm text-slate-500">
            <p>
              Data sources: OpenAQ, World Bank, Rest Countries. Updated where live APIs allow.
            </p>
            <div className="flex items-center gap-4">
              <a className="hover:text-slate-900" href="/about">About</a>
              <a className="hover:text-slate-900" href="/privacy">Privacy</a>
              <a className="hover:text-slate-900" href="/terms">Terms</a>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
