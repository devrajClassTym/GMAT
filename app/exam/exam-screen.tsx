"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DiagnosticModal } from "../diagnostic/modal";
import { DiagnosticIcon } from "../diagnostic/ui";
import { PracticeRound } from "../diagnostic/practice/practice-round";
import type { Round } from "../diagnostic/practice/practice-engine";
import { createExam } from "./exam-session";
import styles from "../diagnostic/test/test.module.css";

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

  return <>
    {initial ? <PracticeRound key={initial.id} initial={initial} mode="exam" onReset={() => setShowStart(true)} /> : <div className={styles.page} />}
    {showStart && <DiagnosticModal titleId="start-exam-title" descriptionId="start-exam-description" onClose={cancelStart}>
      <span className={styles.modalIcon}><DiagnosticIcon name="clock" /></span>
      <h2 id="start-exam-title">Ready to start your exam?</h2>
      <p id="start-exam-description">15 questions · 30 minutes · All sections</p>
      <p>Submit your answers in order. No hints or pauses. Your exam ends automatically when time runs out.</p>
      <p>The timer starts only when you select Start exam. Leaving or refreshing during the exam loses your current progress.</p>
      <div className={styles.modalActions}><button className={styles.secondaryButton} onClick={cancelStart}>Cancel</button><button className={styles.primaryButton} onClick={startExam}>Start exam<DiagnosticIcon name="arrow" /></button></div>
    </DiagnosticModal>}
  </>;
}
