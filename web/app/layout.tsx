import type { Metadata } from "next";
import { Bodoni_Moda, Figtree } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LaunchSequence from "@/components/LaunchSequence";
import { site } from "@/content/site";
import "./globals.css";

/**
 * Display face. A Didone, to match the reference the client supplied — high
 * stroke contrast, fine hairlines, a true italic for the accent lines.
 *
 * NOTE: this supersedes brief R11, which specified Fraunces with WONK at 0.
 * Changed on the client's instruction; the brief has not been reissued.
 *
 * Variable font, so weight is omitted (see next/font docs); opsz carries the
 * contrast and is pinned to 96, its maximum, on display sizes.
 */
const display = Bodoni_Moda({
  subsets: ["latin"],
  axes: ["opsz"],
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
