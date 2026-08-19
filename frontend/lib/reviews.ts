/*
 * ─────────────────────────────────────────────────────────────────────────
 *  PLACEHOLDER CONTENT — REPLACE BEFORE LAUNCH
 * ─────────────────────────────────────────────────────────────────────────
 *  These are NOT real client testimonials. They are sample entries showing
 *  the shape and the tone to use, so the section can be styled and reviewed
 *  now and filled with genuine feedback later.
 *
 *  Publishing invented testimonials as if they were real would be both
 *  misleading to people who are often in genuine distress and a policy
 *  problem on ad platforms. Swap every entry below for feedback an actual
 *  client has given permission to publish, then delete this notice.
 *
 *  Tone rules for real entries, matching the rest of the site:
 *    - "rehnumai" / "mashwara" (guidance, consultation) — never a promise
 *      of a cure or a guaranteed result.
 *    - First name + city is enough; do not publish full names or numbers
 *      without written permission.
 *    - Keep each entry to two or three lines so the section stays scannable
 *      for readers who are not comfortable with long blocks of text.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type Review = {
  name: string;
  city: string;
  rating: number; // 1-5
  service: "call" | "physical";
  text: string;
};

/** Flip to true once the entries below are real, published-with-permission
 *  feedback. While false, the section renders a quiet "coming soon" state in
 *  production instead of showing sample text to real visitors. */
export const REVIEWS_ARE_REAL = false;

export const REVIEWS: Review[] = [
  {
    name: "عبد اللہ",
    city: "لاہور",
    rating: 5,
    service: "call",
    text: "بات تحمل سے سنی گئی اور قرآن و سنت کی روشنی میں واضح رہنمائی دی گئی۔ کوئی غیر شرعی بات نہیں کی گئی۔",
  },
  {
    name: "فاطمہ",
    city: "راولپنڈی",
    rating: 5,
    service: "call",
    text: "ابتدائی کال پر مسئلہ اطمینان سے سمجھا گیا اور مسنون اذکار بتائے گئے۔ رابطے کا طریقہ آسان تھا۔",
  },
  {
    name: "محمد عمر",
    city: "لاہور",
    rating: 4,
    service: "physical",
    text: "فزیکل سیشن میں پورا وقت دیا گیا اور ہر بات شریعت کے دائرے میں رہ کر بتائی گئی۔",
  },
  {
    name: "زینب",
    city: "فیصل آباد",
    rating: 5,
    service: "call",
    text: "وقت مقررہ پر رابطہ ہوا اور کسی قسم کا غیر ضروری دباؤ نہیں ڈالا گیا۔ مشورہ مفید رہا۔",
  },
  {
    name: "بلال",
    city: "لاہور",
    rating: 5,
    service: "physical",
    text: "ادائیگی اور بکنگ کا طریقہ سیدھا تھا، تصدیق کے بعد واٹس ایپ پر تفصیل مل گئی۔",
  },
  {
    name: "عائشہ",
    city: "ملتان",
    rating: 4,
    service: "call",
    text: "سوالات کے جواب صبر سے دیے گئے اور جو بات شریعت میں نہیں تھی اُس سے صاف منع کیا گیا۔",
  },
];

export const AVERAGE_RATING =
  Math.round(
    (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length) * 10
  ) / 10;
