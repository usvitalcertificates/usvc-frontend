"use client";
import { SearchableSelect } from "./searchable-select";
import { copyMoney, copyPricing, MAX_COPIES } from "@/lib/copy-pricing";
import type { CertificateSlug } from "@/lib/form-config";
const examples: Record<CertificateSlug, readonly string[]> = {
  "birth-certificate": [
    "Passport applications",
    "Identity documents",
    "School enrollment",
    "Benefits paperwork",
  ],
  "death-certificate": [
    "Insurance claims",
    "Estate administration",
    "Benefits claims",
    "Account administration",
  ],
  "marriage-certificate": [
    "Name changes",
    "Benefits enrollment",
    "Immigration paperwork",
    "Personal records",
  ],
  "divorce-certificate": [
    "Name changes",
    "Remarriage paperwork",
    "Benefits updates",
    "Legal records",
  ],
};
const options = Array.from({ length: MAX_COPIES }, (_, i) => {
  const copies = i + 1,
    pricing = copyPricing(copies)!;
  return {
    value: String(copies),
    label: `${copies} ${copies === 1 ? "copy" : "copies"} · ${copyMoney(pricing.serviceCents)}${pricing.savingsCents ? ` · Save ${copyMoney(pricing.savingsCents)}` : ""}`,
  };
});
function CopyOption({ value }: { value: string }) {
  const copies = Number(value),
    pricing = copyPricing(copies)!;
  return (
    <span className="copy-option">
      <span>
        {copies} {copies === 1 ? "copy" : "copies"}
      </span>
      <span className="copy-option-prices">
        {pricing.savingsCents > 0 ? <del>{copyMoney(pricing.regularCents)}</del> : null}
        <strong>{copyMoney(pricing.serviceCents)}</strong>
        {pricing.savingsCents > 0 ? (
          <span className="copy-savings">Save {copyMoney(pricing.savingsCents)}</span>
        ) : null}
      </span>
    </span>
  );
}
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
  return (
    <div className="copy-quantity application-field wide">
      <label htmlFor="copy-quantity-select" className="copy-quantity-heading">
        <span>
          Number of Copies <span className="required-mark">*</span>
        </span>
        <span className="copy-offer">$79.00 OFF each additional copy</span>
      </label>
      <SearchableSelect
        inputId="copy-quantity-select"
        disabled={processing}
        name="copies"
        required
        value={String(copies)}
        options={options}
        placeholder="Choose 1–9 copies"
        onSelect={onSelect}
        renderOption={(option) => <CopyOption value={option.value} />}
      />
      {processing ? (
        <p className="copy-fee-note" role="status">
          An existing payment is being checked. The prices below apply only if a new payment attempt
          is allowed.
        </p>
      ) : null}
      {!pricing ? (
        <p className="field-error" role="alert">
          Your saved application has {copies} copies. Choose between 1 and 9 copies to continue.
        </p>
      ) : (
        <div className="copy-selection" aria-live="polite">
          <span>
            <strong>
              {copies} {copies === 1 ? "copy" : "copies"}
            </strong>
            <span>Processing fee</span>
          </span>
          <span className="copy-selection-price">
            {pricing.savingsCents > 0 ? <del>{copyMoney(pricing.regularCents)}</del> : null}
            <strong>{copyMoney(pricing.serviceCents)}</strong>
            {pricing.savingsCents > 0 ? (
              <span className="copy-savings">You save {copyMoney(pricing.savingsCents)}</span>
            ) : (
              <span>Additional copies are $70.00 each</span>
            )}
          </span>
        </div>
      )}
      <p className="copy-fee-note">
        $149.00 for the first copy, then $70.00 for each additional copy of the same record. Agency
        and shipping fees are separate.
      </p>
      <div className="copy-reasons">
        <strong>Important: Additional certified copies are often required for:</strong>
        <ul>
          {examples[certificate].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>Requirements depend on the receiving organization. All copies are of the same record.</p>
      </div>
    </div>
  );
}
