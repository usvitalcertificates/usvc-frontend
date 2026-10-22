"use client";

import { useEffect, useId, useRef, useState, type InputHTMLAttributes } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { dateEntryUS, parseDateUS } from "@/lib/date-format";
import "./date-input.css";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "min" | "max"
> & {
  value?: string;
  defaultValue?: string;
  min?: string;
  max?: string;
  onValueChange?: (value: string) => void;
};
const isoDate = (date: Date) =>
  `${date.getFullYear().toString().padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/** Locale-independent visible entry and calendar; only the hidden ISO value is submitted. */
export function DateInput({
  value,
  defaultValue = "",
  onValueChange,
  name,
  id,
  min,
  max,
  disabled,
  readOnly,
  ...props
}: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const lastEmitted = useRef(value);
  const [text, setText] = useState(dateEntryUS(value ?? defaultValue));
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(
    () => new Date(`${value || defaultValue || isoDate(new Date())}T12:00:00`),
  );
  const root = useRef<HTMLSpanElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const hidden = useRef<HTMLInputElement>(null);
  const iso = parseDateUS(text) ?? "";
  useEffect(() => {
    if (value !== undefined && value !== lastEmitted.current) {
      lastEmitted.current = value;
      setText(dateEntryUS(value));
    }
  }, [value]);
  useEffect(() => {
    const error =
      text && !iso
        ? "Enter a valid date in MM/DD/YYYY format."
        : iso && min && iso < min
          ? `Choose ${dateEntryUS(min)} or later.`
          : iso && max && iso > max
            ? `Choose ${dateEntryUS(max)} or earlier.`
            : "";
    input.current?.setCustomValidity(error);
  }, [text, iso, min, max]);
  useEffect(() => {
    if (!open) return;
    const calendar = root.current?.querySelector<HTMLElement>("[role=dialog]");
    calendar?.scrollIntoView({ block: "nearest" });
    const firstDay =
      calendar?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]') ??
      calendar?.querySelector<HTMLButtonElement>(".usvc-date-days button:not(:disabled)");
    firstDay?.focus({ preventScroll: true });
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  useEffect(() => {
    const form = input.current?.form;
    const reset = () => {
      setText(dateEntryUS(value ?? defaultValue));
      setOpen(false);
    };
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [value, defaultValue]);
  const update = (next: string) => {
    const parsed = parseDateUS(next) ?? "";
    setText(next);
    // Update before bubbling so the public form's FormData snapshot sees this change.
    if (hidden.current) {
      hidden.current.value = parsed;
      hidden.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
    lastEmitted.current = parsed;
    onValueChange?.(parsed);
  };
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const move = (amount: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + amount, 1));
  return (
    <span
      className="usvc-date"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          input.current?.focus();
          event.preventDefault();
        }
      }}
    >
      <input
        {...props}
        id={inputId}
        ref={input}
        type="text"
        value={text}
        disabled={disabled}
        readOnly={readOnly}
        data-date-for={name}
        placeholder="MM/DD/YYYY"
        inputMode="numeric"
        maxLength={10}
        onChange={(event) => {
          const raw = event.target.value;
          const digits = raw.replace(/\D/g, "").slice(0, 8);
          update(
            [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join("/"),
          );
        }}
      />
      <input
        ref={hidden}
        type="hidden"
        name={name}
        value={iso}
        disabled={disabled}
        data-date-value={name}
      />
      <button
        className="usvc-date-toggle"
        type="button"
        disabled={disabled || readOnly}
        aria-label={`Choose date${props["aria-label"] ? `: ${props["aria-label"]}` : ""} (MM/DD/YYYY)`}
        aria-expanded={open}
        aria-controls={`${inputId}-calendar`}
        onClick={() => {
          if (!open) {
            const current = iso || isoDate(new Date());
            setMonth(new Date(`${current}T12:00:00`));
          }
          setOpen(!open);
        }}
      >
        <CalendarDays size={18} aria-hidden="true" />
      </button>
      {open ? (
        <span
          className="usvc-date-calendar"
          id={`${inputId}-calendar`}
          role="dialog"
          aria-label="Choose date (MM/DD/YYYY)"
        >
          <span className="usvc-date-navigation">
            <button type="button" onClick={() => move(-1)} aria-label="Previous month">
              <ChevronLeft size={16} />
            </button>
            <span>
              {first.toLocaleString("en-US", { month: "long" })}{" "}
              <input
                aria-label="Calendar year"
                type="number"
                min="1"
                max="9999"
                value={month.getFullYear()}
                onChange={(event) => {
                  const year = Number(event.target.value);
                  if (year >= 1 && year <= 9999) {
                    const next = new Date(first);
                    next.setFullYear(year);
                    setMonth(next);
                  }
                }}
              />
            </span>
            <button type="button" onClick={() => move(1)} aria-label="Next month">
              <ChevronRight size={16} />
            </button>
          </span>
          <span className="usvc-date-days">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <span key={day} aria-hidden="true">
                {day}
              </span>
            ))}
            {Array.from({ length: first.getDay() }, (_, index) => (
              <span key={`blank-${index}`} />
            ))}
            {Array.from({ length: count }, (_, index) => {
              const day = index + 1;
              const dayValue = isoDate(new Date(month.getFullYear(), month.getMonth(), day));
              return (
                <button
                  type="button"
                  key={day}
                  aria-label={dateEntryUS(dayValue)}
                  aria-pressed={iso === dayValue}
                  disabled={Boolean((min && dayValue < min) || (max && dayValue > max))}
                  onClick={() => {
                    update(dateEntryUS(dayValue));
                    setOpen(false);
                    input.current?.focus();
                  }}
                >
                  {day}
                </button>
              );
            })}
          </span>
          <span className="usvc-date-calendar-format">MM/DD/YYYY</span>
          <button
            type="button"
            onClick={() => {
              update("");
              setOpen(false);
              input.current?.focus();
            }}
          >
            Clear
          </button>
        </span>
      ) : null}
    </span>
  );
}
