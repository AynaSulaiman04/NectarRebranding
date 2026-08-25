import type { Metadata } from "next";
import { Playfair_Display, Figtree } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LaunchSequence from "@/components/LaunchSequence";
import { site } from "@/content/site";
import "./globals.css";

/**
 * Display face, matched to the reference Ayna supplied: high stroke contrast,
 * narrow-ish proportions, a calligraphic italic for the accent words.
 *
 * One family carries both settings — bold on the hero, regular on the dark
 * statement beat — so the site stays on two families total.
 *
 * NOTE: this supersedes brief R11, which specified Fraunces with WONK at 0.
 * Changed on instruction; the brief has not been reissued.
 *
 * Variable font, so weight is omitted (see next/font docs). No opsz axis on
 * this family — contrast comes from the design, not an axis.
 */
const display = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} — business consulting for Australian organisations`,
    template: `%s — ${site.name}`,
  },
  description:
    "Business solutions, process optimisation and regulatory compliance for Australian organisations. Anything that improves efficiency for the business.",
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: site.name,
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${display.variable} ${figtree.variable}`}>
      <body>
        <LaunchSequence />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
