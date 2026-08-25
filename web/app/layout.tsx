import type { Metadata } from "next";
import { Instrument_Serif, Figtree } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LaunchSequence from "@/components/LaunchSequence";
import { site } from "@/content/site";
import "./globals.css";

/**
 * Display face — Instrument Serif, specified by the client.
 *
 * Ships a single weight (400) plus italic; there is no bold and no variable
 * axis. Its presence at display sizes comes from the face itself, not weight.
 *
 * NOTE: this supersedes brief R11, which specified Fraunces with WONK at 0.
 * Changed on instruction; the brief has not been reissued.
 */
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
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
