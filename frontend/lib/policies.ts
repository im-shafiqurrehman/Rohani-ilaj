import type { Lang } from "./i18n";

export type Block = { h?: string; p?: string[]; ul?: string[] };
export type Policy = { eyebrow: string; title: string; updated: string; blocks: Block[] };
export type PolicyKey = "privacy" | "terms" | "refunds" | "cancellation";

const UPDATED_EN = "20 August 2026";
const UPDATED_UR = "20 اگست 2026";

export const POLICIES: Record<Lang, Record<PolicyKey, Policy>> = {
  en: {
    privacy: {
      eyebrow: "Legal", title: "Privacy Policy", updated: UPDATED_EN,
      blocks: [
        { p: ["People who contact Rohani Ilaj Center often share sensitive personal matters. We treat that seriously. This page explains what we collect, why, and what we do with it."] },
        { h: "What we collect", ul: [
          "When you book: your name, phone number, email address, chosen appointment time, and a screenshot of your payment receipt.",
          "When you create an account: your name, phone number, email address, and a password stored only as an irreversible hash.",
          "When you use the contact form: your name, phone number, optional email address, and your message.",
        ], p: ["We do not ask for, and you should not send, national identity numbers, bank passwords, card PINs, or one-time codes."] },
        { h: "What we do with it", ul: [
          "Confirm your appointment and verify your payment.",
          "Email you the outcome of that verification and your session details.",
          "Reply to your enquiries.",
        ], p: ["We do not sell your information, and we do not use it for advertising."] },
        { h: "Confidentiality of consultations", p: ["What you discuss during a consultation is confidential. It is not shared with other clients, published, or used as an example without your explicit permission. Testimonials are published only when someone has agreed to it."] },
        { h: "Who else handles your data", p: ["We use a small number of external services to run the site. Each sees only what it needs:"], ul: [
          "Calendly, for appointment scheduling.",
          "Cloudinary, to store payment receipt images.",
          "MongoDB Atlas, to store booking and account records.",
          "Vercel, to host the website.",
          "An email provider, to send confirmations.",
        ] },
        { h: "How long we keep it", p: ["Booking records and payment receipts are kept while they may be needed for reference or dispute resolution. You can ask us to delete your account and associated records at any time."] },
        { h: "Your choices", p: ["You can ask us to show you what we hold about you, correct it, or delete it. Contact us using the details on our contact page and we will respond as quickly as we reasonably can."] },
        { h: "Changes", p: ["If this policy changes, the date at the top of this page changes with it."] },
      ],
    },
    terms: {
      eyebrow: "Legal", title: "Terms & Conditions", updated: UPDATED_EN,
      blocks: [
        { h: "What this service is", p: ["Rohani Ilaj Center provides spiritual guidance and consultation grounded in the Quran and Sunnah. Sessions consist of discussion, counsel, and established supplications and remembrances."] },
        { h: "What this service is not", p: ["This is not medical care, psychiatric care, psychological therapy, or legal or financial advice, and it is not a substitute for any of them. If you have a medical or mental health condition, please consult a qualified doctor or mental health professional. Never stop or change a prescribed treatment on the basis of anything discussed here. In an emergency, contact emergency services."] },
        { h: "No guaranteed outcome", p: ["Healing and outcomes rest with Allah alone. We make no promise or guarantee of any particular result. Anyone suggesting we guarantee results is not speaking for us."] },
        { h: "What we will not do", p: ["We decline any request that falls outside the bounds of Shariah, regardless of what is offered in return. This includes amulets, harm to another person, and anything not established in the Quran and Sunnah."] },
        { h: "Booking and eligibility", ul: [
          "You must be 18 or older to book, or have the consent of a parent or guardian.",
          "Provide accurate contact details. Confirmations are sent by email, so an incorrect address means you will not receive them.",
          "Appointments are confirmed only after your payment has been verified.",
        ] },
        { h: "Your conduct", p: ["Consultations are conducted with mutual respect. We may end a session and decline future bookings in cases of abuse, threats, or repeated requests for services we have declined."] },
        { h: "Fees", p: ["Fees are shown on the services page and are payable in advance in Pakistani Rupees. We may change fees at any time; the fee that applies is the one shown when you book."] },
        { h: "Liability", p: ["To the fullest extent permitted by law, Rohani Ilaj Center is not liable for decisions you take following a consultation. You remain responsible for your own choices, including all medical, legal and financial ones."] },
        { h: "Governing law", p: ["These terms are governed by the laws of Pakistan."] },
      ],
    },
    refunds: {
      eyebrow: "Legal", title: "Refund Policy", updated: UPDATED_EN,
      blocks: [
        { h: "Before your appointment", ul: [
          "Payment not verified: the booking is rejected and nothing is charged. If money did leave your account, contact us with the receipt and we will return it in full.",
          "You cancel at least 24 hours ahead: full refund, or the fee is credited toward a rescheduled appointment, whichever you prefer.",
          "You cancel within 24 hours: we would rather reschedule you than refund. A refund at this point is at our discretion.",
          "We cancel or cannot attend: full refund, or a rescheduled appointment at a time that suits you. Your choice.",
        ] },
        { h: "After your appointment", p: [
          "Once a consultation has taken place, the fee covers the time and guidance given and is not refundable. This is because no particular outcome is promised at any point.",
          "If a session could not go ahead for a technical reason on our side, or was cut significantly short by us, contact us and we will make it right, either by completing the session or by refunding it.",
        ] },
        { h: "How to request a refund", p: ["Use the contact form or WhatsApp, and include your name, the phone number you booked with, and your slot reference if you have it. Refunds are returned to the account the payment came from and normally take three to seven working days after approval."] },
        { h: "Payments from someone else's account", p: ["Where a payment was made from another person's account, any refund is returned to that same account, not to a different one."] },
      ],
    },
    cancellation: {
      eyebrow: "Legal", title: "Cancellation & Rescheduling", updated: UPDATED_EN,
      blocks: [
        { h: "Rescheduling", p: [
          "Life gets in the way, and we would always rather move your appointment than lose it. Contact us at least 24 hours before your slot and we will move you to another available time at no extra cost.",
          "Appointments can be rescheduled twice. Beyond that we will ask you to book again, so that slots are not held indefinitely.",
        ] },
        { h: "Cancelling", ul: [
          "24 hours or more before: cancel for a full refund, or keep the fee as credit toward a future appointment.",
          "Less than 24 hours before: we will offer to reschedule. A refund is at our discretion.",
        ] },
        { h: "If you do not attend", p: ["If you miss your appointment without telling us, the fee is not refundable, because the time was held for you and could not be offered to anyone else. If something genuinely unavoidable happened, contact us and we will consider it fairly."] },
        { h: "If we need to change your appointment", p: ["If we have to cancel or move your appointment, we will tell you as early as we can and offer either a new time of your choosing or a full refund."] },
        { h: "How to reach us", p: ["Use the contact form or WhatsApp, and include the phone number you booked with and your slot reference. Please do not rely on a message sent minutes before your slot; give us enough notice to act on it."] },
      ],
    },
  },

  ur: {
    privacy: {
      eyebrow: "قانونی", title: "پرائیویسی پالیسی", updated: UPDATED_UR,
      blocks: [
        { p: ["جو لوگ روحانی علاج سنٹر سے رابطہ کرتے ہیں، وہ اکثر نہایت ذاتی اور نازک معاملات بتاتے ہیں۔ ہم اسے سنجیدگی سے لیتے ہیں۔ اس صفحے میں بتایا گیا ہے کہ ہم کیا معلومات لیتے ہیں، کیوں لیتے ہیں، اور اُن کا کیا کرتے ہیں۔"] },
        { h: "ہم کیا معلومات لیتے ہیں", ul: [
          "بکنگ کے وقت: آپ کا نام، فون نمبر، ای میل ایڈریس، منتخب کردہ وقت، اور ادائیگی کی رسید کا اسکرین شاٹ۔",
          "اکاؤنٹ بناتے وقت: آپ کا نام، فون نمبر، ای میل ایڈریس، اور پاس ورڈ جو صرف ناقابلِ واپسی خفیہ شکل میں محفوظ کیا جاتا ہے۔",
          "رابطہ فارم بھرتے وقت: آپ کا نام، فون نمبر، ای میل (اختیاری) اور آپ کا پیغام۔",
        ], p: ["ہم شناختی کارڈ نمبر، بینک پاس ورڈ، کارڈ پن یا او ٹی پی نہیں مانگتے، اور آپ کو بھی یہ کبھی نہیں بھیجنی چاہئیں۔"] },
        { h: "ہم اِن کا کیا کرتے ہیں", ul: [
          "آپ کی نشست کی تصدیق اور ادائیگی کی جانچ۔",
          "تصدیق کا نتیجہ اور نشست کی تفصیلات آپ کو ای میل پر بھیجنا۔",
          "آپ کے سوالات کا جواب دینا۔",
        ], p: ["ہم آپ کی معلومات نہ بیچتے ہیں اور نہ اشتہارات کے لیے استعمال کرتے ہیں۔"] },
        { h: "گفتگو کی رازداری", p: ["نشست کے دوران جو بات ہوتی ہے وہ خفیہ رہتی ہے۔ اسے کسی دوسرے کلائنٹ کو نہیں بتایا جاتا، شائع نہیں کیا جاتا، اور آپ کی صریح اجازت کے بغیر بطور مثال بھی استعمال نہیں کیا جاتا۔ تاثرات صرف اُسی صورت میں شائع کیے جاتے ہیں جب متعلقہ شخص اجازت دے۔"] },
        { h: "آپ کی معلومات اور کون دیکھتا ہے", p: ["ویب سائٹ چلانے کے لیے ہم چند بیرونی سروسز استعمال کرتے ہیں۔ ہر ایک کو صرف اُتنا ہی نظر آتا ہے جتنا ضروری ہو:"], ul: [
          "کیلنڈلی، وقت مقرر کرنے کے لیے۔",
          "کلاؤڈینری، رسید کی تصاویر محفوظ کرنے کے لیے۔",
          "منگو ڈی بی اٹلس، بکنگ اور اکاؤنٹ ریکارڈ کے لیے۔",
          "ورسل، ویب سائٹ ہوسٹ کرنے کے لیے۔",
          "ای میل سروس، تصدیقی پیغامات بھیجنے کے لیے۔",
        ] },
        { h: "معلومات کب تک رکھی جاتی ہیں", p: ["بکنگ کا ریکارڈ اور رسیدیں اُس وقت تک رکھی جاتی ہیں جب تک وہ حوالے یا کسی تنازع کے حل کے لیے درکار ہو سکتی ہیں۔ آپ جب چاہیں اپنا اکاؤنٹ اور متعلقہ ریکارڈ حذف کرانے کا کہہ سکتے ہیں۔"] },
        { h: "آپ کے اختیارات", p: ["آپ ہم سے پوچھ سکتے ہیں کہ ہمارے پاس آپ کی کون سی معلومات ہیں، اُنہیں درست کرا سکتے ہیں، یا حذف کرا سکتے ہیں۔ رابطہ صفحے پر دی گئی تفصیلات کے ذریعے ہم سے رابطہ کریں، ہم جلد از جلد جواب دیں گے۔"] },
        { h: "تبدیلیاں", p: ["اگر یہ پالیسی تبدیل ہوتی ہے تو اوپر دی گئی تاریخ بھی بدل جائے گی۔"] },
      ],
    },
    terms: {
      eyebrow: "قانونی", title: "شرائط و ضوابط", updated: UPDATED_UR,
      blocks: [
        { h: "یہ خدمت کیا ہے", p: ["روحانی علاج سنٹر قرآن و سنت کی بنیاد پر روحانی رہنمائی اور مشورہ فراہم کرتا ہے۔ نشست میں گفتگو، مشورہ اور مسنون دعائیں و اذکار شامل ہوتے ہیں۔"] },
        { h: "یہ خدمت کیا نہیں ہے", p: ["یہ طبی علاج، نفسیاتی علاج، سائیکالوجیکل تھراپی، یا قانونی و مالی مشورہ نہیں ہے، اور نہ ہی اِن میں سے کسی کا متبادل ہے۔ اگر آپ کو کوئی طبی یا ذہنی صحت کا مسئلہ ہے تو براہِ کرم مستند ڈاکٹر یا ماہرِ نفسیات سے رجوع کریں۔ یہاں ہونے والی کسی بات کی بنیاد پر اپنا تجویز کردہ علاج ہرگز بند یا تبدیل نہ کریں۔ ہنگامی صورتحال میں فوری طور پر ایمرجنسی سروسز سے رابطہ کریں۔"] },
        { h: "کسی نتیجے کی ضمانت نہیں", p: ["شفا اور نتیجہ صرف اللہ تعالیٰ کے اختیار میں ہے۔ ہم کسی مخصوص نتیجے کا وعدہ یا ضمانت نہیں دیتے۔ اگر کوئی شخص یہ کہے کہ ہم نتیجے کی ضمانت دیتے ہیں تو وہ ہماری طرف سے نہیں بول رہا۔"] },
        { h: "ہم کیا نہیں کریں گے", p: ["ہر وہ درخواست جو شریعت کے دائرے سے باہر ہو، ہم اُس سے انکار کرتے ہیں، خواہ بدلے میں کچھ بھی پیش کیا جائے۔ اس میں تعویذ گنڈا، کسی دوسرے کو نقصان پہنچانا، اور ہر وہ عمل شامل ہے جو قرآن و سنت سے ثابت نہ ہو۔"] },
        { h: "بکنگ اور اہلیت", ul: [
          "بکنگ کے لیے آپ کی عمر 18 سال یا اس سے زیادہ ہونی چاہیے، یا والدین کی اجازت ہونی چاہیے۔",
          "درست رابطہ تفصیلات دیں۔ تصدیق ای میل پر بھیجی جاتی ہے، اس لیے غلط ای میل کا مطلب ہے کہ آپ تک اطلاع نہیں پہنچے گی۔",
          "نشست کی تصدیق صرف ادائیگی کی جانچ مکمل ہونے کے بعد ہوتی ہے۔",
        ] },
        { h: "آپ کا رویہ", p: ["نشستیں باہمی احترام کے ساتھ ہوتی ہیں۔ بدتمیزی، دھمکی، یا اُن خدمات کے بار بار مطالبے کی صورت میں جن سے ہم انکار کر چکے ہوں، ہم نشست ختم کر سکتے ہیں اور آئندہ بکنگ سے معذرت کر سکتے ہیں۔"] },
        { h: "فیس", p: ["فیس خدمات کے صفحے پر درج ہے اور پیشگی، پاکستانی روپے میں ادا کی جاتی ہے۔ ہم فیس کبھی بھی تبدیل کر سکتے ہیں؛ آپ پر وہی فیس لاگو ہوگی جو بکنگ کے وقت درج تھی۔"] },
        { h: "ذمہ داری", p: ["قانون کی حد تک، نشست کے بعد آپ جو فیصلے کرتے ہیں اُن کی ذمہ داری روحانی علاج سنٹر پر نہیں۔ اپنے فیصلوں کے ذمہ دار آپ خود ہیں، بشمول تمام طبی، قانونی اور مالی فیصلوں کے۔"] },
        { h: "قابلِ اطلاق قانون", p: ["یہ شرائط پاکستان کے قوانین کے تابع ہیں۔"] },
      ],
    },
    refunds: {
      eyebrow: "قانونی", title: "رقم کی واپسی کی پالیسی", updated: UPDATED_UR,
      blocks: [
        { h: "نشست سے پہلے", ul: [
          "ادائیگی کی تصدیق نہ ہو سکے: بکنگ مسترد کر دی جاتی ہے اور کوئی رقم نہیں لی جاتی۔ اگر رقم آپ کے اکاؤنٹ سے نکل چکی ہو تو رسید کے ساتھ رابطہ کریں، پوری رقم واپس کر دی جائے گی۔",
          "آپ کم از کم 24 گھنٹے پہلے منسوخ کریں: پوری رقم واپس، یا آپ کی مرضی پر یہ فیس اگلی نشست کے لیے محفوظ رکھی جا سکتی ہے۔",
          "آپ 24 گھنٹے کے اندر منسوخ کریں: ہم رقم واپس کرنے کے بجائے وقت تبدیل کرنے کو ترجیح دیں گے۔ اس مرحلے پر رقم کی واپسی ہماری صوابدید پر ہے۔",
          "ہم منسوخ کریں یا حاضر نہ ہو سکیں: پوری رقم واپس، یا آپ کی پسند کے وقت پر نئی نشست۔ فیصلہ آپ کا۔",
        ] },
        { h: "نشست کے بعد", p: [
          "نشست ہو جانے کے بعد فیس دیے گئے وقت اور رہنمائی کے عوض ہوتی ہے اور واپس نہیں کی جاتی، کیونکہ کسی بھی مرحلے پر کسی مخصوص نتیجے کا وعدہ نہیں کیا جاتا۔",
          "اگر نشست ہماری طرف سے کسی تکنیکی وجہ سے نہ ہو سکی ہو، یا ہماری وجہ سے نمایاں طور پر مختصر رہی ہو، تو رابطہ کریں۔ ہم یا تو نشست مکمل کریں گے یا رقم واپس کر دیں گے۔",
        ] },
        { h: "رقم کی واپسی کیسے مانگیں", p: ["رابطہ فارم یا واٹس ایپ استعمال کریں، اور اپنا نام، وہ فون نمبر جس سے بکنگ کی، اور سلاٹ نمبر (اگر موجود ہو) لکھیں۔ رقم اُسی اکاؤنٹ میں واپس کی جاتی ہے جس سے ادائیگی ہوئی تھی، اور منظوری کے بعد عام طور پر تین سے سات کاروباری دن لگتے ہیں۔"] },
        { h: "کسی اور کے اکاؤنٹ سے ادائیگی", p: ["اگر ادائیگی کسی اور شخص کے اکاؤنٹ سے کی گئی ہو تو رقم اُسی اکاؤنٹ میں واپس کی جائے گی، کسی دوسرے اکاؤنٹ میں نہیں۔"] },
      ],
    },
    cancellation: {
      eyebrow: "قانونی", title: "منسوخی اور وقت کی تبدیلی", updated: UPDATED_UR,
      blocks: [
        { h: "وقت تبدیل کرانا", p: [
          "مصروفیات آ ہی جاتی ہیں، اور ہم نشست ضائع کرنے کے بجائے اُس کا وقت بدلنا زیادہ پسند کرتے ہیں۔ اپنی نشست سے کم از کم 24 گھنٹے پہلے رابطہ کریں، ہم بغیر کسی اضافی فیس کے آپ کو دستیاب وقت پر منتقل کر دیں گے۔",
          "وقت زیادہ سے زیادہ دو بار تبدیل کیا جا سکتا ہے۔ اس کے بعد ہم آپ سے دوبارہ بکنگ کرنے کا کہیں گے، تاکہ اوقات غیر معینہ مدت تک روکے نہ رہیں۔",
        ] },
        { h: "منسوخ کرنا", ul: [
          "24 گھنٹے یا اس سے پہلے: پوری رقم واپس، یا فیس آئندہ نشست کے لیے محفوظ۔",
          "24 گھنٹے سے کم وقت میں: ہم وقت تبدیل کرنے کی پیشکش کریں گے۔ رقم کی واپسی ہماری صوابدید پر ہے۔",
        ] },
        { h: "اگر آپ حاضر نہ ہوں", p: ["اگر آپ بتائے بغیر نشست پر حاضر نہ ہوں تو فیس واپس نہیں کی جاتی، کیونکہ وہ وقت آپ کے لیے مخصوص تھا اور کسی اور کو نہیں دیا جا سکا۔ اگر واقعی کوئی ناگزیر مجبوری پیش آئی ہو تو رابطہ کریں، ہم انصاف کے ساتھ غور کریں گے۔"] },
        { h: "اگر ہمیں وقت بدلنا پڑے", p: ["اگر ہمیں آپ کی نشست منسوخ یا تبدیل کرنی پڑے تو ہم جتنا جلد ممکن ہو آپ کو اطلاع دیں گے اور یا تو آپ کی پسند کا نیا وقت دیں گے یا پوری رقم واپس کر دیں گے۔"] },
        { h: "ہم سے رابطہ", p: ["رابطہ فارم یا واٹس ایپ استعمال کریں، اور وہ فون نمبر اور سلاٹ نمبر لکھیں جس سے بکنگ کی تھی۔ براہِ کرم نشست سے چند منٹ پہلے بھیجے گئے پیغام پر انحصار نہ کریں؛ ہمیں عمل کرنے کے لیے مناسب وقت دیں۔"] },
      ],
    },
  },
};
