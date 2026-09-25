"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Archive,
  ChartNoAxesCombined,
  Inbox,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { staffLogout, staffRole } from "@/lib/staff-client";

function OrderLookup() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const lookupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!lookupRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div ref={lookupRef} className="staff-lookup-control">
      <button
        type="button"
        className="staff-lookup-trigger"
        aria-expanded={open}
        aria-controls="staff-order-lookup"
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <Search aria-hidden />
        <span>Order lookup</span>
      </button>
      {open ? (
        <form
          id="staff-order-lookup"
          className="staff-lookup"
          role="search"
          aria-label="Order lookup"
          onSubmit={(e) => {
            e.preventDefault();
            const term = value.trim();
            if (term) {
              setOpen(false);
              router.push(`/staff/search?q=${encodeURIComponent(term)}`);
            }
          }}
        >
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Order number"
            aria-label="Order Lookup by number"
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="staff-btn navy">
            Search
          </button>
          <button
            type="button"
            className="staff-lookup-close"
            aria-label="Close order lookup"
            onClick={() => setOpen(false)}
          >
            <X aria-hidden />
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function StaffShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  // Session lives in sessionStorage (never cookies), so the server cannot
  // gate first paint. Hold rendering until the check runs — otherwise an
  // unauthenticated visitor sees a frame of the dashboard before the bounce.
  const [authState, setAuthState] = useState<"checking" | "signed-in" | "signed-out">("checking");
  const isAuth = pathname === "/auth" || pathname.startsWith("/auth?");
  useEffect(() => {
    setRole(staffRole());
    let signedIn = false;
    try {
      const token = sessionStorage.getItem("usvc-staff-access");
      if (token) setEmail(JSON.parse(atob(token.split(".")[1])).email ?? "");
      signedIn = Boolean(token);
    } catch {
      setEmail("");
    }
    setAuthState(signedIn ? "signed-in" : "signed-out");
    // Same-tick decision on freshly-read storage: a separate redirect effect
    // would see last render's stale authState and bounce a fresh login.
    if (!isAuth && !signedIn) router.replace("/auth");
  }, [pathname, isAuth, router]);
  if (isAuth) return <>{children}</>;
  if (authState !== "signed-in") return null;

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
          {role === "ADMIN" ? null : link("/staff/analytics", "My Analytics", ChartNoAxesCombined)}
          {role === "ADMIN" ? link("/staff/admin/staff-analytics", "Staff Analytics", Users) : null}
          {role === "ADMIN"
            ? link("/staff/admin/orders-analytics", "Orders Analytics", ChartNoAxesCombined)
            : null}
          {link("/staff/closed", "Closed Orders", Archive)}
          {link("/staff/search", "Order Search", Search)}
          {role === "ADMIN" ? link("/staff/admin", "Administration", ShieldCheck) : null}
          {role === "ADMIN" || role === "CS"
            ? link("/staff/cs", "CS Corrections", UserCheck)
            : null}
          {link("/staff/settings", "Settings", Settings)}
        </nav>
        <div className="staff-userbox">
          <div className="staff-userchip">
            <span className="staff-userchip-avatar" aria-hidden>
              {initial}
            </span>
            <span className="staff-userchip-meta">
              <span className="staff-userchip-email" title={email}>
                {email}
              </span>
              <span className="staff-userchip-role">
                Role: <span className="staff-role-pill">{role ?? "—"}</span>
              </span>
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
