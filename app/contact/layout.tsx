import type { Metadata } from "next";
import { socialMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Support for Orders",
  description:
    "Get order help, eligibility, fees, and request guidance from USVC support. For existing orders have your number ready.",
  alternates: { canonical: "https://usvitalcertificates.org/contact" },
  ...socialMetadata({
    title: "Contact Support for Orders",
    description: "Message USVC support for help with an existing order or a certificate request.",
    url: "https://usvitalcertificates.org/contact",
    type: "website",
  }),
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
