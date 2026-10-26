import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";

import "./globals.css";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Analytics } from "./analytics";
import { OpenAIAnalytics } from "./openai-analytics";
import { StaffShell } from "@/components/staff/StaffShell";
import { SITE_URL, socialMetadata } from "@/lib/seo";
import { organizationLd, SeoJsonLd } from "./seo-json-ld";

const GTM_ID = "GTM-KC8LVCXR";

/**
 * Inter is staff-only in practice (referenced solely by staff.css), but the
 * variable must live on <html> so it scopes the whole staff tree including
 * StaffShell chrome. Disable root preloading: public pages use Times,
 * while staff styles fetch Inter on demand.
 */
const flowFont = Inter({
  subsets: ["latin"],
  variable: "--font-flow",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Birth, Death, Marriage & Divorce Certificates | USVC", template: "%s | USVC" },
  description:
    "Get help requesting birth, death, marriage and divorce certificates. USVC offers guided applications, document review and order tracking.",
  ...socialMetadata({
    url: SITE_URL,
    title: "Birth, Death, Marriage & Divorce Certificates | USVC",
    description:
      "Get help requesting birth, death, marriage and divorce certificates. USVC offers guided applications, document review and order tracking.",
  }),
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const recoveryArea = requestHeaders.get("x-private-recovery") === "1";
  const analyticsEnabled =
    process.env.ANALYTICS_ENABLED === "true" &&
    !recoveryArea &&
    requestHeaders.get("x-staff-area") !== "1";
  // Set by middleware for /auth + /staff/* on every host: staff pages use the
  // internal chrome instead of the public header/footer.
  const staffArea = (await headers()).get("x-staff-area") === "1";

  return (
    <html lang="en" className={flowFont.variable}>
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
        <Analytics enabled={analyticsEnabled} />
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
