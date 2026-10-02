import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Support for Orders",
  description:
    "Get order help, eligibility, fees, and request guidance from USVC support. For existing orders have your number ready.",
  alternates: { canonical: "https://usvitalcertificates.org/contact" },
  openGraph: {
    title: "Contact Support for Orders",
    description: "Message USVC support for help with an existing order or a certificate request.",
    url: "https://usvitalcertificates.org/contact",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
