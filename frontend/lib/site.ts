/** Single place the env-driven site details are read, so components don't
 *  each re-implement the fallbacks. */

const clean = (v?: string) => (v || "").trim();

/*
 * TWO NUMBERS, TWO PURPOSES:
 *
 *  - SITE.whatsapp (below) is the public enquiry line. It is deliberately in
 *    this bundle, because the whole point is that anyone can reach it.
 *
 *  - The practitioner's own number lives in backend/.env as
 *    SESSION_CONTACT_NUMBER and is NEVER shipped to the client. The API
 *    attaches it per-booking, only once that booking is approved.
 */
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
  /** Drop a file at public/asset/banner.jpg (or set the env var) and the
   *  home page hero switches from type-only to the banner treatment. */
  banner: clean(process.env.NEXT_PUBLIC_BANNER_URL),
};

/** Public "get in touch" target — the on-site form. */
export const CONTACT_LINK = "/#contact";

/** wa.me needs digits only, no + or spaces. Empty when unset, so callers can
 *  fall back to the form rather than linking to a broken wa.me/ URL. */
export const WHATSAPP_LINK = SITE.whatsapp
  ? `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}`
  : "";

export const SOCIALS = [
  { key: "instagram", label: "Instagram", href: SITE.instagram },
  { key: "facebook", label: "Facebook", href: SITE.facebook },
  { key: "tiktok", label: "TikTok", href: SITE.tiktok },
  { key: "youtube", label: "YouTube", href: SITE.youtube },
].filter((s) => Boolean(s.href));

export const NAV = [
  { href: "/#services", label: "Services" },
  { href: "/#process", label: "How it works" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];
