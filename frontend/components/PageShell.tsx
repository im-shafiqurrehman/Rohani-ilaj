import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppFab from "./WhatsAppFab";
import ScrollProgress from "./ScrollProgress";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
