import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://withinyou-ai.vercel.app"),
  title: "WithinYou",
  description: "Your dream life is within you. Discover it in 15 minutes.",
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/app-icon.png"
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "WithinYou",
    description: "Your dream life is within you. Discover it in 15 minutes.",
    url: "/",
    siteName: "WithinYou",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "WithinYou",
    description: "Your dream life is within you. Discover it in 15 minutes.",
    images: ["/og.png"]
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
