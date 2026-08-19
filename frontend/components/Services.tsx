import Link from "next/link";
import ArchCard from "./ArchCard";
import PatternDivider from "./PatternDivider";

const services = [
  {
    title: "ابتدائی کال",
    price: "2,000 روپے",
    duration: "30 منٹ",
    desc: "فون یا گوگل میٹ پر ابتدائی گفتگو، مسئلے کو سمجھنا اور اگلے قدم کی رہنمائی۔",
    href: "/booking?service=call",
  },
  {
    title: "فزیکل سیشن",
    price: "5,000 روپے",
    duration: "زیادہ سے زیادہ 1 گھنٹہ",
    desc: "حمزہ ٹاؤن 144، لاہور میں براہِ راست ملاقات — علاج کی نوعیت کے مطابق وقت میں کمی بیشی ممکن ہے۔",
    href: "/booking?service=physical",
  },
];

export default function Services() {
  return (
    <section id="khidmaat" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-4xl text-navy">
          ہماری <span className="text-gold-gradient">خدمات</span>
        </h2>
        <PatternDivider />

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {services.map((s) => (
            <ArchCard key={s.title} archHeight={56} className="flex flex-col p-8 pt-12">
              <h3 className="text-2xl text-navy">{s.title}</h3>
              <p className="mt-2 font-body text-2xl font-semibold text-gold-dark">
                {s.price}
              </p>
              <p className="font-body text-sm text-navy/55">{s.duration}</p>
              <p className="mt-4 flex-1 font-body text-sm leading-7 text-navy/80">
                {s.desc}
              </p>
              <Link
                href={s.href}
                className="mt-6 rounded-full bg-navy py-2.5 font-body text-sm text-white transition hover:bg-navy-light"
              >
                بک کریں
              </Link>
            </ArchCard>
          ))}
        </div>
      </div>
    </section>
  );
}
