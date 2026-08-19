import Image from "next/image";
import Link from "next/link";
import PatternDivider from "./PatternDivider";

const sparks = [
  { top: "18%", left: "12%", size: 6, delay: "0s" },
  { top: "30%", left: "85%", size: 4, delay: "0.6s" },
  { top: "68%", left: "8%", size: 5, delay: "1.1s" },
  { top: "75%", left: "90%", size: 6, delay: "0.3s" },
  { top: "12%", left: "50%", size: 4, delay: "1.6s" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-gold/40 bg-white pattern-lattice">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

      {sparks.map((s, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full bg-gold-deep animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center animate-rise-in">
        <Image
          src="/asset/logo-full.png"
          alt="روحانی علاج سنٹر"
          width={887}
          height={825}
          priority
          className="h-40 w-auto sm:h-52"
        />

        <span className="mt-6 rounded-full border border-gold-deep/50 bg-gold-soft px-4 py-1 font-body text-xs tracking-widest text-gold-dark">
          قرآن و سنت کی روشنی میں
        </span>

        <h1 className="mt-6 text-5xl leading-[1.3] text-navy sm:text-6xl">
          روحانی <span className="text-gold-gradient">علاج</span>
        </h1>

        <PatternDivider />

        <p className="mt-4 max-w-xl font-body text-lg leading-8 text-navy/80">
          جادو، جنات، نظرِ بد اور حسد کے مسائل میں شرعی بنیادوں پر رہنمائی اور
          مشورہ۔
        </p>
        <p className="mt-2 font-body text-sm text-gold-dark">
          ⚠️ صرف شرعی علاج پیش کیا جاتا ہے
        </p>

        <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Link
            href="/booking?service=call"
            className="rounded-full bg-navy px-8 py-3 font-body font-semibold text-white shadow-card transition hover:bg-navy-light"
          >
            ابتدائی کال — 2,000 روپے
          </Link>
          <Link
            href="/booking?service=physical"
            className="rounded-full border border-gold-deep bg-gradient-to-b from-gold-light to-gold px-8 py-3 font-body font-semibold text-navy shadow-gold transition hover:brightness-105"
          >
            فزیکل سیشن — 5,000 روپے
          </Link>
        </div>
      </div>
    </section>
  );
}
