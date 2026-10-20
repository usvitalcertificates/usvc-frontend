"use client";

import { useLayoutEffect, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Tag } from "lucide-react";
import { copyMoney, copyPricing, MAX_COPIES } from "@/lib/copy-pricing";
import type { CertificateSlug } from "@/lib/form-config";

const examples: Record<CertificateSlug, readonly string[]> = {
  "birth-certificate": [
    "Passport applications",
    "REAL ID and driver’s license",
    "School, daycare and sports enrollment",
    "Social Security and Medicare",
    "Marriage license applications",
    "Employer work-eligibility checks",
    "Estate and inheritance matters",
    "Personal files, a safe spare at home",
  ],
  "death-certificate": [
    "Life insurance claims",
    "Bank and brokerage accounts",
    "Social Security and survivor benefits",
    "Pension, 401(k) and IRA claims",
    "Vehicle and real estate title transfers",
    "Probate and estate settlement",
    "Final tax returns",
    "Personal files, a spare for the family file",
  ],
  "marriage-certificate": [
    "Social Security name change",
    "Driver’s license and passport updates",
    "Bank, credit card and employer records",
    "Spouse’s health insurance enrollment",
    "Immigration and visa applications",
    "Mortgage and joint property",
    "Spousal and survivor benefits",
    "Personal files, a spare for your records",
  ],
  "divorce-certificate": [
    "Changing your name back",
    "Remarriage and marriage license applications",
    "Passport and visa applications",
    "Social Security and driver’s license updates",
    "Insurance and benefits changes",
    "Bank, credit and loan updates",
    "Immigration and visa paperwork",
    "Personal files, a spare for your records",
  ],
};
const copyGuidance: Record<CertificateSlug, string> = {
  "birth-certificate":
    "Extra certified copies can help with passport, identity, school and Social Security applications. Some organizations keep the copy you submit, so separate requests may need separate copies.",
  "death-certificate":
    "Insurers, banks and estate administrators may each need a certified copy to process a claim or close an account. Some keep the copy you submit, so having additional copies can help with separate requests.",
  "marriage-certificate":
    "Name changes, benefits and immigration applications may each require a certified copy. Some organizations keep the copy you submit, so additional copies can help you complete separate updates.",
  "divorce-certificate":
    "Name changes, remarriage and benefits updates may require a certified copy of your divorce record. Some organizations keep the copy you submit, so additional copies can help with separate requests.",
};
const quantities = Array.from({ length: MAX_COPIES }, (_, i) => i + 1);
const certificateCount = (count: number) =>
  `${count} ${count === 1 ? "Certificate" : "Certificates"}`;

export function CopyQuantity({
  copies,
  certificate,
  onSelect,
  processing = false,
}: {
  copies: number;
  certificate: CertificateSlug;
  onSelect: (value: string) => void;
  processing?: boolean;
}) {
  const pricing = copyPricing(copies);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [popup, setPopup] = useState({ above: false, height: 304 });
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const hidden = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const expanded = open && !processing;

  useEffect(() => {
    hidden.current?.dispatchEvent(new Event("input", { bubbles: true }));
  }, [copies]);
  useLayoutEffect(() => {
    if (!expanded) return;
    function position() {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const below = window.innerHeight - rect.bottom;
      const above = below < 240 && rect.top > below;
      setPopup({ above, height: Math.max(80, Math.min(304, (above ? rect.top : below) - 16)) });
    }
    function outside(event: PointerEvent) {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    }
    position();
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [expanded]);
  useEffect(() => {
    if (!expanded) return;
    const option = list.current?.children[active] as HTMLElement | undefined;
    if (option && list.current) {
      const top = option.offsetTop,
        bottom = top + option.offsetHeight;
      if (top < list.current.scrollTop) list.current.scrollTop = top;
      else if (bottom > list.current.scrollTop + list.current.clientHeight)
        list.current.scrollTop = bottom - list.current.clientHeight;
    }
  }, [active, expanded]);

  function show(index = pricing ? copies - 1 : 0) {
    setActive(index);
    setOpen(true);
  }
  function choose(count: number) {
    onSelect(String(count));
    setOpen(false);
    trigger.current?.focus();
  }
  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      show(event.key === "Home" ? 0 : MAX_COPIES - 1);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!expanded) show();
      else
        setActive(
          (index) => (index + (event.key === "ArrowDown" ? 1 : -1) + MAX_COPIES) % MAX_COPIES,
        );
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (expanded) choose(active + 1);
      else show();
    }
  }

  return (
    <div className="copy-quantity application-field wide">
      <div className="copy-offer-banner">
        <span className="copy-offer-icon">
          <Tag size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="copy-offer-title">
            <strong>Flat $79.00 OFF</strong> <span>each additional official copy</span>
          </p>
        </div>
      </div>
      <label
        id="copy-quantity-label"
        htmlFor="copy-quantity-select"
        className="copy-quantity-heading"
      >
        Number of Certified Copies <span className="required-mark">*</span>
      </label>
      <p className="copy-quantity-guidance" id="copy-quantity-guidance">
        {copyGuidance[certificate]}
      </p>
      <div
        className="copy-picker"
        ref={wrap}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
        }}
      >
        <button
          type="button"
          id="copy-quantity-select"
          ref={trigger}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={expanded}
          aria-controls="copy-quantity-options"
          aria-labelledby="copy-quantity-label"
          aria-required="true"
          aria-invalid={!pricing || undefined}
          aria-describedby={`copy-quantity-guidance${!pricing ? " copy-quantity-error" : ""}`}
          aria-activedescendant={expanded ? `copy-quantity-option-${active + 1}` : undefined}
          className="copy-picker-trigger"
          disabled={processing}
          onKeyDown={keyDown}
          onClick={() => (expanded ? setOpen(false) : show())}
        >
          <span className="copy-picker-value">
            {pricing ? certificateCount(copies) : "Choose 1–9 certificates"}
          </span>
          {pricing ? (
            <span className="copy-picker-total">{copyMoney(pricing.serviceCents)}</span>
          ) : null}
          {pricing && pricing.savingsCents > 0 ? (
            <span className="copy-savings-badge">Save {copyMoney(pricing.savingsCents)}</span>
          ) : null}
          <ChevronDown size={18} className="copy-picker-chevron" aria-hidden="true" />
        </button>
        <input type="hidden" ref={hidden} name="copies" value={String(copies)} />
        {expanded ? (
          <ul
            ref={list}
            id="copy-quantity-options"
            role="listbox"
            aria-labelledby="copy-quantity-label"
            className={`copy-picker-list${popup.above ? " copy-picker-list-above" : ""}`}
            style={{ maxHeight: popup.height }}
          >
            {quantities.map((count, index) => {
              const quote = copyPricing(count)!;
              return (
                <li
                  key={count}
                  id={`copy-quantity-option-${count}`}
                  role="option"
                  aria-selected={count === copies}
                  aria-label={`${certificateCount(count)}, ${copyMoney(quote.serviceCents)}${quote.savingsCents ? `, save ${copyMoney(quote.savingsCents)}` : ""}`}
                  className={`copy-picker-option${active === index ? " is-active" : ""}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(count)}
                >
                  <span className="copy-choice-check" aria-hidden="true">
                    {count === copies ? <Check size={18} /> : null}
                  </span>
                  <span className="copy-choice-quantity">{certificateCount(count)}</span>
                  <span className="copy-choice-original">
                    {quote.savingsCents > 0 ? <del>{copyMoney(quote.regularCents)}</del> : null}
                  </span>
                  <strong className="copy-choice-total">{copyMoney(quote.serviceCents)}</strong>
                  <span className="copy-choice-savings">
                    {quote.savingsCents > 0 ? `Save ${copyMoney(quote.savingsCents)}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      {processing ? (
        <p className="copy-fee-note" role="status">
          An existing payment is being checked. These prices apply only if a new payment attempt is
          allowed.
        </p>
      ) : null}
      {!pricing ? (
        <p className="field-error" role="alert" id="copy-quantity-error">
          Your saved application has {certificateCount(copies)}. Choose between 1 and 9 certificates
          to continue.
        </p>
      ) : null}
      <p className="copy-fee-note">
        First certificate $149.00 · Additional certificates $70.00 each. Agency and shipping fees
        are separate.
      </p>
      <div className="copy-reasons">
        <strong>
          {certificate === "death-certificate"
            ? "Important: Most banks, insurers and agencies each keep their own certified copy. Additional certified copies are often required for:"
            : "Important: Additional certified copies are often required for:"}
        </strong>
        <ul>
          {examples[certificate].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
