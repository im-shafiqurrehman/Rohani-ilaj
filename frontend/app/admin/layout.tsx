import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div dir="ltr" className="font-body">
      {children}
    </div>
  );
}
