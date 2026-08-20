import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Approach from "@/components/Approach";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import ScrollProgress from "@/components/ScrollProgress";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <Approach />
        <Reviews />
        <Faq />
        <ContactForm />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
