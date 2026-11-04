"use client";

import styles from "./RadioField.module.css";

export function RadioField({
  id,
  name,
  label,
  options,
  required,
  help,
  error,
  value,
  defaultValue,
  onChange,
}: {
  id: string;
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  help?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const describedBy =
    [help ? `${id}-help` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <fieldset className={styles.field} aria-describedby={describedBy} aria-invalid={Boolean(error)}>
      <legend className={styles.legend}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </legend>
      {help ? (
        <small id={`${id}-help`} className={styles.help}>
          {help}
        </small>
      ) : null}
      <div className={styles.options}>
        {options.map((option, index) => (
          <label key={option} className={styles.option} htmlFor={`${id}-${index}`}>
            <input
              id={`${id}-${index}`}
              name={name}
              type="radio"
              value={option}
              required={required}
              {...(value === undefined
                ? { defaultChecked: defaultValue === option }
                : { checked: value === option })}
              onChange={onChange ? () => onChange(option) : undefined}
              aria-describedby={describedBy}
              aria-invalid={Boolean(error)}
            />
            {option}
          </label>
        ))}
      </div>
      {error ? (
        <small id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </small>
      ) : null}
    </fieldset>
  );
}
