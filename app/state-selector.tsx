"use client";

import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { trackAnalytics } from "./analytics";
import { isStateUnsupported } from "@/lib/state-availability";

const states = [
  ["Alabama", "AL"],
  ["Alaska", "AK"],
  ["Arizona", "AZ"],
  ["Arkansas", "AR"],
  ["California", "CA"],
  ["Colorado", "CO"],
  ["Connecticut", "CT"],
  ["Delaware", "DE"],
  ["District of Columbia", "DC"],
  ["Florida", "FL"],
  ["Georgia", "GA"],
  ["Hawaii", "HI"],
  ["Idaho", "ID"],
  ["Illinois", "IL"],
  ["Indiana", "IN"],
  ["Iowa", "IA"],
  ["Kansas", "KS"],
  ["Kentucky", "KY"],
  ["Louisiana", "LA"],
  ["Maine", "ME"],
  ["Maryland", "MD"],
  ["Massachusetts", "MA"],
  ["Michigan", "MI"],
  ["Minnesota", "MN"],
  ["Mississippi", "MS"],
  ["Missouri", "MO"],
  ["Montana", "MT"],
  ["Nebraska", "NE"],
  ["Nevada", "NV"],
  ["New Hampshire", "NH"],
  ["New Jersey", "NJ"],
  ["New Mexico", "NM"],
  ["New York", "NY"],
  ["North Carolina", "NC"],
  ["North Dakota", "ND"],
  ["Ohio", "OH"],
  ["Oklahoma", "OK"],
  ["Oregon", "OR"],
  ["Pennsylvania", "PA"],
  ["Puerto Rico", "PR"],
  ["Rhode Island", "RI"],
  ["South Carolina", "SC"],
  ["South Dakota", "SD"],
  ["Tennessee", "TN"],
  ["Texas", "TX"],
  ["Utah", "UT"],
  ["Vermont", "VT"],
  ["Virginia", "VA"],
  ["Washington", "WA"],
  ["West Virginia", "WV"],
  ["Wisconsin", "WI"],
  ["Wyoming", "WY"],
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LETTERS_WITH_STATES = new Set(states.map(([name]) => name[0].toUpperCase()));

export function StateSelector({ showHeading = true }: { showHeading?: boolean }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized && letter) {
      return states.filter(([name]) => name.startsWith(letter));
    }
    if (!normalized) return states;
    return states.filter(
      ([name, abbreviation]) =>
        name.toLowerCase().includes(normalized) ||
        abbreviation.toLowerCase().startsWith(normalized),
    );
  }, [query, letter]);
  const filtering = query.trim() !== "" || letter !== null;

  return (
    <div>
      {showHeading ? <h2 className="state-heading">Find your state</h2> : null}
      <div className="state-search-wrap">
        <label htmlFor="state-search">Search for your state</label>
        <div className="state-input-wrap">
          <Search aria-hidden="true" />
          <input
            id="state-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLetter(null);
            }}
            placeholder="Search for your state…"
            autoComplete="off"
          />
        </div>
        <p aria-live="polite">
          {filtering
            ? `${results.length} of ${states.length} match. `
            : `${states.length} jurisdictions. `}
          Type a full name or an abbreviation such as “CA”.
        </p>
      </div>
      <div className="state-az" role="group" aria-label="Filter states by first letter">
        {LETTERS.map((item) => {
          const available = LETTERS_WITH_STATES.has(item);
          const active = letter === item;
          return (
            <button
              key={item}
              type="button"
              disabled={!available}
              aria-pressed={available ? active : undefined}
              aria-label={
                active ? `Clear letter ${item} filter` : `Show states starting with ${item}`
              }
              onClick={() => setLetter(active ? null : item)}
            >
              {item}
            </button>
          );
        })}
      </div>
      {results.length ? (
        <ul className="state-grid">
          {results.map(([name, abbr]) => {
            const slug = slugify(name);
            if (isStateUnsupported(slug)) {
              return (
                <li key={name}>
                  <button type="button" disabled aria-disabled="true" className="state-disabled">
                    <span className="state-name">{name}</span>
                    <span className="state-abbr" aria-hidden="true">
                      {abbr}
                    </span>
                    <em>Not available yet</em>
                  </button>
                </li>
              );
            }
            return (
              <li key={name}>
                <Link
                  href={`/state/${slug}`}
                  onClick={() => trackAnalytics("select_state", { state_code: abbr })}
                >
                  <span className="state-name">{name}</span>
                  <span className="state-abbr" aria-hidden="true">
                    {abbr}
                  </span>
                  <ChevronRight aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-states">
          We could not find that state. Please check the spelling or contact support for help.
        </p>
      )}
    </div>
  );
}
