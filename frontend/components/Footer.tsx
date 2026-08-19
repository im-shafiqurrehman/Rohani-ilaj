import Image from "next/image";

const WA = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923173810763").replace(/\D/g, "");
const ADDRESS = process.env.NEXT_PUBLIC_ADDRESS || "حمزہ ٹاؤن 144، لاہور";
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "";

const SOCIALS = [
  {
    name: "Instagram",
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    path: "M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 5.16a4.64 4.64 0 1 0 0 9.28 4.64 4.64 0 0 0 0-9.28Zm0 7.65a3.01 3.01 0 1 1 0-6.02 3.01 3.01 0 0 1 0 6.02Zm5.91-7.83a1.08 1.08 0 1 1-2.17 0 1.08 1.08 0 0 1 2.17 0Z",
  },
  {
    name: "Facebook",
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z",
  },
  {
    name: "TikTok",
    href: process.env.NEXT_PUBLIC_TIKTOK_URL || "",
    path: "M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.84-2.48V9.77a5.71 5.71 0 1 0 4.93 5.65V9.01a7.35 7.35 0 0 0 4.29 1.38V7.3a4.29 4.29 0 0 1-3.23-1.48Z",
  },
].filter((s) => s.href);

export default function Footer() {
  return (
    <footer className="border-t border-gold/40 bg-gold-soft px-6 py-14">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
        <Image
          src="/asset/logo-mark.png"
          alt=""
          width={421}
          height={541}
          className="h-14 w-auto"
        />
        <h3 className="mt-1 text-2xl text-navy">روحانی علاج سنٹر</h3>
        <p className="font-body text-sm text-navy/70">{ADDRESS}</p>

        <a
          href={`https://wa.me/${WA}`}
          className="font-body text-sm font-semibold text-gold-dark transition hover:text-navy"
        >
          واٹس ایپ: 0317-3810763
        </a>

        {EMAIL && (
          <a
            href={`mailto:${EMAIL}`}
            dir="ltr"
            className="font-body text-sm text-navy/70 transition hover:text-gold-dark"
          >
            {EMAIL}
          </a>
        )}

        {SOCIALS.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-deep bg-white text-navy transition hover:bg-navy hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        )}

        <p className="mt-6 font-body text-xs text-navy/45">
          © {new Date().getFullYear()} Rohani Illaj Center. تمام حقوق محفوظ ہیں۔
        </p>
      </div>
    </footer>
  );
}
