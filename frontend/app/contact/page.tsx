import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send us a question, or your feedback.",
};

export default function ContactFormPage() {
  return (
    <PageShell>
      <ContactForm />
    </PageShell>
  );
}
