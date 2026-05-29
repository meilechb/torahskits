import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Karla } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://torahskits.com"),
  title: {
    default: "Torah Skits — A new parsha skit every week",
    template: "%s — Torah Skits",
  },
  description:
    "A new parsha skit every week — to watch with your family, and to recreate with your class. Free to watch; subscribe for the full recreate kit.",
  openGraph: {
    title: "Torah Skits — A new parsha skit every week",
    description:
      "A new parsha skit every week — to watch with your family, and to recreate with your class.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${frankRuhl.variable} ${karla.variable}`}>
      <body>{children}</body>
    </html>
  );
}
