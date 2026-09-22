import type { Metadata } from "next";

import "./globals.css";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Analytics } from "./analytics";

export const metadata: Metadata = {
  title: "USVC — Trusted Help for US Vital Certificates",
  description:
    "USVC helps Americans apply for birth, death, marriage, and divorce certificates with clear instructions, secure handling, and order tracking. Independent service, not a government agency.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Analytics
          enabled={process.env.ANALYTICS_ENABLED === "true"}
          measurementId={process.env.GA_MEASUREMENT_ID}
        />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
