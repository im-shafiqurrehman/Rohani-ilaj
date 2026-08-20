export type Faq = { q: string; a: string };

export const FAQS: Record<"ur" | "en", Faq[]> = {
  ur: [
  {
    q: "کیا یہاں صرف شرعی علاج کیا جاتا ہے؟",
    a: "جی ہاں۔ صرف قرآن و سنت سے ثابت شدہ مسنون دعائیں اور اذکار بتائے جاتے ہیں۔ کسی بھی غیر شرعی عمل، تعویذ گنڈے یا خلافِ شریعت طریقے پر کام نہیں کیا جاتا۔",
  },
  {
    q: "ابتدائی کال اور فزیکل سیشن میں کیا فرق ہے؟",
    a: "ابتدائی کال 30 منٹ کی ہوتی ہے اور فون یا گوگل میٹ پر ہوتی ہے، جس کی فیس 2,000 روپے ہے۔ فزیکل سیشن بھی 30 منٹ کا ہے اور لاہور میں روبرو ہوتا ہے، جس کی فیس 5,000 روپے ہے۔ ضرورت کے مطابق فزیکل سیشن کا وقت بڑھایا جا سکتا ہے۔",
  },
  {
    q: "ادائیگی کا طریقہ کیا ہے؟",
    a: "ادائیگی صرف کارڈ کے ذریعے ہوتی ہے۔ آپ اپنے ڈیبٹ یا کریڈٹ کارڈ سے موبائل بینکنگ ایپ، اے ٹی ایم یا آن لائن بینکنگ کے ذریعے دیے گئے بینک اکاؤنٹ میں رقم منتقل کرتے ہیں، اور پھر صرف رسید کا اسکرین شاٹ اپلوڈ کر دیتے ہیں۔ ٹرانزیکشن آئی ڈی یا اکاؤنٹ ٹائٹل لکھنے کی ضرورت نہیں۔",
  },
  {
    q: "ادائیگی کے بعد کیا ہوتا ہے؟",
    a: "آپ کی رسید کی دستی تصدیق کی جاتی ہے۔ تصدیق مکمل ہونے پر واٹس ایپ پر نشست کی مکمل تفصیلات، وقت اور رابطے کا طریقہ، بھیج دی جاتی ہیں۔ عام طور پر اس میں چند گھنٹے لگتے ہیں۔",
  },
  {
    q: "کیا بکنگ کے لیے اکاؤنٹ بنانا ضروری ہے؟",
    a: "نہیں۔ بکنگ بغیر اکاؤنٹ کے مکمل ہو جاتی ہے۔ اکاؤنٹ بنانا اختیاری ہے، اس کا فائدہ صرف یہ ہے کہ آپ بعد میں لاگ اِن کر کے اپنی بکنگ کی صورتحال (زیرِ غور، منظور، یا مسترد) خود دیکھ سکتے ہیں۔",
  },
  {
    q: "کیا میری بات چیت خفیہ رہے گی؟",
    a: "جی ہاں۔ آپ کی گفتگو، تفصیلات اور رابطے کی معلومات کسی کے ساتھ شیئر نہیں کی جاتیں۔",
  },
  {
    q: "کیا شفا کی ضمانت دی جاتی ہے؟",
    a: "نہیں۔ شفا صرف اللہ تعالیٰ کے ہاتھ میں ہے۔ یہاں صرف شرعی رہنمائی، مشورہ اور مسنون اذکار پیش کیے جاتے ہیں۔ کوئی ضمانت یا دعویٰ نہیں کیا جاتا۔",
  },
  {
    q: "اگر ادائیگی کے بعد بکنگ مسترد ہو جائے تو؟",
    a: "اگر رسید کی تصدیق نہ ہو سکے تو بکنگ مسترد کر دی جاتی ہے اور وجہ بتا دی جاتی ہے۔ ایسی صورت میں براہِ کرم واٹس ایپ پر رابطہ کریں تاکہ معاملہ حل کیا جا سکے۔",
  },
],
  en: [
    {
      q: "Is the treatment here strictly within Shariah?",
      a: "Yes. Only supplications and remembrances established in the Quran and Sunnah are given. No amulets, no invented practices, and nothing that falls outside Shariah.",
    },
    {
      q: "What is the difference between the initial call and a physical session?",
      a: "The initial call is 30 minutes by phone or Google Meet and costs Rs 2,000. The physical session is also 30 minutes, held in person in Lahore, and costs Rs 5,000. A physical session can run longer if the case requires it.",
    },
    {
      q: "How do I pay?",
      a: "By card only. You transfer the fee to the bank account shown, using your mobile banking app, an ATM, or online banking, and then upload a screenshot of the receipt.",
    },
    {
      q: "What happens after I pay?",
      a: "Your receipt is checked by hand. Once it is approved, the contact number and your full session details appear in your account and are emailed to you. This usually takes a few hours.",
    },
    {
      q: "Do I need an account to book?",
      a: "No. Booking works without one. An account is optional, it simply lets you sign back in later to see whether your payment is pending, approved, or rejected.",
    },
    {
      q: "Will my conversation stay private?",
      a: "Yes. Your conversation, your details, and your contact information are never shared with anyone.",
    },
    {
      q: "Is a cure guaranteed?",
      a: "No. Healing rests with Allah alone. What is offered here is guidance, counsel, and established remembrances within Shariah. No guarantee or claim is made.",
    },
    {
      q: "What if my booking is rejected after I have paid?",
      a: "If the receipt cannot be verified the booking is rejected and a reason is given. Please get in touch through the contact form so it can be resolved.",
    },
  ],
};
