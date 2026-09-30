import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact USVC",
  description: "Contact USVC for help with a vital certificate request or an existing order.",
  alternates: { canonical: "https://usvitalcertificates.org/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
