import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LaunchSequence from "@/components/LaunchSequence";
import { site } from "@/content/site";
import "./globals.css";

/**
 * Display face. WONK is held at 0 so Fraunces reads sharp rather than quirky
 * (brief R11); SOFT is held at 0 for the same reason.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  weight: "variable",
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
    <html lang="en-AU" className={`${fraunces.variable} ${figtree.variable}`}>
      <body>
        <LaunchSequence />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
