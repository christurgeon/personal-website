import type { Metadata } from "next";
import { Archivo_Black, DM_Sans, Space_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { siteConfig } from "@/lib/config";
import "./globals.css";

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
    title: siteConfig.title,
    description: siteConfig.metaDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/profile.jpg", alt: siteConfig.name }],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <ThemeProvider>
          <ReadingProgressBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />}
    </html>
  );
}
