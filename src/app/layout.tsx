// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Inter, Cormorant_Garamond } from "next/font/google";

// Sans-serif for body text - clean, modern, readable
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
});

// Luxury serif for headlines - elegant, high-fashion, soothing
const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "WithinYouAi - Luxury Self-Discovery",
  description: "Unlock the life you're meant to live through AI-powered transformation sessions. Transform in 15 minutes with our exclusive VIP experience.",
  keywords: ["self-discovery", "AI transformation", "personal growth", "luxury coaching", "life clarity"],
  authors: [{ name: "WithinYouAi" }],
  openGraph: {
    title: "WithinYouAi - Luxury Self-Discovery",
    description: "Unlock the life you're meant to live through AI-powered transformation sessions.",
    type: "website",
  },
};

export default function RootLayout({ 
  children 
}: Readonly<{ 
  children: React.ReactNode 
}>) {
  const GA_ID = "G-69K81LZV5Z";

  return (
    <html lang="en" className={`${inter.variable} ${cormorantGaramond.variable}`}>
      <head>
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#050814] text-[#F3F4F6] antialiased">
        {children}

        {/* Google Analytics (GA4) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              send_page_view: true,
              debug_mode: true
            });
          `}
        </Script>
      </body>
    </html>
  );
}