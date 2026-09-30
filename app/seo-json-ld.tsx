import { SITE_URL } from "@/lib/seo";

export function SeoJsonLd({ value }: { value: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, "\\u003c") }}
    />
  );
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "US Vital Certificates",
  url: SITE_URL,
  logo: `${SITE_URL}/assets/usvc-logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@usvitalcertificates.org",
    contactType: "customer support",
  },
};
