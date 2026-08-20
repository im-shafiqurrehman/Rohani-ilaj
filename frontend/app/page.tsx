import PageShell from "@/components/PageShell";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Approach from "@/components/Approach";

export default function HomePage() {
  return (
    <PageShell>
      <Hero />
      <Services />
      <Approach />
    </PageShell>
  );
}
