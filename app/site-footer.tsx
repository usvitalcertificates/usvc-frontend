"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE_DISCLAIMER } from "@/lib/seo";

const columns = [
  {
    title: "Services",
    links: [
      ["Birth Certificates", "/certificates"],
      ["Death Certificates", "/certificates"],
      ["Marriage Certificates", "/certificates"],
      ["Divorce Certificates", "/certificates"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Find Your State", "/find-your-state"],
      ["FAQ", "/faq"],
      ["Track Order", "/track-order"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/privacy-policy"],
      ["Terms of Service", "/terms-of-service"],
      ["Accessibility", "/accessibility"],
    ],
  },
] as const;

export function SiteFooter() {
  // Homepage keeps the About-USVC independence text; every other page carries
  // the standard muted disclaimer. Same small grey styling either way.
  const isHome = usePathname() === "/";
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-columns">
          {columns.map((column) => (
            <div key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-about">
          {isHome ? (
            <>
              <h2 className="site-disclaimer-heading">Disclaimer</h2>
              <p className="site-disclaimer">
                USVC is an independent service that assists individuals with requesting vital
                records from government agencies. We are not a government agency and are not
                affiliated with or endorsed by any federal or state office. Official records may be
                available directly from the issuing agency, potentially at a lower cost. Our fees
                cover online ordering, guided assistance, application review, and related processing
                support.
              </p>
            </>
          ) : (
            <>
              <h2 className="site-disclaimer-heading">Disclaimer:</h2>
              <p className="site-disclaimer">{SITE_DISCLAIMER}</p>
            </>
          )}
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} US Vital Certificates via VitalChek processing.
        </div>
      </div>
    </footer>
  );
}
