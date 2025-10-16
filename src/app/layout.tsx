// src/app/layout.tsx
import "./globals.css";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = "G-69K81LZV5Z"; // your GA ID

  return (
    <html lang="en">
      <body>
        {children}

        {/* Google Analytics (GA4) */}
        <>
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
        </>
      </body>
    </html>
  );
}
