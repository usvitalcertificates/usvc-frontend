"use client";

import { useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";

export function CopyButton({
  value,
  label,
  position = "right",
}: {
  value: string;
  label: string;
  position?: "left" | "right";
}) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        marginLeft: position === "right" ? "0.5rem" : undefined,
        marginRight: position === "left" ? "0.6rem" : undefined,
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        aria-label={`Copy ${label}`}
        title={`Copy ${label}`}
        onClick={() => void copy()}
        data-copied={copied || undefined}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          border: "1px solid",
          borderColor: copied ? "#16a34a" : "#dce4ef",
          background: copied ? "#16a34a" : "#fff",
          color: copied ? "#fff" : "#1d4ed8",
          borderRadius: "6px",
          padding: "3px 8px",
          fontSize: "0.78rem",
          fontWeight: 700,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {copied ? (
          <Check aria-hidden style={{ width: 13, height: 13 }} />
        ) : (
          <Copy aria-hidden style={{ width: 13, height: 13 }} />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
      {copied ? (
        <button
          type="button"
          aria-label={`Copy ${label} again`}
          title={`Copy ${label} again`}
          onClick={() => {
            setCopied(false);
            window.setTimeout(() => void copy(), 60);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #dce4ef",
            background: "#fff",
            color: "#1d4ed8",
            borderRadius: "6px",
            padding: "3px 6px",
            cursor: "pointer",
          }}
        >
          <RotateCcw aria-hidden style={{ width: 13, height: 13 }} />
        </button>
      ) : null}
    </span>
  );
}
