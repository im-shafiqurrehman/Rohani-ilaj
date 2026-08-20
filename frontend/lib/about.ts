import type { Lang } from "./i18n";

/*
 * Every fact here was supplied by the practitioner. Nothing is inferred.
 * Do not add certifications, licences, titles, a photograph, success rates or
 * testimonials to this file unless they have actually been provided.
 */
export const PRACTITIONER = {
  nameUr: "ابن یونس",
  nameEn: "Ibn Younas",
  experienceYears: 30,
};

export const ABOUT: Record<Lang, {
  eyebrow: string;
  title: string;
  lede: string;
  intro: string[];
  profileHeading: string;
  fields: { label: string; value: string }[];
  approachHeading: string;
  approach: string[];
  trustHeading: string;
  trust: string;
  ctaHeading: string;
  ctaBody: string;
  cta: string;
  ctaSecondary: string;
}> = {
  ur: {
    eyebrow: "ہمارے بارے میں",
    title: "روحانی علاج سنٹر کے بارے میں",
    lede: "یہ صفحہ اس لیے ہے کہ مشاورت بک کرنے سے پہلے آپ جان لیں کہ روحانی علاج سنٹر کے پیچھے کون ہیں۔",
    intro: [
      "روحانی علاج سنٹر اپنی خدمات ابن یونس کی رہنمائی میں پیش کرتا ہے۔ یہاں ہر بات قرآن و سنت کے دائرے میں رہ کر کی جاتی ہے، اور جو بات شریعت میں نہیں، اُس سے صاف انکار کیا جاتا ہے۔",
      "ہم کسی نتیجے کی ضمانت نہیں دیتے۔ شفا صرف اللہ تعالیٰ کے اختیار میں ہے۔ ہماری ذمہ داری صرف اتنی ہے کہ آپ کی بات تحمل سے سنی جائے اور آپ کو مسنون طریقے سے رہنمائی دی جائے۔",
    ],
    profileHeading: "معالج کا تعارف",
    fields: [
      { label: "نام", value: "ابن یونس" },
      { label: "تعلیم", value: "اسلامک اسٹڈیز گریجویشن" },
      { label: "تربیت", value: "سعودی علماء سے تربیت یافتہ" },
      { label: "تجربہ", value: "30 سال" },
    ],
    approachHeading: "تجربہ اور طریقہ کار",
    approach: [
      "ابن یونس کو اس شعبے میں 30 سال کا تجربہ حاصل ہے، اور اُنہوں نے سعودی علماء سے تربیت حاصل کی ہے۔ اسلامک اسٹڈیز میں گریجویشن اُن کی تعلیمی بنیاد ہے۔",
      "اسی تجربے کی وجہ سے ہر معاملے کو جلد بازی کے بجائے تحمل سے سمجھا جاتا ہے، اور صرف وہی عمل کیا جاتا ہے جو قرآن و سنت سے ثابت ہو۔ کوئی تعویذ، کوئی توہم پرستی، اور کوئی جھوٹا وعدہ نہیں۔",
    ],
    trustHeading: "آپ کے اطمینان کے لیے",
    trust: "کسی سے اپنا ذاتی معاملہ بیان کرنے سے پہلے یہ جاننا آپ کا حق ہے کہ سامنے کون ہے۔ اسی لیے یہ تفصیل یہاں کھلے طور پر درج کی گئی ہے۔ آپ کی گفتگو خفیہ رہتی ہے اور کسی کے ساتھ شیئر نہیں کی جاتی۔",
    ctaHeading: "بات کرنا چاہتے ہیں؟",
    ctaBody: "ابتدائی مشاورت فون پر ہوتی ہے۔ اپنی سہولت کے مطابق وقت منتخب کر لیں۔",
    cta: "مشاورت بک کریں",
    ctaSecondary: "خدمات دیکھیں",
  },

  en: {
    eyebrow: "About us",
    title: "About Rohani Ilaj Center",
    lede: "This page exists so that you know who is behind Rohani Ilaj Center before you book a consultation.",
    intro: [
      "Rohani Ilaj Center offers its services under the guidance of Ibn Younas. Everything here is done within the bounds of the Quran and Sunnah, and anything falling outside Shariah is declined.",
      "We do not guarantee any outcome. Healing rests with Allah alone. What we are responsible for is listening to you patiently and offering guidance in the established way.",
    ],
    profileHeading: "About the practitioner",
    fields: [
      { label: "Name", value: "Ibn Younas" },
      { label: "Education", value: "Graduate in Islamic Studies" },
      { label: "Training", value: "Trained under Saudi scholars" },
      { label: "Experience", value: "30 years" },
    ],
    approachHeading: "Experience and approach",
    approach: [
      "Ibn Younas has 30 years of experience in this field and received his training under Saudi scholars. His academic grounding is a graduation in Islamic Studies.",
      "That experience is why each case is understood patiently rather than rushed, and why only practices established in the Quran and Sunnah are used. No amulets, no superstition, and no false promises.",
    ],
    trustHeading: "So you can be at ease",
    trust: "Before describing a personal matter to anyone, you have every right to know who you are speaking with. That is why these details are stated openly here. Your conversation stays confidential and is never shared with anyone.",
    ctaHeading: "Would you like to talk?",
    ctaBody: "The initial consultation is held by phone. Choose a time that suits you.",
    cta: "Book a Consultation",
    ctaSecondary: "View services",
  },
};
