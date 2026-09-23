"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Archive,
  Inbox,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
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
        autoComplete="off"
        spellCheck={false}
      />
      <button type="submit" className="staff-btn navy">
        <Search aria-hidden style={{ width: 16, height: 16 }} /> Search
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

  const link = (href: string, label: string, Icon: LucideIcon) => (
    <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
      <Icon aria-hidden />
      {label}
    </Link>
  );

  const initial = (email.trim()[0] ?? "?").toUpperCase();

  return (
    <div className="staff-shell">
      <aside className="staff-sidebar" aria-label="Fulfillment navigation">
        <div className="staff-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/usvc-logo-light.png" alt="USVC" width={36} height={36} />
          <div>
            <span className="staff-brand-name">USVC</span>
            <span className="staff-brand-sub">Fulfillment Center</span>
          </div>
        </div>
        <nav className="staff-nav">
          {link("/staff", "Open Orders", Inbox)}
          {link("/staff/my", "My Work", UserCheck)}
          {link("/staff/closed", "Closed Orders", Archive)}
          {link("/staff/search", "Order Search", Search)}
          {role === "ADMIN" ? link("/staff/admin", "Administration", ShieldCheck) : null}
          {link("/staff/settings", "Settings", Settings)}
        </nav>
        <div className="staff-userbox">
          <div className="staff-userchip">
            <span className="staff-userchip-avatar" aria-hidden>
              {initial}
            </span>
            <span className="staff-userchip-meta">
              <span className="staff-userchip-email">{email}</span>
              <span className="staff-role-pill">{role === "ADMIN" ? "Super Admin" : "Agent"}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={async () => {
              await staffLogout();
              router.replace("/auth");
            }}
          >
            <LogOut aria-hidden style={{ width: 15, height: 15, verticalAlign: "-2px" }} /> Sign out
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
