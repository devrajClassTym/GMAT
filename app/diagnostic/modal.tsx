"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function DiagnosticModal({
  titleId,
  descriptionId,
  onClose,
  children,
}: {
  titleId: string;
  descriptionId?: string;
  onClose?: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element?.open) element?.showModal();
    return () => element?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="m-auto w-[min(440px,_calc(100vw_-_32px))] p-7.5 border border-line rounded-[15px] bg-surface text-foreground shadow-[0_25px_75px_#0004] max-h-[calc(100dvh_-_32px)] overflow-auto font-sans backdrop:bg-overlay backdrop:backdrop-blur-[2px] [&_h2]:text-[25px] [&_h2]:font-[550] [&_h2]:tracking-[-.7px] [&_h2]:leading-[1.25] [&_h2]:mt-[19px] [&_h2]:mx-0 [&_h2]:mb-3.5 [&_p]:text-muted [&_p]:text-[12px] [&_p]:leading-[1.85] [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-focus [&_button:focus-visible]:outline-offset-4 [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-focus [&_input:focus-visible]:outline-offset-4 max-[600px]:p-[25px]"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
    >
      {children}
    </dialog>
  );
}
