import type { Metadata } from "next";
import { Archivo_Black, DM_Sans, Space_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { siteConfig } from "@/lib/config";
import "./globals.css";
import { jsonLdString } from "@/lib/jsonLd";
import { baseOpenGraph } from "@/lib/metadata";

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.metaDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    ...baseOpenGraph,
    title: siteConfig.title,
    description: siteConfig.metaDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: "Software Engineer",
    sameAs: [
      siteConfig.socials.github,
      siteConfig.socials.linkedin,
      siteConfig.socials.x,
      siteConfig.socials.goodreads,
      siteConfig.socials.soundcloud,
    ],
  };

  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        {/* Rendered here rather than via metadata.alternates.types: every page sets its own `alternates` (for the canonical), which would replace it. React hoists this into <head>. */}
        <link rel="alternate" type="application/rss+xml" title={siteConfig.name} href="/blog/feed.xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(personJsonLd) }} />
        <a href="#main" className="skip-link font-mono-label">
          Skip to content
        </a>
        <ThemeProvider>
          <ReadingProgressBar />
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />}
    </html>
  );
}
