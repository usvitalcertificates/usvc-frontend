import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Lock,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

import { StateSelector } from "./state-selector";

const certificates = [
  { name: "Birth" },
  { name: "Death" },
  { name: "Marriage" },
  { name: "Divorce" },
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

const trustItems = [
  {
    icon: Lock,
    title: "Secure by design",
    body: "Encrypted checkout. Your information is used only for your request — never sold.",
  },
  {
    icon: BadgeCheck,
    title: "Clear pricing",
    body: "Your service fee is shown before you pay. State agency and shipping fees are separate.",
  },
  {
    icon: ShieldCheck,
    title: "Real human support",
    body: "Questions about a paid order? Contact support@usvitalcertificates.org.",
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
      "If the agency approves your request, it sends an official copy. Most offices accept it for passport, ID, and similar uses — the receiving office decides.",
  },
  {
    question: "Do I need to visit an office?",
    answer:
      "No. There is no walk-in service and no office visit needed — you order online and track it.",
  },
] as const;

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  inverse = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  inverse?: boolean;
}) {
  return (
    <div className={`section-heading${inverse ? " inverse" : ""}`}>
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
        <div className="container hero-split-grid">
          <div className="hero-copy">
            <p className="hero-pill">
              <span className="hero-dot" aria-hidden="true" /> Accepting orders · All 50 states
            </p>
            <p className="eyebrow">Birth, Death, Marriage &amp; Divorce Certificates</p>
            <h1>Order Your Vital Records Online. Skip the Office Visit</h1>
            <div className="patriotic-rule hero-rule" aria-hidden="true" />
            <p className="hero-description">
              Finish in about 10 minutes. We check your application for missing details, file it
              with the issuing agency, and you track it online.
            </p>
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
                width={34}
                height={21}
              />
              <Image
                className="hero-card-mark"
                src="/assets/mastercard.svg"
                alt="Mastercard"
                width={34}
                height={21}
              />{" "}
              · No office visit needed ·{" "}
              <Link className="hero-track-link" href="/track-order">
                Track your order
              </Link>
            </p>
            <ul className="hero-trust">
              <li>
                <Lock aria-hidden="true" /> SSL secure checkout
              </li>
              <li>
                <ClipboardCheck aria-hidden="true" /> Expert review
              </li>
              <li>
                <PackageCheck aria-hidden="true" /> Track online
              </li>
            </ul>
          </div>
          <div className="hero-picker hero-picker-dark">
            <h2>Which record do you need?</h2>
            <p>Pick your certificate to start. We ask only what your state needs.</p>
            <ul>
              {certificates.map((certificate) => (
                <li key={certificate.name}>
                  <Link href="/find-your-state">
                    <span>{certificate.name}</span>
                    <ChevronRight aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="hero-picker-note">
              Most people finish in about 10 minutes · Secure checkout
            </p>
          </div>
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

      <section className="page-section trust-section">
        <div className="container">
          <SectionHeading
            eyebrow="Why USVC"
            title="Built around trust and clarity"
            subtitle="Who we are, what you pay, and what happens with your order — in plain words."
            inverse
          />
          <div className="four-column trust-grid">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <article className="trust-card" key={item.title}>
                  <span className="trust-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              );
            })}
          </div>
          <div className="centered-button">
            <Link className="button button-white button-large" href="/find-your-state">
              Start Your Order
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section state-section">
        <div className="container">
          <div className="state-card">
            <div className="popular-states">
              <span>Popular:</span>
              {popularStates.map((state) => (
                <Link key={state.slug} href={`/state/${state.slug}`}>
                  {state.name}
                </Link>
              ))}
            </div>
            <StateSelector />
            <p className="state-help">
              Choose the state where the event happened — not where you live now.{" "}
              <Link className="howto-link" href="/faq">
                Not sure? Read the FAQ
              </Link>
            </p>
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
    </main>
  );
}
