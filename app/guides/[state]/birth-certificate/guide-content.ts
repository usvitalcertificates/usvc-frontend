import { getAdditionalBirthGuideContent } from "../../expanded-birth-guide-content";
import type { BirthGuideContent } from "./guide-types";
import { CALIFORNIA_GUIDE } from "./content/california";
import { FLORIDA_GUIDE } from "./content/florida";
import { GEORGIA_GUIDE } from "./content/georgia";
import { ILLINOIS_GUIDE } from "./content/illinois";
import { MICHIGAN_GUIDE } from "./content/michigan";
import { NEW_JERSEY_GUIDE } from "./content/new-jersey";
import { NEW_YORK_GUIDE } from "./content/new-york";
import { NORTH_CAROLINA_GUIDE } from "./content/north-carolina";
import { OHIO_GUIDE } from "./content/ohio";
import { PENNSYLVANIA_GUIDE } from "./content/pennsylvania";
import { USVC_HELP_COPY } from "./content/shared";
import { TEXAS_GUIDE } from "./content/texas";
import { VIRGINIA_GUIDE } from "./content/virginia";
import { WASHINGTON_GUIDE } from "./content/washington";

const GUIDES: Record<string, BirthGuideContent> = {
  california: CALIFORNIA_GUIDE,
  texas: TEXAS_GUIDE,
  florida: FLORIDA_GUIDE,
  "new-york": NEW_YORK_GUIDE,
  pennsylvania: PENNSYLVANIA_GUIDE,
  illinois: ILLINOIS_GUIDE,
  ohio: OHIO_GUIDE,
  georgia: GEORGIA_GUIDE,
  "north-carolina": NORTH_CAROLINA_GUIDE,
  michigan: MICHIGAN_GUIDE,
  "new-jersey": NEW_JERSEY_GUIDE,
  virginia: VIRGINIA_GUIDE,
  washington: WASHINGTON_GUIDE,
};

function genericGuide(stateName: string, officialUrl: string): BirthGuideContent {
  return {
    stateName,
    metaTitle: `How to Get a ${stateName} Birth Certificate`,
    metaDescription: `Official guidance plus USVC help for a ${stateName} birth certificate request. Eligibility, fees, steps.`,
    subtitle: `A starting point for understanding a ${stateName} birth-certificate request and the official agency resource.`,
    intro: [
      `A ${stateName} birth certificate is issued under the rules of the ${stateName} issuing agency, so the record you need is held where the birth happened, not necessarily where you live now.`,
      "This guide explains how to check the current official requirements and how USVC can help you submit a complete request.",
    ],
    quickFacts: [
      { label: "Issuing authority", value: `${stateName} vital records office` },
      { label: "Record location", value: "Where the birth occurred" },
      { label: "Where to request", value: "The official state or local office" },
      { label: "Best first step", value: "Confirm current requirements on the official page" },
    ],
    sections: [
      {
        id: "official-resource",
        heading: `Start with the official ${stateName} resource`,
        paragraphs: [
          "The official issuing-agency page explains its current request options, required documentation, eligibility, fees, and processing information. Those details can change without notice on the agency page, which this guide doesn't control.",
          "Open it first and confirm which request path fits your situation before you gather documents or pay anything.",
        ],
        links: [{ label: `Open the official ${stateName} birth-record page`, href: officialUrl }],
      },
      {
        id: "process",
        heading: `How a ${stateName} request usually works`,
        paragraphs: [
          `Most requests follow the same broad pattern. Confirm on the agency page whether you are eligible to receive the record. Then gather the subject's full name at birth, date and place of birth, parents' names, your contact details, and a deliverable shipping address. Submit the request through the channel the agency currently supports and keep your confirmation so you can track it.`,
        ],
      },
      {
        id: "prepare",
        heading: "What to have ready before you start",
        paragraphs: [
          "Having these details on hand makes the guided flow take most people about 10 minutes. If any detail is uncertain, such as a spelling, an exact date, or a parent's name, check the agency's instructions for what it accepts before you submit, since corrections after filing can add delays.",
        ],
        bullets: [
          "The subject's full name at birth and date of birth.",
          "The city or county where the birth occurred.",
          "Parents' names as shown on the record.",
          "Your relationship to the subject.",
          "Your contact details and a deliverable shipping address.",
        ],
      },
      {
        id: "usvc-help",
        heading: "How USVC can help",
        paragraphs: USVC_HELP_COPY,
      },
    ],
    faqs: [
      {
        question: `Where do I find the official ${stateName} birth-certificate requirements?`,
        answer: `The [official issuing-agency page](${officialUrl}) is the source of truth for current request options, required documentation, eligibility, fees, and processing information, all of which can change.`,
      },
      {
        question: "What information should I have ready before I start?",
        answer:
          "Typically the subject's full name at birth, date and place of birth, and parents' names, plus your contact details and a deliverable shipping address. The agency page lists the exact documents it requires.",
      },
      {
        question: "How long does a request take?",
        answer:
          "Our guided USVC form takes most people about 10 minutes. Agency processing and delivery times vary by state. Confirm current times on the official agency page before you plan around a deadline.",
      },
      {
        question: "Can USVC file the request for me?",
        answer:
          "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files it with the agency, and helps you track the request process. We are an independent assistance service, not a government agency.",
      },
    ],
    sources: [{ label: `${stateName} official birth-record resource`, href: officialUrl }],
    sourceChecked: "09/30/2026",
    ctaLabel: `Start Your ${stateName} Request`,
    ctaNote:
      "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
  };
}

export function getBirthGuideContent(
  state: string,
  stateName: string,
  officialUrl: string,
): BirthGuideContent {
  return (
    GUIDES[state] ?? getAdditionalBirthGuideContent(state) ?? genericGuide(stateName, officialUrl)
  );
}
