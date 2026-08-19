import ArchCard from "./ArchCard";
import PatternDivider from "./PatternDivider";
import { AVERAGE_RATING, REVIEWS, REVIEWS_ARE_REAL } from "@/lib/reviews";

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} میں سے 5`}
      dir="ltr"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={i <= rating ? "text-gold-deep" : "text-navy/15"}
          fill="currentColor"
        >
          <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.35l-5.81 3.05 1.11-6.47L2.6 9.35l6.5-.95L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  // The section always renders. While the data file still holds sample
  // entries, a visible badge says so — showing invented testimonials as if
  // they were real would mislead people who are often in genuine distress,
  // and the badge disappears on its own once REVIEWS_ARE_REAL is flipped.
  const hasReviews = REVIEWS.length > 0;

  return (
    <section id="tassurat" className="bg-navy-soft px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-4xl text-navy">
          لوگوں کے <span className="text-gold-gradient">تاثرات</span>
        </h2>
        <PatternDivider />

        {hasReviews ? (
          <>
            <div className="mt-6 flex flex-col items-center gap-2">
              <Stars rating={Math.round(AVERAGE_RATING)} size={22} />
              <p className="font-body text-sm text-navy/70">
                <span className="font-semibold text-navy">{AVERAGE_RATING}</span>{" "}
                اوسط درجہ بندی — {REVIEWS.length} تاثرات
              </p>
              {!REVIEWS_ARE_REAL && (
                <p className="mt-1 rounded-full border border-gold-deep bg-gold-soft px-4 py-1 font-body text-xs text-gold-dark">
                  نمونہ مواد — اصل تاثرات آنے پر تبدیل کیا جائے گا
                </p>
              )}
            </div>

            <div className="mt-12 grid gap-8 text-right sm:grid-cols-2 lg:grid-cols-3">
              {REVIEWS.map((r) => (
                <ArchCard
                  key={`${r.name}-${r.city}-${r.text.slice(0, 12)}`}
                  archHeight={40}
                  className="flex h-full flex-col p-6 pt-9"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-navy/5 px-3 py-1 font-body text-[11px] text-navy/60">
                      {r.service === "call" ? "ابتدائی کال" : "فزیکل سیشن"}
                    </span>
                    <Stars rating={r.rating} />
                  </div>

                  <p className="mt-4 flex-1 font-body text-sm leading-7 text-navy/85">
                    {r.text}
                  </p>

                  <div className="mt-5 flex items-center justify-end gap-3 border-t border-gold/40 pt-4">
                    <div className="text-right">
                      <p className="font-body text-sm font-semibold text-navy">
                        {r.name}
                      </p>
                      <p className="font-body text-xs text-navy/55">{r.city}</p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-gold-light to-gold font-body text-sm font-semibold text-navy"
                    >
                      {r.name.slice(0, 1)}
                    </span>
                  </div>
                </ArchCard>
              ))}
            </div>
          </>
        ) : (
          <p className="mx-auto mt-8 max-w-xl font-body text-base leading-8 text-navy/75">
            ہم صرف اُنہی تاثرات کو شائع کرتے ہیں جو ہمارے کلائنٹس نے خود اجازت کے
            ساتھ بھیجے ہوں۔ اگر آپ ہماری خدمات لے چکے ہیں تو نیچے دیے گئے فارم کے
            ذریعے اپنا تاثر ضرور بھیجیں۔
          </p>
        )}

        <a
          href="#rabta"
          className="mt-12 inline-block rounded-full border border-gold-deep bg-white px-8 py-3 font-body text-sm font-semibold text-navy transition hover:bg-gold-soft"
        >
          اپنا تاثر بھیجیں
        </a>
      </div>
    </section>
  );
}
