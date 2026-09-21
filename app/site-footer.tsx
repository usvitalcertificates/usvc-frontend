import Link from "next/link";

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
          <h2>About USVC</h2>
          <p>
            USVC is an independent service that assists individuals with requesting vital records
            from government agencies. We are not a government agency and are not affiliated with or
            endorsed by any federal or state office. Official records may be available directly from
            the issuing agency, potentially at a lower cost. Our fees cover online ordering, guided
            assistance, application review, and related processing support.
          </p>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} US Vital Certificates via VitalChek processing.
        </div>
      </div>
    </footer>
  );
}
