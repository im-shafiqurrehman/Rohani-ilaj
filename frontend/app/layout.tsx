import type { Metadata, Viewport } from "next";
import { Noto_Nastaliq_Urdu, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import JsonLd from "@/components/JsonLd";
import { localBusinessJsonLd, websiteJsonLd, SITE_URL } from "@/lib/seo";
import { LanguageProvider } from "@/components/LanguageProvider";
import { DEFAULT_LANG, dirFor } from "@/lib/i18n";
import {
  DEFAULT_PALETTE,
  DEFAULT_THEME,
  PALETTE_IDS,
  paletteCss,
  themeColor,
} from "@/lib/palettes";

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-nastaliq",
  display: "swap",
});

// Editorial serif for the English display type — light weights carry the
// "premium" read far better than a heavy decorative face.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_NAME = "Rohani Ilaj Center | روحانی علاج سنٹر";
const DESCRIPTION =
  "قرآن و سنت کی روشنی میں روحانی رہنمائی۔ جادو، جنات، نظرِ بد اور حسد کا شرعی علاج۔ لاہور۔";

export const metadata: Metadata = {
  // Makes every relative URL below resolve absolutely, which OG and canonical
  // tags require.
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | Rohani Ilaj Center` },
  description: DESCRIPTION,
  applicationName: "Rohani Ilaj Center",
  authors: [{ name: "Rohani Ilaj Center" }],
  creator: "Rohani Ilaj Center",
  publisher: "Rohani Ilaj Center",
  alternates: {
    canonical: "/",
    languages: { "ur-PK": "/", "en-PK": "/" },
  },
  category: "Spiritual guidance",
  formatDetection: { telephone: true, address: true, email: true },
  keywords: [
    "روحانی علاج",
    "جادو کا علاج",
    "نظر بد",
    "حسد",
    "جنات",
    "rohani ilaj",
    "rohani ilaj Lahore",
  ],
  openGraph: {
    title: SITE_NAME,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Rohani Ilaj Center",
    locale: "ur_PK",
    alternateLocale: ["en_PK"],
    type: "website",
    images: [
      {
        url: "/asset/logo-full.png",
        width: 887,
        height: 825,
        alt: "Rohani Ilaj Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: ["/asset/logo-full.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/asset/logo-mark.png", apple: "/asset/logo-mark.png" },
};

export const viewport: Viewport = {
  // Matches the default palette's dark ink; ThemeProvider rewrites it on switch.
  themeColor: themeColor(DEFAULT_PALETTE, DEFAULT_THEME),
  width: "device-width",
  initialScale: 1,
};

const NO_FLASH = `
(function(){
  var el = document.documentElement;
  el.classList.add('js');
  var PALETTES = ${JSON.stringify(PALETTE_IDS)};
  try {
    var storedLang = localStorage.getItem('rohani-lang');
    var lang = (storedLang === 'ur' || storedLang === 'en') ? storedLang : ${JSON.stringify(DEFAULT_LANG)};
    el.setAttribute('lang', lang);
    el.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
    var storedTheme = localStorage.getItem('rohani-theme');
    var theme = (storedTheme === 'light' || storedTheme === 'dark')
      ? storedTheme
      : ${JSON.stringify(DEFAULT_THEME)};
    var storedPalette = localStorage.getItem('rohani-palette');
    var palette = PALETTES.indexOf(storedPalette) !== -1
      ? storedPalette
      : ${JSON.stringify(DEFAULT_PALETTE)};
    el.setAttribute('data-theme', theme);
    el.setAttribute('data-palette', palette);
  } catch (e) {
    el.setAttribute('lang', ${JSON.stringify(DEFAULT_LANG)});
    el.setAttribute('dir', ${JSON.stringify(dirFor(DEFAULT_LANG))});
    el.setAttribute('data-theme', ${JSON.stringify(DEFAULT_THEME)});
    el.setAttribute('data-palette', ${JSON.stringify(DEFAULT_PALETTE)});
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={DEFAULT_LANG}
      dir={dirFor(DEFAULT_LANG)}
      data-theme={DEFAULT_THEME}
      data-palette={DEFAULT_PALETTE}
      suppressHydrationWarning
    >
      <head>
        {/* Generated from lib/palettes.ts — every theme's tokens, server
            rendered so colours are correct on the very first paint. */}
        <style dangerouslySetInnerHTML={{ __html: paletteCss() }} />
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
        <JsonLd data={[localBusinessJsonLd(), websiteJsonLd()]} />
      </head>
      <body
        className={`${nastaliq.variable} ${cormorant.variable} ${inter.variable} bg-ink font-urdu text-fg antialiased`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
