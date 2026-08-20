
const clean = (v?: string) => (v || "").trim();

export const SITE = {
  name: "Rohani Ilaj Center",
  nameUrdu: "روحانی علاج سنٹر",
  whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  email: clean(process.env.NEXT_PUBLIC_EMAIL),
  address: clean(process.env.NEXT_PUBLIC_ADDRESS) || "Lahore, Pakistan",
  instagram: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  facebook: clean(process.env.NEXT_PUBLIC_FACEBOOK_URL),
  tiktok: clean(process.env.NEXT_PUBLIC_TIKTOK_URL),
  youtube: clean(process.env.NEXT_PUBLIC_YOUTUBE_URL),
  banner: clean(process.env.NEXT_PUBLIC_BANNER_URL),
};

/** Public "get in touch" target — the on-site form. */
export const CONTACT_LINK = "/contact";

export const WHATSAPP_LINK = SITE.whatsapp
  ? `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`
  : "";

export const SOCIALS = [
  { key: "instagram", label: "Instagram", href: SITE.instagram },
  { key: "facebook", label: "Facebook", href: SITE.facebook },
  { key: "tiktok", label: "TikTok", href: SITE.tiktok },
  { key: "youtube", label: "YouTube", href: SITE.youtube },
].filter((s) => Boolean(s.href));

/* Header carries five items. "How It Works" and "Reviews" are both sections of
 * the home page, so they live in the footer instead rather than widening the
 * header past what fits on a laptop. */
export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/** Everything, including the pages the header leaves out. */
export const FOOTER_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "How It Works" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/feedback", label: "Share Your Experience" },
];

export const POLICY_NAV = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refunds", label: "Refund Policy" },
  { href: "/cancellation", label: "Cancellation & Rescheduling" },
];
