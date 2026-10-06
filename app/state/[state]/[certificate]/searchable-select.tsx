"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export interface SearchableOption {
  value: string;
  label: string;
  disabled?: boolean;
}

function labelFor(options: readonly SearchableOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? "";
}

function matches(option: SearchableOption, query: string): boolean {
  const haystack = `${option.label} ${option.value}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

/**
 * Searchable dropdown that participates in the plain-HTML form pipeline:
 * the visible box is for typing/filtering while a hidden input carries the
 * real `name` + selected value, so FormData submit, draft persistence, and
 * autofill merging all keep working untouched.
 *
 * Controlled when `value` is provided (county/city/copies), uncontrolled
 * otherwise (initial selection from `defaultValue` when it names an option).
 */
export function SearchableSelect({
  name,
  options,
  value: controlledValue,
  defaultValue = "",
  required = false,
  disabled = false,
  placeholder = "Select…",
  onSelect,
  inputId,
}: {
  name: string;
  options: readonly SearchableOption[];
  value?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onSelect?: (value: string) => void;
  /** Stable input id (explicit label htmlFor). Defaults to a unique id. */
  inputId?: string;
}) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const autoId = `combobox-${name}-${rawId}`;
  const searchId = inputId ?? autoId;
  const listId = `${searchId}-list`;
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(() =>
    options.some((option) => option.value === defaultValue) ? defaultValue : "",
  );
  const selected = isControlled ? (controlledValue ?? "") : internalValue;
  // Null query = idle (show the selected label); string = actively filtering.
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  // Late-arriving options (geo data) or parent resets: fall back to the
  // selected label whenever the user is not actively typing here.
  useEffect(() => {
    if (document.activeElement !== searchRef.current) setQuery(null);
  }, [selected, options]);

  // Keep the plain-HTML pipeline in sync: selecting writes the hidden input,
  // and the dispatched event lets the form-level syncForm pick it up exactly
  // like a native change.
  useEffect(() => {
    hiddenRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery(null);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [open]);

  const filtered = useMemo(() => {
    if (query === null || query.trim() === "") return options;
    return options.filter((option) => matches(option, query));
  }, [options, query]);
  const navigable = useMemo(() => filtered.filter((option) => !option.disabled), [filtered]);
  const display = query ?? labelFor(options, selected);

  function commit(value: string) {
    if (!isControlled) setInternalValue(value);
    setQuery(null);
    setOpen(false);
    setHighlight(-1);
    onSelect?.(value);
  }

  function openWithFullList() {
    // Always open unfiltered: the list shows every record, the search box
    // only narrows it. Pre-highlight the current selection for keyboard users.
    setQuery("");
    setOpen(true);
    const enabled = options.filter((option) => !option.disabled);
    setHighlight(enabled.findIndex((option) => option.value === selected));
  }

  function onSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openWithFullList();
        return;
      }
      if (!navigable.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setHighlight((current) => (current + step + navigable.length) % navigable.length);
    } else if (event.key === "Enter") {
      if (open && navigable[highlight]) {
        event.preventDefault();
        commit(navigable[highlight].value);
      }
    } else if (event.key === "Escape") {
      setQuery(null);
      setOpen(false);
    }
  }

  const activeId =
    highlight >= 0 && navigable[highlight] ? `${listId}-option-${highlight}` : undefined;

  return (
    <div className="combobox-wrap" ref={wrapRef}>
      <input
        ref={searchRef}
        id={searchId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeId}
        aria-required={required || undefined}
        autoComplete="off"
        data-combobox-search={name}
        disabled={disabled}
        placeholder={selected ? labelFor(options, selected) || placeholder : placeholder}
        required={required}
        value={display}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setHighlight(-1);
        }}
        onFocus={() => {
          if (!disabled) openWithFullList();
        }}
        onBlur={() => {
          // Option picks commit on mousedown (before blur), so reaching here
          // means focus truly left: close and revert to the selection.
          setOpen(false);
          setQuery(null);
        }}
        onKeyDown={onSearchKeyDown}
      />
      <input ref={hiddenRef} type="hidden" name={name} value={selected} data-combobox={name} />
      {open && !disabled ? (
        <ul className="combobox-list" role="listbox" id={listId} aria-label={name}>
          {filtered.length ? (
            filtered.map((option) => {
              const navIndex = navigable.indexOf(option);
              const isSelected = option.value === selected;
              return (
                <li
                  key={option.value || option.label}
                  id={navIndex >= 0 ? `${listId}-option-${navIndex}` : undefined}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  data-combobox-active={navIndex === highlight || undefined}
                  data-combobox-disabled={option.disabled || undefined}
                  onMouseDown={(event) => {
                    // Select before blur closes the list.
                    event.preventDefault();
                    if (!option.disabled) commit(option.value);
                  }}
                >
                  {option.label}
                  {isSelected ? <span aria-hidden="true"> ✓</span> : null}
                </li>
              );
            })
          ) : (
            <li className="combobox-empty" aria-disabled="true">
              No matches. Clear the search to see all options.
            </li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
