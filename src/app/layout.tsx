import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&family=Playfair+Display:ital,wght@1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
