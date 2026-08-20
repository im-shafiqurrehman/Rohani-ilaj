import PageShell from "@/components/PageShell";
import JsonLd from "@/components/JsonLd";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Approach from "@/components/Approach";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import ContactForm from "@/components/ContactForm";
import { FAQS } from "@/lib/faqs";
import { faqJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <PageShell>
      <JsonLd data={faqJsonLd(FAQS.ur.map((f) => ({ q: f.q, a: f.a })))} />
      <Hero />
      <Services />
      <Process />
      <Approach />
      <Reviews />
      <Faq />
      <ContactForm />
    </PageShell>
  );
}
