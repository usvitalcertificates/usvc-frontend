"use client";

import { useRef, useState, type ReactNode } from "react";
import { ConfirmModal } from "./ui";

type Confirmation = {
  title: string;
  body: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  run: () => Promise<void | boolean>;
};

/** A pending action holds only an in-memory snapshot and is discarded on cancel. */
export function useConfirmation(scope: string) {
  const currentScope = useRef(scope);
  currentScope.current = scope;
  const pending = useRef<(Confirmation & { scope: string; opener: HTMLElement | null }) | null>(
    null,
  );
  const [action, setAction] = useState<
    (Confirmation & { scope: string; opener: HTMLElement | null }) | null
  >(null);
  const cancel = () => {
    pending.current = null;
    setAction(null);
  };
  const request = (next: Confirmation) => {
    if (pending.current) return;
    const captured = {
      ...next,
      scope: currentScope.current,
      opener: document.activeElement instanceof HTMLElement ? document.activeElement : null,
    };
    pending.current = captured;
    setAction(captured);
  };
  const dialog = action ? (
    <ConfirmModal
      title={action.title}
      body={action.body}
      confirmLabel={action.confirmLabel}
      danger={action.danger}
      scope={scope}
      expectedScope={action.scope}
      restoreFocusTo={action.opener}
      onCancel={cancel}
      onConfirm={async () => {
        if (action.scope !== currentScope.current) {
          cancel();
          return false;
        }
        return action.run();
      }}
    />
  ) : null;
  return { request, dialog, pending: action !== null };
}
