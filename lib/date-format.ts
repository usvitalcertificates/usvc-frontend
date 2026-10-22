/**
 * Single source of truth for displayed dates. The whole site uses US format
 * (MM/DD/YYYY) regardless of the browser locale.
 */
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function toDate(value: string | number | Date): Date | null {
  // Date-only strings are UTC at midnight; parse them as local calendar dates
  // so western timezones do not show the previous day.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** 2026-10-22 → 10/22/2026 */
export function formatDateUS(value: string | number | Date): string {
  const date = toDate(value);
  return date ? DATE_FORMATTER.format(date) : "—";
}

/** 2026-10-22T14:34:00Z → 2:34 PM */
export function formatTimeUS(value: string | number | Date): string {
  const date = toDate(value);
  return date ? TIME_FORMATTER.format(date) : "—";
}

/** 2026-10-22T14:34:00Z → 10/22/2026, 2:34 PM */
export function formatDateTimeUS(value: string | number | Date): string {
  const date = toDate(value);
  return date ? `${DATE_FORMATTER.format(date)}, ${TIME_FORMATTER.format(date)}` : "—";
}

/** Strict date-entry conversions; wire values remain YYYY-MM-DD. */
export function parseDateUS(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;
  const [, month, day, year] = match;
  const date = new Date(0);
  date.setFullYear(Number(year), Number(month) - 1, Number(day));
  return Number(year) > 0 &&
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
    ? `${year}-${month}-${day}`
    : null;
}
export function dateEntryUS(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[2]}/${match[3]}/${match[1]}` : value;
}
