import type { Metadata } from "next";
import { headers } from "next/headers";

import "./globals.css";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Analytics } from "./analytics";
import { OpenAIAnalytics } from "./openai-analytics";
import { StaffShell } from "@/components/staff/StaffShell";
import { SITE_URL } from "@/lib/seo";
import { organizationLd, SeoJsonLd } from "./seo-json-ld";

const GTM_ID = "GTM-KC8LVCXR";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "USVC — Trusted Help for US Vital Certificates", template: "%s | USVC" },
  description:
    "Guided help for US birth, death, marriage, and divorce certificates. Clear steps, secure handling, and order tracking.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "USVC — Trusted Help for US Vital Certificates",
    description:
      "Guided help for US birth, death, marriage, and divorce certificates. Clear steps, secure handling, and order tracking.",
  },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const analyticsEnabled = process.env.ANALYTICS_ENABLED === "true";
  // Set by middleware for /auth + /staff/* on every host: staff pages use the
  // internal chrome instead of the public header/footer.
  const staffArea = (await headers()).get("x-staff-area") === "1";

  return (
    <html lang="en">
      {analyticsEnabled ? (
        <head>
          <script
            id="usvc-gtm"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        </head>
      ) : null}
      <body>
        {!staffArea ? <SeoJsonLd value={organizationLd} /> : null}
        {analyticsEnabled ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        ) : null}
        <Analytics enabled={analyticsEnabled} measurementId={process.env.GA_MEASUREMENT_ID} />
        <OpenAIAnalytics
          enabled={analyticsEnabled && !staffArea}
          pixelId={process.env.OPENAI_ADS_PIXEL_ID}
          debug={process.env.OPENAI_ADS_PIXEL_DEBUG === "true"}
        />
        {staffArea ? (
          <StaffShell>{children}</StaffShell>
        ) : (
          <>
            <SiteHeader />
            {children}
            <SiteFooter />
          </>
        )}
      </body>
    </html>
  );
}
