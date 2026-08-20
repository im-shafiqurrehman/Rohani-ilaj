
export type Review = {
  name: string;
  city: string;
  rating: number; // 1-5
  service: "call" | "physical";
  text: string;
  textEn: string;
};


export const REVIEWS: Review[] = [
  {
    name: "عبد اللہ",
    city: "لاہور",
    rating: 5,
    service: "call",
    text: "بات تحمل سے سنی گئی اور قرآن و سنت کی روشنی میں واضح رہنمائی دی گئی۔ کوئی غیر شرعی بات نہیں کی گئی۔",
    textEn:
      "I was heard patiently and given clear guidance in the light of the Quran and Sunnah. Nothing outside Shariah was suggested.",
  },
  {
    name: "فاطمہ",
    city: "راولپنڈی",
    rating: 5,
    service: "call",
    text: "ابتدائی کال پر مسئلہ اطمینان سے سمجھا گیا اور مسنون اذکار بتائے گئے۔ رابطے کا طریقہ آسان تھا۔",
    textEn:
      "On the initial call my situation was understood calmly and established supplications were explained. Getting in touch was simple.",
  },
  {
    name: "محمد عمر",
    city: "لاہور",
    rating: 4,
    service: "physical",
    text: "فزیکل سیشن میں پورا وقت دیا گیا اور ہر بات شریعت کے دائرے میں رہ کر بتائی گئی۔",
    textEn:
      "In the physical session I was given the full time, and everything was explained within the bounds of Shariah.",
  },
  {
    name: "زینب",
    city: "فیصل آباد",
    rating: 5,
    service: "call",
    text: "وقت مقررہ پر رابطہ ہوا اور کسی قسم کا غیر ضروری دباؤ نہیں ڈالا گیا۔ مشورہ مفید رہا۔",
    textEn:
      "Contact was made exactly at the appointed time and there was no unnecessary pressure. The advice was useful.",
  },
  {
    name: "بلال",
    city: "لاہور",
    rating: 5,
    service: "physical",
    text: "ادائیگی اور بکنگ کا طریقہ سیدھا تھا، تصدیق کے بعد واٹس ایپ پر تفصیل مل گئی۔",
    textEn:
      "Payment and booking were straightforward, and the details came through once it was verified.",
  },
  {
    name: "عائشہ",
    city: "ملتان",
    rating: 4,
    service: "call",
    text: "سوالات کے جواب صبر سے دیے گئے اور جو بات شریعت میں نہیں تھی اُس سے صاف منع کیا گیا۔",
    textEn:
      "My questions were answered patiently, and anything not permitted in Shariah was clearly declined.",
  },
];

export const AVERAGE_RATING =
  Math.round(
    (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length) * 10
  ) / 10;
