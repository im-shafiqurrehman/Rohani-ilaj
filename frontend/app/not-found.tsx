import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-5xl text-gold-gradient">صفحہ نہیں ملا</h1>
      <p className="mt-4 font-body text-navy/70">
        جو صفحہ آپ تلاش کر رہے ہیں وہ موجود نہیں ہے۔
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-navy px-8 py-3 font-body font-semibold text-white shadow-card transition hover:bg-navy-light"
      >
        مرکزی صفحہ پر جائیں
      </Link>
    </main>
  );
}
