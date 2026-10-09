import type { Metadata } from "next";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sub-signal.vercel.app"),
  title: {
    default: "Sub Signal — Underground Artist Discovery",
    template: "%s — Sub Signal",
  },
  description:
    "Spotlighting rising artists before they break through. Origin stories, stats, and sounds from beneath the mainstream.",
  keywords: [
    "music discovery",
    "underground artists",
    "indie music",
    "electronic music",
    "emerging artists",
    "before they made it",
    "artist stories",
  ],
  openGraph: {
    type: "website",
    siteName: "Sub Signal",
    title: "Sub Signal — Underground Artist Discovery",
    description:
      "Spotlighting rising artists before they break through. Origin stories, stats, and sounds from beneath the mainstream.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sub Signal — Underground Artist Discovery",
    description:
      "Spotlighting rising artists before they break through.",
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
  return (
    <html lang="en">
      <head>
        {/* Fonts are self-hosted (see globals.css). Preload only the ones the first screen uses. */}
        <link rel="preload" href="/fonts/barlow-condensed-normal-900-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/barlow-condensed-normal-700-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/barlow-normal-300-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
