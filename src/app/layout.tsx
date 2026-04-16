import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { RouteTracker } from "@app/RouteTracker";
import Toaster from "@/components/Toaster/Toaster";

export const metadata: Metadata = {
  title: "My Tour",
  description: "Start planning your trip here",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Armenian:wght@100..900&display=swap"
          rel="stylesheet"
        />

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LR06FNJXEX"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date());
            gtag('config', 'G-LR06FNJXEX');
          `}
        </Script>

        <Script src="//code.jivo.ru/widget/FMSjYIFi9d" strategy="afterInteractive" />

        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','1289356012185073');
            fbq('track','PageView');
          `}
        </Script>

        <Script
          src="https://dev.visualwebsiteoptimizer.com/j.php?a=1004380"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1289356012185073&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Providers>
          <Suspense>
            <RouteTracker />
            {children}
            <Toaster />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
