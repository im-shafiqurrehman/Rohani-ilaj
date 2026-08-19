import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Trust from "@/components/Trust";
import Reviews from "@/components/Reviews";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Trust />
      <Reviews />
      <ContactForm />
      <Footer />
      <WhatsAppFab />
    </main>
  );
}
