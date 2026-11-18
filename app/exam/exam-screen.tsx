"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DiagnosticModal } from "../diagnostic/modal";
import { DiagnosticIcon } from "../diagnostic/ui";
import { PracticeRound } from "../diagnostic/practice/practice-round";
import type { Round } from "../diagnostic/practice/practice-engine";
import { createExam } from "./exam-session";

export function ExamScreen() {
  const router = useRouter();
  const [initial, setInitial] = useState<Round | null>(null);
  const [showStart, setShowStart] = useState(true);

  function startExam() {
    const round = createExam(Date.now(), crypto.randomUUID());
    setInitial(round);
    setShowStart(false);
  }
  function cancelStart() {
    if (initial) setShowStart(false);
    else router.push("/dashboard");
  }

  return (
    <>
      {initial ? (
        <PracticeRound
          key={initial.id}
          initial={initial}
          mode="exam"
          onReset={() => setShowStart(true)}
        />
      ) : (
        <div className="min-h-svh text-foreground bg-background [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-focus [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-focus [&_button:focus-visible]:outline-offset-4 [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-focus [&_input:focus-visible]:outline-offset-4" />
      )}
      {showStart && (
        <DiagnosticModal
          titleId="start-exam-title"
          descriptionId="start-exam-description"
          onClose={cancelStart}
        >
          <span className="grid place-items-center w-11 h-11 bg-[color-mix(in_srgb,_var(--accent)_10%,_var(--surface))] border border-line rounded-[12px] text-accent">
            <DiagnosticIcon name="clock" />
          </span>
          <h2 id="start-exam-title">Ready to start your exam?</h2>
          <p id="start-exam-description">
            15 questions · 30 minutes · All sections
          </p>
          <p>
            Submit your answers in order. No hints or pauses. Your exam ends
            automatically when time runs out.
          </p>
          <p>
            The timer starts only when you select Start exam. Leaving or
            refreshing during the exam loses your current progress.
          </p>
          <div className="flex justify-end gap-3 mt-6.5">
            <button
              className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
              onClick={cancelStart}
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center gap-[13px] bg-accent text-button-text border border-transparent py-3 px-[17px] rounded-[7px] text-[12px]! font-[550]! no-underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0"
              onClick={startExam}
            >
              Start exam
              <DiagnosticIcon name="arrow" />
            </button>
          </div>
        </DiagnosticModal>
      )}
    </>
  );
}
