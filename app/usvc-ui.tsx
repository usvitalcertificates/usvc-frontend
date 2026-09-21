import { Info } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="page-header">
      <div className="container">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </section>
  );
}

export function Disclaimer({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <aside className={`disclaimer${compact ? " compact" : ""} ${className}`.trim()}>
      <Info aria-hidden="true" />
      <div>
        <h2>Important disclosure</h2>
        <p>
          {compact
            ? "Independent service — not a government agency."
            : "USVC is an independent service that assists individuals with requesting vital records from government agencies. We are not a government agency and are not affiliated with or endorsed by any federal or state office. Official records may be available directly from the issuing agency, potentially at a lower cost. Our fees cover online ordering, guided assistance, application review, and related processing support."}
        </p>
      </div>
    </aside>
  );
}
