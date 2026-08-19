import PatternDivider from "./PatternDivider";

const points = [
  "قرآن و سنت سے ثابت شدہ مسنون دعائیں اور اذکار",
  "غیر شرعی یا خلافِ شریعت امور پر رابطہ قبول نہیں کیا جاتا",
  "جادو، جنات، نظرِ بد اور حسد سے متعلق رہنمائی",
];

export default function Trust() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl text-navy">
          ہمارا <span className="text-gold-gradient">طریقہ کار</span>
        </h2>
        <PatternDivider />
        <ul className="mt-10 space-y-5 text-right font-body text-base leading-8 text-navy/85">
          {points.map((p) => (
            <li key={p} className="flex items-start justify-end gap-3">
              <span>{p}</span>
              <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gold-deep" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
