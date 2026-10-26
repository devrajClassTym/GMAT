"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./test/test.module.css";

export function DiagnosticModal({ titleId, descriptionId, onClose, children }: {
  titleId: string; descriptionId?: string; onClose?: () => void; children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element?.open) element?.showModal();
    return () => element?.close();
  }, []);
  return <dialog ref={dialog} className={styles.modal} aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={event => { event.preventDefault(); onClose?.(); }}>{children}</dialog>;
}
