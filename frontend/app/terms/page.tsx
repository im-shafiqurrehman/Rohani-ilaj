import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms under which Rohani Ilaj Center provides consultations.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <PolicyPage policy="terms" />;
}
