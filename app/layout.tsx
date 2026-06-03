import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Karla } from "next/font/google";
import "./globals.css";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  SITE_KEYWORDS,
  jsonLd,
} from "@/lib/seo";

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-serif",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-karla",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Torah Skits — A new parsha skit every week",
    template: "%s — Torah Skits",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "Torah Skits — A new parsha skit every week",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Torah Skits — A new parsha skit every week",
    description: DEFAULT_DESCRIPTION,
  },
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/opengraph-image`,
  description: DEFAULT_DESCRIPTION,
};
const siteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/browse?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${frankRuhl.variable} ${karla.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(orgLd)}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(siteLd)}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
