import Link from "next/link";

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
          <p className="site-disclaimer">{SITE_DISCLAIMER}</p>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} US Vital Certificates via VitalChek processing.
        </div>
      </div>
    </footer>
  );
}
