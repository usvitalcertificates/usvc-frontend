"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  ["Home", "/"],
  ["Certificates", "/certificates"],
  ["Find Your State", "/find-your-state"],
  ["FAQ", "/faq"],
  ["Track Order", "/track-order"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="trust-banner">
        <strong>We Protect Your Data</strong>
        <span>Secure Encryption &amp; Strict Confidentiality Protocols</span>
      </div>
      <div className="container header-row">
        <Link href="/" className="logo" aria-label="US Vital Certificates — home">
          <Image
            src="/assets/usvc-logo.png"
            alt="US Vital Certificates logo"
            width={52}
            height={52}
            priority
          />
          <span>USVC</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href} className={pathname === href ? "active" : ""}>
              {label}
            </Link>
          ))}
          <Link href="/find-your-state" className="button button-primary header-button">
            Start Your Order
          </Link>
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open ? (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link
            href="/find-your-state"
            className="button button-primary"
            onClick={() => setOpen(false)}
          >
            Start Your Order
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
