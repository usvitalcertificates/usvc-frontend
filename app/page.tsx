import Image from "next/image";
import Link from "next/link";
import {
  Baby,
  BadgeCheck,
  Check,
  ChevronRight,
  FileBadge,
  FileText,
  Gem,
  Headphones,
  Lock,
  MapPin,
  PackageCheck,
  Ribbon,
  ShieldCheck,
} from "lucide-react";

import { StateSelector } from "./state-selector";

const certificates = [
  { name: "Birth", icon: Baby },
  { name: "Death", icon: Ribbon },
  { name: "Marriage", icon: Gem },
  { name: "Divorce", icon: FileBadge },
] as const;

const popularStates = [
  { name: "California", slug: "california" },
  { name: "Texas", slug: "texas" },
  { name: "Florida", slug: "florida" },
  { name: "New York", slug: "new-york" },
  { name: "Pennsylvania", slug: "pennsylvania" },
  { name: "Illinois", slug: "illinois" },
  { name: "Ohio", slug: "ohio" },
] as const;

const steps = [
  {
    icon: MapPin,
    title: "Pick your state and record",
    body: "Tell us where the event happened and which certificate you need. We show that state's rules and fees.",
  },
  {
    icon: FileText,
    title: "Answer simple questions",
    body: "Most people finish in about 10 minutes. Plain language, no confusing government forms.",
  },
  {
    icon: PackageCheck,
    title: "We review, file, and you track",
    body: "We check your application for missing details, file it with the agency, and you can track it online.",
  },
] as const;

const protections = [
  {
    icon: Lock,
    title: "Secure card payments",
    body: "Payments run over an encrypted checkout.",
  },
  {
    icon: ShieldCheck,
    title: "256-bit SSL Encrypted",
    body: "Your data is always protected.",
  },
  {
    icon: BadgeCheck,
    title: "Official State-Issued Certificates",
    body: "Filed with the issuing state or county agency.",
  },
] as const;

const homeFaqs = [
  {
    question: "How long does it take?",
    answer:
      "Most people finish our form in about 10 minutes. Agency processing and delivery times vary by state.",
  },
  {
    question: "How much does it cost?",
    answer:
      "You see your USVC service fee before you pay. State agency and shipping fees are charged separately.",
  },
  {
    question: "Is this an official certificate?",
    answer:
      "If the agency approves your request, it sends an official copy. Most offices accept it for passport, ID, and similar uses. The receiving office decides.",
  },
  {
    question: "Do I need to visit an office?",
    answer:
      "No. There is no walk-in service and no office visit needed. You order online and track it.",
  },
] as const;

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="section-heading">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      <div className="patriotic-rule" aria-hidden="true" />
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <section className="hero-background">
        <Image
          className="hero-bg-image"
          src="/assets/white-house-hero.webp"
          alt="White House north facade with fountain, flower bed, and United States flag"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container hero-stack">
          <p className="hero-pill">
            <span className="hero-dot" aria-hidden="true" /> Accepting orders · All 50 states
          </p>
          <p className="eyebrow">Birth, Death, Marriage &amp; Divorce Certificates</p>
          <h1>
            Order Your Vital Records Online.
            <br />
            <span className="hero-accent">Skip the Office Visit</span>
          </h1>
          <div className="patriotic-rule hero-rule" aria-hidden="true" />
          <p className="hero-description">
            Finish in about 10 minutes. We check your application for missing details, file it with
            the issuing agency, and you track it online.
          </p>
          <div className="hero-choicebar">
            <p>Which record do you need?</p>
            <ul>
              {certificates.map((certificate) => {
                const CertIcon = certificate.icon;
                return (
                  <li key={certificate.name}>
                    <Link href="/find-your-state">
                      <CertIcon aria-hidden="true" />
                      <span>{certificate.name}</span>
                      <ChevronRight aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="button-row">
            <Link className="button button-primary button-large" href="/find-your-state">
              Start Your Order
            </Link>
          </div>
          <p className="hero-micro">
            Secure checkout{" "}
            <Image
              className="hero-card-mark"
              src="/assets/visa.svg"
              alt="Visa"
              width={44}
              height={28}
            />
            <Image
              className="hero-card-mark"
              src="/assets/mastercard.svg"
              alt="Mastercard"
              width={44}
              height={28}
            />{" "}
            · No office visit needed
          </p>
          <ul className="hero-trust">
            <li>
              <ShieldCheck aria-hidden="true" /> Secure checkout
            </li>
            <li>
              <Lock aria-hidden="true" /> SSL Encrypted
            </li>
            <li>
              <BadgeCheck aria-hidden="true" /> Secure Processing
            </li>
          </ul>
        </div>
      </section>
      <section className="page-section steps-section">
        <div className="container">
          <SectionHeading
            eyebrow="How it works"
            title="Three easy steps"
            subtitle="No confusing government forms to figure out alone."
          />
          <ol className="steps-timeline">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li className="step-timeline-card" key={step.title}>
                  <span className="step-ghost" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="step-chip" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="page-section state-section">
        <div className="container">
          <div className="state-card">
            <SectionHeading
              eyebrow="Get started"
              title="Find your state"
              subtitle="Choose where the event happened, not where you live now."
            />
            <div className="popular-states">
              <span>Popular:</span>
              {popularStates.map((state) => (
                <Link key={state.slug} href={`/state/${state.slug}`}>
                  {state.name}
                </Link>
              ))}
            </div>
            <StateSelector showHeading={false} />
            <p className="state-help">
              Not sure? Read the{" "}
              <Link className="howto-link" href="/faq">
                FAQ
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="page-section protections-section">
        <div className="container">
          <SectionHeading
            eyebrow="Security"
            title="Data Protections"
            subtitle="How your information and payments are protected."
          />
          <div className="protections-grid">
            {protections.map((protection) => {
              const Icon = protection.icon;
              return (
                <article key={protection.title}>
                  <span className="protection-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{protection.title}</h3>
                  <p>{protection.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-section muted-section">
        <div className="container questions-inner">
          <SectionHeading
            eyebrow="Common questions"
            title="Questions before you begin?"
            subtitle="Short answers to what most people ask. Full details are on the FAQ page."
          />
          <ul className="home-faq-list">
            {homeFaqs.map((faq) => (
              <li key={faq.question}>
                <strong>{faq.question}</strong>
                <span>{faq.answer}</span>
              </li>
            ))}
          </ul>
          <div className="button-row questions-buttons">
            <Link className="button button-secondary" href="/faq">
              Read the FAQ
            </Link>
            <Link className="button button-quiet" href="/find-your-state">
              Start Your Order
            </Link>
          </div>
        </div>
      </section>

      <section className="assurance-strip" aria-label="Why order with USVC">
        <div className="container">
          <ul className="assurance-list">
            <li>
              <Check aria-hidden="true" /> Instant Online Ordering
            </li>
            <li>
              <Check aria-hidden="true" /> Quick &amp; Secure Processing
            </li>
            <li>
              <Check aria-hidden="true" /> Dedicated Customer Support
            </li>
          </ul>
          <div className="assurance-promise">
            <div className="promise-item">
              <span className="promise-icon" aria-hidden="true">
                <Lock />
              </span>
              <div>
                <strong>WE PROTECT YOUR DATA</strong>
                <span>Secure Encryption &amp; Strict Confidentiality Protocols</span>
              </div>
            </div>
            <div className="promise-item">
              <span className="promise-icon" aria-hidden="true">
                <Headphones />
              </span>
              <div>
                <strong>WE&rsquo;RE HERE TO HELP</strong>
                <span>Dedicated Support from Start to Finish</span>
              </div>
            </div>
            <div className="promise-item promise-pay">
              <Image src="/assets/visa.svg" alt="Visa" width={48} height={30} />
              <Image src="/assets/mastercard.svg" alt="Mastercard" width={48} height={30} />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
