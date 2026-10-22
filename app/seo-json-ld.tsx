import { ORGANIZATION_ID, SITE_URL } from "@/lib/seo";

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
  "@id": ORGANIZATION_ID,
  name: "US Vital Certificates",
  legalName: "US VITAL CERTIFICATES, LLC",
  url: SITE_URL,
  logo: `${SITE_URL}/assets/usvc-logo.webp`,
  sameAs: [
    "https://www.linkedin.com/company/usvitalcertificates/",
    "https://www.facebook.com/share/1CGSWWbYVh/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@usvitalcertificates.org",
    telephone: "+1-201-534-9279",
    contactType: "customer support",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "7345 W Sand Lake Rd Ste 210 Office 4464",
    addressLocality: "Orlando",
    addressRegion: "FL",
    postalCode: "32819",
    addressCountry: "US",
  },
};
