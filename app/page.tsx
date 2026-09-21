import Image from "next/image";
import Link from "next/link";
import {
  ClipboardCheck,
  FileText,
  Headphones,
  Landmark,
  Lock,
  MapPin,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

import { StateSelector } from "./state-selector";

const certificates = [
  {
    name: "Birth",
    description:
      "Assistance preparing and submitting a request for a birth record held by the issuing state agency.",
    uses: "Often requested for identity documentation, passport applications, school enrollment, and employment purposes, subject to the requirements of the receiving organization.",
  },
  {
    name: "Death",
    description:
      "Assistance preparing and submitting a request for a death record held by the issuing state agency.",
    uses: "Commonly requested for estate administration, insurance claims, benefit filings, and closing accounts, subject to the requirements of the receiving organization.",
  },
  {
    name: "Marriage",
    description:
      "Assistance preparing and submitting a request for a marriage record held by the issuing state agency.",
    uses: "Frequently requested for name changes, spousal benefits, immigration filings, and legal matters, subject to the requirements of the receiving organization.",
  },
  {
    name: "Divorce",
    description:
      "Assistance preparing and submitting a request for a divorce record or certificate held by the issuing state agency.",
    uses: "Often requested for remarriage, name changes, and legal or financial matters, subject to the requirements of the receiving organization.",
  },
] as const;

const steps = [
  {
    icon: MapPin,
    title: "Select your state",
    body: "Choose the state where the record was created. We show that jurisdiction's requirements, fees, and typical timelines.",
  },
  {
    icon: FileText,
    title: "Complete your application",
    body: "Answer clear, plain-language questions. Every required field is explained, and your progress is saved as you go.",
  },
  {
    icon: ClipboardCheck,
    title: "We review your request",
    body: "Our team checks your application for completeness and contacts you if anything is missing or unclear.",
  },
  {
    icon: PackageCheck,
    title: "Track until delivery",
    body: "Follow your order status from submission through processing and shipping with your order number.",
  },
] as const;

const trustItems = [
  {
    icon: Lock,
    title: "Secure by design",
    body: "Your information is transmitted over an encrypted connection and handled only for the purpose of your request.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent pricing",
    body: "Your USVC Processing Fee, Government / Agency Fee & Shipping bundle, and optional Rush Processing are itemized before one secure payment.",
  },
  {
    icon: Headphones,
    title: "Real human support",
    body: "Reach our support team at support@usvitalcertificates.org during Monday – Friday, 9:00 AM – 6:00 PM ET.",
  },
  {
    icon: Landmark,
    title: "Independent service",
    body: "USVC is not a government agency. Agencies may offer records directly, potentially at a lower cost.",
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
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Trusted Help for US Vital Certificates</p>
            <h1>Order Your Vital Certificate With Confidence</h1>
            <div className="patriotic-rule hero-rule" aria-hidden="true" />
            <p className="hero-description">
              Birth, death, marriage, and divorce certificate applications — guided step by step,
              reviewed for accuracy, and tracked from submission to delivery.
            </p>
            <div className="button-row">
              <Link className="button button-primary button-large" href="/find-your-state">
                Start Your Request
              </Link>
              <Link className="button button-secondary button-large" href="/track-order">
                Track Your Order
              </Link>
            </div>
          </div>
          <Image
            className="hero-image"
            src="/assets/usvc-hero.jpg"
            alt="A secure navy document folder holding a vital certificate beside a laptop showing an application form"
            width={1024}
            height={768}
            priority
          />
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHeading
            eyebrow="Certificates we help with"
            title="Which record do you need?"
            subtitle="Each certificate type has its own eligibility rules and required details. We walk you through exactly what your state asks for."
          />
          <div className="four-column certificate-grid">
            {certificates.map((certificate) => (
              <article className="certificate-card" key={certificate.name}>
                <h3>{certificate.name}</h3>
                <p className="certificate-description">{certificate.description}</p>
                <p className="certificate-uses">Commonly used for: {certificate.uses}</p>
                <Link className="quiet-link" href="/find-your-state">
                  Get Started
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section muted-section">
        <div className="container">
          <SectionHeading
            eyebrow="How it works"
            title="Four clear steps"
            subtitle="No confusing government forms to interpret on your own."
          />
          <ol className="four-column steps-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li className="step-card" key={step.title}>
                  <div className="step-icons">
                    <span>{index + 1}</span>
                    <Icon aria-hidden="true" />
                  </div>
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
          <StateSelector />
        </div>
      </section>

      <section className="page-section trust-section">
        <div className="container">
          <SectionHeading
            eyebrow="Why USVC"
            title="Built around trust and clarity"
            subtitle="We are transparent about who we are, what we charge, and what we do with your information."
            inverse
          />
          <div className="four-column trust-grid">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <article className="trust-card" key={item.title}>
                  <Icon aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              );
            })}
          </div>
          <div className="centered-button">
            <Link className="button button-white button-large" href="/find-your-state">
              Start Your Request
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section questions-section">
        <div className="container questions-inner">
          <SectionHeading
            title="Questions before you begin?"
            subtitle="Read answers to the most common questions about eligibility, timelines, fees, and shipping — or contact our support team directly."
          />
          <div className="button-row questions-buttons">
            <Link className="button button-secondary" href="/faq">
              Read the FAQ
            </Link>
            <Link className="button button-quiet" href="/contact">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
