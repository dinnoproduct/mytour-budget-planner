import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { RouteTracker } from "@app/RouteTracker";
import Toaster from "@/components/Toaster/Toaster";

const STAGING_ENV_VALUES = new Set(["stage", "staging", "test", "qa"]);
const appEnv = process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase();
const apiUrl = process.env.NEXT_PUBLIC_API_URL?.toLowerCase();
const isStaging =
  process.env.VERCEL_ENV === "preview" ||
  (appEnv !== undefined && STAGING_ENV_VALUES.has(appEnv)) ||
  (apiUrl !== undefined &&
    (apiUrl.includes(".test.") || apiUrl.includes("staging")));

export const metadata: Metadata = {
  title: "My Tour",
  description: "Start planning your trip here",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  keywords: ["travel", "group tours"],
  openGraph: {
    type: "website",
    url: "/",
    title: "My Tour",
    description: "Start planning your trip here",
    siteName: "My Tour",
    images: [{ url: "https://dinnotravel.blob.core.windows.net/marketing/MyTour%20-%20avatar.png", width: 1200, height: 630 }]
  },
  assets: ["/assets"],
  category: "travel",
  classification: "tourism",
  robots: {
    index: !isStaging,
    follow: !isStaging,
    googleBot: {
      index: !isStaging,
      follow: !isStaging,
      noimageindex: isStaging,
    },
  },
};

//  Metadata = {
//   metadataBase: new URL("https://example.com"),
//   title: {
//     default: "My Tour",
//     template: "%s | My Tour",
//     // absolute: "Some page title" // optional, bypasses parent template
//   },
//   description: "Site description",
//   applicationName: "My Tour",
//   authors: [{ name: "Team", url: "https://example.com" }],
//   generator: "Next.js",
//   keywords: ["travel", "group tours"],
//   referrer: "origin-when-cross-origin",
//   creator: "My Tour",
//   publisher: "My Tour",
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: { index: true, follow: true }
//   },
//   alternates: {
//     canonical: "/",
//     languages: {
//       "en-US": "/en",
//       "hy-AM": "/hy",
//       "ru-RU": "/ru"
//     }
//   },
//   icons: {
//     icon: "/favicon.svg",
//     shortcut: "/favicon.svg",
//     apple: "/apple-touch-icon.png"
//   },
//   manifest: "/site.webmanifest",
//   openGraph: {
//     type: "website",
//     url: "/",
//     title: "My Tour",
//     description: "Best tours",
//     siteName: "My Tour",
//     images: [{ url: "/og.png", width: 1200, height: 630 }]
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "My Tour",
//     description: "Best tours",
//     images: ["/og.png"]
//   },
//   facebook: { appId: "1234567890" }, // or admins: ["..."]
//   verification: {
//     google: "google-verification-token",
//     yandex: "yandex-token"
//   },
//   appleWebApp: {
//     capable: true,
//     title: "My Tour",
//     statusBarStyle: "black-translucent"
//   },
//   formatDetection: {
//     telephone: false,
//     email: false,
//     address: false
//   },
//   itunes: {
//     appId: "123456789",
//     appArgument: "https://example.com"
//   },
//   appLinks: {
//     ios: { url: "https://example.com", app_store_id: "123" },
//     android: { package: "com.example.app", url: "https://example.com" }
//   },
//   archives: ["/archive"],
//   assets: ["/assets"],
//   bookmarks: ["/bookmarks"],
//   pagination: {
//     previous: "/page/1",
//     next: "/page/3"
//   },
//   category: "travel",
//   classification: "tourism",
//   other: {
//     "custom-meta": "value"
//   },
// };



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
