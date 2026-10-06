"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE_DISCLAIMER } from "@/lib/seo";

function LinkedinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

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
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} US Vital Certificates via VitalChek processing.
          </p>
          <div className="footer-social">
            <a
              href="https://www.linkedin.com/company/usvitalcertificates/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="USVC on LinkedIn"
            >
              <LinkedinIcon />
            </a>
            <a
              href="https://www.facebook.com/share/1CGSWWbYVh/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="USVC on Facebook"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
