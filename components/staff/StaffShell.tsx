"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { staffLogout, staffRole } from "@/lib/staff-client";

function OrderLookup() {
  const router = useRouter();
  const [value, setValue] = useState("");
  return (
    <form
      className="staff-lookup"
      role="search"
      aria-label="Order lookup"
      onSubmit={(e) => {
        e.preventDefault();
        const term = value.trim();
        if (term) router.push(`/staff/search?q=${encodeURIComponent(term)}`);
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Order Lookup by #"
        aria-label="Order Lookup by number"
      />
      <button type="submit" className="staff-btn navy">
        Search
      </button>
    </form>
  );
}

export function StaffShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  useEffect(() => {
    setRole(staffRole());
    try {
      const token = sessionStorage.getItem("usvc-staff-access");
      if (token) setEmail(JSON.parse(atob(token.split(".")[1])).email ?? "");
    } catch {
      setEmail("");
    }
  }, [pathname]);

  const isAuth = pathname === "/auth" || pathname.startsWith("/auth?");
  if (isAuth) return <>{children}</>;

  const link = (href: string, label: string) => (
    <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
      {label}
    </Link>
  );

  return (
    <div className="staff-shell">
      <aside className="staff-sidebar" aria-label="Fulfillment navigation">
        <div className="staff-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/usvc-logo-light.png" alt="USVC" />
          <div>
            <strong>
              USVC
              <br />
              FULFILLMENT
            </strong>
            <span className="staff-role-pill">{role === "ADMIN" ? "Super Admin" : "Agent"}</span>
          </div>
        </div>
        <nav className="staff-nav">
          {link("/staff", "Open Orders")}
          {link("/staff/my", "My Work")}
          {link("/staff/closed", "Closed Orders")}
          {link("/staff/search", "Order Search")}
          {role === "ADMIN" ? link("/staff/admin", "Administration") : null}
          {link("/staff/settings", "Settings")}
        </nav>
        <div className="staff-userbox">
          <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{email}</div>
          <button
            type="button"
            onClick={async () => {
              await staffLogout();
              router.replace("/auth");
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <div className="staff-main">
        <div className="staff-topstrip">
          <OrderLookup />
        </div>
        <div className="staff-content">{children}</div>
      </div>
    </div>
  );
}
