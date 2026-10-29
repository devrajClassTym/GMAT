"use client";

import { useRef, useState } from "react";
import { questions, remainingMs, formatTime } from "../attempt";
import { DiagnosticHeader, DiagnosticIcon } from "../ui";
import { DiagnosticModal } from "../modal";
import { useDiagnostic } from "./use-diagnostic";
import styles from "./test.module.css";

export function DiagnosticTest() {
  const { attempt, now, storageUnavailable, select, submit, navigate, finish } = useDiagnostic();
  const [confirmEnd, setConfirmEnd] = useState(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  if (!attempt) return <div className={styles.page}><DiagnosticHeader label="DIAGNOSTIC" /><main className={styles.loading} role="status">Preparing your diagnostic…</main></div>;
  const question = questions[attempt.currentIndex];
  const answer = attempt.answers[attempt.currentIndex];
  const locked = answer.submittedAt !== null;
  const submitted = attempt.answers.filter(item => item.submittedAt !== null).length;
  const left = remainingMs(attempt, now);
  const ended = attempt.completedAt !== null || left === 0;
  function goTo(index: number) { navigate(index); questionHeading.current?.focus({ preventScroll: true }); }

  return <div className={styles.page}>
    <DiagnosticHeader label="YOUR STARTING POINT" />
    <main className={styles.workspace}>
      <div className={styles.intro}><span className={styles.eyebrow}>ONE QUESTION AT A TIME</span><h1>Make your next move a clear one.</h1><p>Choose an answer, submit to lock it in, and move at your own pace.</p></div>
      {storageUnavailable && <p role="status" className={styles.storageNote}>Browser storage is unavailable. Keep this tab open to preserve your progress.</p>}
      <div className={styles.shell}>
        <div className={styles.testTop}>
          <div className={styles.testTitle}><strong>GMAT Diagnostic</strong><span>15 questions · Practice assessment</span></div>
          <div className={`${styles.timer} ${left <= 5 * 60 * 1000 ? styles.timerUrgent : ""}`} role="timer" aria-label={`Time remaining: ${formatTime(left)}`}><DiagnosticIcon name="clock" /><div><span>Time remaining</span><strong>{formatTime(left)}</strong></div></div>
          <button className={styles.endButton} onClick={() => setConfirmEnd(true)} disabled={ended}>End Diagnostic</button>
        </div>
        <div className={styles.body}>
          <aside className={styles.sidebar} aria-label="Question navigation">
            <div className={styles.sidebarTitle}><h2>Questions</h2><span>{submitted} / 15 submitted</span></div>
            <div className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${submitted / questions.length * 100}%` }} /></div>
            <div className={styles.questionGrid}>{attempt.answers.map((item, i) => <button key={item.questionId} disabled={ended} aria-label={`Question ${i + 1}, ${item.submittedAt !== null ? "submitted" : "not submitted"}`} aria-current={attempt.currentIndex === i ? "step" : undefined} onClick={() => goTo(i)} className={`${styles.questionBox} ${item.submittedAt !== null ? styles.submitted : ""} ${i === attempt.currentIndex ? styles.current : ""}`}>{String(i + 1).padStart(2, "0")}</button>)}</div>
            <div className={styles.legend}><span><i className={styles.greenDot} />Submitted</span><span><i />Not submitted</span><span><i className={styles.blueDot} />Current question</span></div>
            <div className={styles.sidebarNote}><DiagnosticIcon name="lock" /><p>Once submitted, an answer is final. You can revisit it at any time.</p></div>
          </aside>
          <section className={styles.questionPanel} aria-labelledby="question-title">
            <div className={styles.questionMeta}><span>{question.section.toUpperCase()}</span><span>Question {attempt.currentIndex + 1} of {questions.length}</span></div>
            <div className={styles.questionType}>{question.type}<span>•</span>{question.topic}</div>
            {question.passage && <div className={styles.passage}>{question.passage}</div>}
            <h2 id="question-title" ref={questionHeading} tabIndex={-1} className={styles.questionTitle}>{question.prompt}</h2>
            <fieldset className={styles.options} disabled={locked || ended}><legend className={styles.srOnly}>Select one answer</legend>{question.options.map(option => <label key={`${question.id}-${option.id}`} className={`${styles.option} ${answer.selectedOptionId === option.id ? styles.selected : ""} ${locked ? styles.lockedOption : ""}`}><input type="radio" name={question.id} value={option.id} checked={answer.selectedOptionId === option.id} onChange={() => select(option.id)} /><span className={styles.optionLetter}>{option.id}</span><span className={styles.optionText}>{option.text}</span><span className={styles.radioMark} aria-hidden="true" /></label>)}</fieldset>
            <div className={styles.answerRow}><p role="status"><DiagnosticIcon name={locked ? "lock" : "check"} />{locked ? "Answer submitted. Your selection is locked." : "You can change your selection before submitting."}</p><button className={styles.primaryButton} onClick={submit} disabled={!answer.selectedOptionId || locked || ended}>{locked ? "Submitted" : "Submit answer"}<DiagnosticIcon name="check" /></button></div>
            <div className={styles.questionNavigation}><button className={styles.secondaryButton} disabled={attempt.currentIndex === 0 || ended} onClick={() => goTo(attempt.currentIndex - 1)}>← Previous</button><span>{attempt.currentIndex + 1} of {questions.length} questions</span>{attempt.currentIndex < questions.length - 1 ? <button className={styles.secondaryButton} disabled={ended} onClick={() => goTo(attempt.currentIndex + 1)}>Next<DiagnosticIcon name="arrow" /></button> : <button className={styles.secondaryButton} disabled={ended} onClick={() => setConfirmEnd(true)}>Finish<DiagnosticIcon name="check" /></button>}</div>
          </section>
        </div>
      </div>
    </main>
    {confirmEnd && !ended && <DiagnosticModal titleId="end-title" descriptionId="end-description" onClose={() => setConfirmEnd(false)}><span className={styles.modalIcon}><DiagnosticIcon name="check" /></span><h2 id="end-title">Ready to finish?</h2><p id="end-description">You’ve submitted {submitted} of {questions.length} answers. {submitted < questions.length ? `${questions.length - submitted} questions remain unsubmitted. Selected answers that haven’t been submitted won’t count.` : "All your answers are locked in."}</p><p>Once you end the diagnostic, you won’t be able to return to it.</p><div className={styles.modalActions}><button className={styles.secondaryButton} onClick={() => setConfirmEnd(false)}>Keep going</button><button className={styles.endButton} onClick={finish}>End Diagnostic</button></div></DiagnosticModal>}
  </div>;
}
