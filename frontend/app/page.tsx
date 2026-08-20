import PageShell from "@/components/PageShell";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Approach from "@/components/Approach";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import ContactForm from "@/components/ContactForm";

export default function HomePage() {
  return (
    <PageShell>
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
