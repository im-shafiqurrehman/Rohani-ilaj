import PatternDivider from "./PatternDivider";

const steps = [
  { n: "۱", title: "سروس منتخب کریں", desc: "ابتدائی کال یا فزیکل سیشن میں سے چنیں۔" },
  { n: "۲", title: "وقت منتخب کریں", desc: "دستیاب اوقات میں سے اپنی پسند کا وقت بک کریں۔" },
  { n: "۳", title: "کارڈ سے ادائیگی", desc: "اپنے ڈیبٹ یا کریڈٹ کارڈ سے دیے گئے بینک اکاؤنٹ میں رقم منتقل کریں۔" },
  { n: "۴", title: "رسید اپلوڈ کریں", desc: "ادائیگی کا اسکرین شاٹ، اکاؤنٹ ٹائٹل اور ٹرانزیکشن آئی ڈی درج کریں۔" },
  { n: "۵", title: "تصدیق کا انتظار", desc: "تصدیق کے بعد واٹس ایپ پر تفصیلات موصول ہوں گی۔" },
];

export default function HowItWorks() {
  return (
    <section id="tareeqa" className="bg-navy-soft px-6 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-4xl text-navy">
          بکنگ کا <span className="text-gold-gradient">طریقہ کار</span>
        </h2>
        <PatternDivider />

        <div className="mt-14 grid gap-10 sm:grid-cols-3 lg:grid-cols-5">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-deep bg-gradient-to-b from-gold-light to-gold font-display text-xl text-navy shadow-gold">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg text-navy">{s.title}</h3>
              <p className="mt-2 font-body text-sm leading-6 text-navy/70">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
