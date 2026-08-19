import type { Metadata, Viewport } from "next";
import { Noto_Nastaliq_Urdu, Cinzel, Inter } from "next/font/google";
import "./globals.css";

const nastaliq = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-nastaliq",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_NAME = "روحانی علاج سنٹر | Rohani Illaj Center";
const DESCRIPTION =
  "قرآن و سنت کی روشنی میں روحانی رہنمائی — جادو، جنات، نظرِ بد اور حسد کا شرعی علاج۔ حمزہ ٹاؤن 144، لاہور۔";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "روحانی علاج",
    "جادو کا علاج",
    "نظر بد",
    "حسد",
    "جنات",
    "rohani illaj",
    "rohani ilaj Lahore",
  ],
  openGraph: {
    title: SITE_NAME,
    description: DESCRIPTION,
    locale: "ur_PK",
    type: "website",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/asset/logo.png", apple: "/asset/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ur" dir="rtl">
      <body
        className={`${nastaliq.variable} ${cinzel.variable} ${inter.variable} bg-white text-navy font-urdu antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
