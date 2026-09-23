"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  const Icon = copied ? Check : Copy;
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          setCopied(false);
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        border: "1px solid var(--flow-border, #dce4ef)",
        background: "#fff",
        borderRadius: "6px",
        padding: "3px 8px",
        fontSize: "0.78rem",
        fontWeight: 600,
        cursor: "pointer",
        marginLeft: "0.5rem",
        whiteSpace: "nowrap",
        color: "#1d4ed8",
      }}
    >
      <Icon aria-hidden style={{ width: 13, height: 13 }} />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
