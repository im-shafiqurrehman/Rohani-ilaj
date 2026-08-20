import { SITE } from "./site";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://rohaniilajcenter.vercel.app"
).replace(/\/+$/, "");

export const ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/process", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/reviews", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/booking", priority: 0.9, changeFrequency: "monthly" as const },
];

export const SERVICES = [
  {
    name: "Initial Call",
    nameUrdu: "ابتدائی کال",
    price: 2000,
    minutes: 30,
    description:
      "An opening consultation by phone call to understand the matter and give guidance within Shariah.",
  },
  {
    name: "Physical Session",
    nameUrdu: "فزیکل سیشن",
    price: 5000,
    minutes: 30,
    description:
      "A face-to-face consultation in Lahore covering jinn expulsion and other serious matters, handled strictly within Shariah. The duration can be extended as the case requires.",
  },
];

/** LocalBusiness is what puts a practice into map results and the local pack. */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: "Rohani Ilaj Center",
    alternateName: "روحانی علاج سنٹر",
    url: SITE_URL,
    image: `${SITE_URL}/asset/logo-full.png`,
    logo: `${SITE_URL}/asset/logo-mark.png`,
    description:
      "Spiritual guidance and consultation grounded strictly in the Quran and Sunnah, for matters of black magic, jinn, the evil eye and envy. Lahore, Pakistan.",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    areaServed: [
      { "@type": "City", name: "Lahore" },
      { "@type": "Country", name: "Pakistan" },
    ],
    ...(SITE.whatsapp ? { telephone: SITE.whatsapp } : {}),
    ...(SITE.email ? { email: SITE.email } : {}),
    priceRange: "PKR 2,000 - 5,000",
    currenciesAccepted: "PKR",
    paymentAccepted: "Bank transfer, JazzCash, Easypaisa, Debit card, Credit card",
    knowsLanguage: ["ur", "en"],
    sameAs: [SITE.instagram, SITE.facebook, SITE.tiktok, SITE.youtube].filter(
      Boolean
    ),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Consultations",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
        },
        price: String(s.price),
        priceCurrency: "PKR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/booking`,
      })),
    },
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Rohani Ilaj Center",
    inLanguage: ["ur", "en"],
    publisher: { "@id": `${SITE_URL}/#business` },
  };
}
