import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";

import "./globals.css";
import "./staff.css";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Analytics } from "./analytics";
import { StaffShell } from "@/components/staff/StaffShell";

const GTM_ID = "GTM-KC8LVCXR";

/**
 * Modern sans for the staff portal only. The variable is referenced solely by
 * staff.css selectors, so public pages keep Times New Roman.
 */
const flowFont = Inter({
  subsets: ["latin"],
  variable: "--font-flow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "USVC — Trusted Help for US Vital Certificates",
  description:
    "USVC helps Americans apply for birth, death, marriage, and divorce certificates with clear instructions, secure handling, and order tracking. Independent service, not a government agency.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const analyticsEnabled = process.env.ANALYTICS_ENABLED === "true";
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
