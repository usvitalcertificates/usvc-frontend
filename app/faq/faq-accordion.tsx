"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { FaqItem } from "./faq-data";

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(LINK_RE);
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const label = match[1] ?? "";
    const href = match[2] ?? "#";
    const key = `${keyPrefix}-l${match.index}`;
    if (href.startsWith("/")) {
      nodes.push(
        <Link key={key} href={href} className="faq-link">
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="faq-link">
          {label}
        </a>,
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function AnswerBody({ answer, id }: { answer: string; id: string }) {
  const blocks = answer
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <div className="faq-answer-body">
      {blocks.map((block, i) => {
        const lines = block
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => /^\d+\.\s/.test(l));
        if (isList) {
          return (
            <ol key={`${id}-b${i}`}>
              {lines.map((line, j) => (
                <li key={`${id}-b${i}-i${j}`}>
                  {renderInline(line.replace(/^\d+\.\s/, ""), `${id}-b${i}-i${j}`)}
                </li>
              ))}
            </ol>
          );
        }
        return <p key={`${id}-b${i}`}>{renderInline(block, `${id}-b${i}`)}</p>;
      })}
    </div>
  );
}

export function FaqAccordion({ items }: { items: ReadonlyArray<FaqItem> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="faq-accordion">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question} className="faq-item">
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${index}`}
                onClick={() => setOpenIndex(open ? null : index)}
              >
                <span>
                  {index + 1}. {item.question}
                </span>
                <ChevronDown aria-hidden="true" className={open ? "open" : ""} />
              </button>
            </h3>
            <div id={`faq-panel-${index}`} hidden={!open} className="faq-panel">
              <AnswerBody answer={item.answer} id={`faq-${index}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
