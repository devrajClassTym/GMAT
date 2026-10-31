"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatTime } from "../attempt";
import answerKey from "../data/answer-key.json";
import { DiagnosticIcon } from "../ui";
import { DiagnosticModal } from "../modal";
import { saveSession } from "../../dashboard/session-storage";
import { guardExamExit } from "../../exam/exit-guard";
import { advanceClock, submitResponse, type Round } from "./practice-engine";
import styles from "../test/test.module.css";
import extra from "./practice.module.css";

const keys: Record<string, string> = answerKey;

export function PracticeRound({ initial, onReset, mode = "practice" }: { initial: Round; onReset: () => void; mode?: "practice" | "exam" }) {
  const isExam = mode === "exam";
  const sessionLabel = isExam ? "Exam" : "Practice";
  const [round, setRound] = useState(initial);
  const live = useRef(initial);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [mentor, setMentor] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  const update = useCallback((next: Round) => {
    if (next === live.current) return;
    if (next.completedAt !== null && live.current.completedAt === null) {
      const sections = [...new Set(next.items.map(question => question.section))];
      const historySaved = saveSession({ id: next.id, kind: isExam ? "exam" : "practice", section: sections.length === 1 ? sections[0] : "Mixed topics", completedAt: next.completedAt,
        answered: next.responses.filter(response => response.status === "submitted").length, total: next.items.length,
        correct: next.responses.filter(response => response.submitted === keys[response.questionId]).length,
        timing: next.settings.timing, timeLimitSeconds: next.settings.timing === "untimed" ? undefined : next.settings.seconds,
        topics: next.settings.topics, responses: next.responses });
      setStorageUnavailable(!historySaved);
    }
    if (next.index !== live.current.index || next.completedAt !== null) setMentor(false);
    live.current = next;
    setRound(next);
  }, [isExam]);

  useEffect(() => {
    if (isExam && round.completedAt === null) return guardExamExit();
  }, [isExam, round.completedAt]);

  useEffect(() => {
    function tick() { update(advanceClock(live.current, Date.now())); }
    const interval = window.setInterval(tick, 250);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    return () => { window.clearInterval(interval); window.removeEventListener("focus", tick); document.removeEventListener("visibilitychange", tick); };
  }, [update]);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [round.index, round.completedAt]);

  const question = round.items[round.index];
  const response = round.responses[round.index];
  const locked = response.status !== "open";
  const submitted = round.responses.filter(item => item.status === "submitted").length;
  const correct = round.responses.filter(item => item.submitted === keys[item.questionId]).length;
  const sequential = isExam || round.settings.timing === "question";
  const left = round.settings.timing === "round" ? Math.max(0, round.startedAt + round.settings.seconds * 1000 - round.checkpointAt)
    : Math.max(0, round.settings.seconds * 1000 - response.responseTimeMs);
  const navigate = useCallback((index: number) => {
    const next = advanceClock(live.current, Date.now());
    if (next.completedAt !== null || next.index !== round.index) { update(next); return; }
    if (index < 0 || index >= next.items.length || (sequential && (index !== next.index + 1 || next.responses[next.index].status === "open"))) return;
    update({ ...next, index });
  }, [round.index, sequential, update]);
  const select = useCallback((option: string) => {
    const next = advanceClock(live.current, Date.now());
    if (next.completedAt !== null || next.index !== round.index || next.responses[next.index].status !== "open") { update(next); return; }
    update({ ...next, responses: next.responses.map((item, index) => index === next.index ? { ...item, selected: option } : item) });
  }, [round.index, update]);

  if (round.completedAt !== null) return <div className={`${styles.page} ${extra.resultsPage}`}><main className={extra.resultsMain}>
    <header className={extra.resultsHeader}><div><span className={styles.eyebrow}>{isExam ? "EXAM RESULTS" : "YOUR ROUND, REVIEWED"}</span><h1 ref={heading} tabIndex={-1}>{round.reason === "timeout" ? "Time’s up." : `${sessionLabel} complete.`}</h1><p>{round.reason === "stopped" ? `You ended this ${isExam ? "exam" : "round"}.` : round.settings.length === "unlimited" ? "You’ve reached the end of the selected content." : isExam ? "Your exam has been submitted." : "One more round in the books."} Review your answers below.</p></div><div className={extra.resultActions}><Link href="/dashboard" className={styles.secondaryButton}>Dashboard</Link><button className={styles.primaryButton} onClick={onReset}>{isExam ? "New exam" : "Practice again"}<DiagnosticIcon name="arrow" /></button></div></header>
    <section className={extra.resultStats} aria-label="Round summary"><div><span>Correct answers</span><strong>{correct}<small> / {round.items.length}</small></strong></div><div><span>Accuracy · answered questions</span><strong>{submitted ? `${Math.round(correct / submitted * 100)}%` : "—"}</strong></div><div><span>Questions answered</span><strong>{submitted}<small> / {round.items.length}</small></strong></div><div><span>Total round time</span><strong>{formatTime(round.completedAt - round.startedAt)}</strong></div></section>
    {storageUnavailable && <p className={styles.storageNote} role="status">Browser storage is unavailable. Your record may be lost on reload.</p>}
    <section aria-labelledby="review-title"><div className={extra.reviewHeading}><h2 id="review-title">Question review</h2><span>Select a question to see its answers</span></div><div className={extra.review}>{round.items.map((item, index) => {
      const result = round.responses[index];
      const isCorrect = result.submitted === keys[item.id];
      const status = result.status === "timeout" ? "Timed out" : result.submitted ? isCorrect ? "Correct" : "Incorrect" : "Not answered";
      return <details key={item.id} className={extra.reviewItem}><summary><span className={extra.questionNumber}>{String(index + 1).padStart(2, "0")}</span><span className={extra.reviewTopic}><strong>{item.topic}</strong><small>{item.section}</small></span><span className={`${extra.resultBadge} ${isCorrect ? extra.correctBadge : result.submitted ? extra.incorrectBadge : ""}`}>{status}</span><span className={extra.responseTime}>{formatTime(result.responseTimeMs)}</span><span className={extra.expandMark} aria-hidden="true">+</span></summary><div className={extra.reviewDetail}>{item.passage && <p className={extra.reviewPassage}>{item.passage}</p>}<h3>{item.prompt}</h3><div className={extra.answerComparison}><div><span>Your answer</span><p>{result.submitted ? `${result.submitted}. ${item.options.find(option => option.id === result.submitted)?.text}` : status}</p></div><div><span>Correct answer</span><p>{keys[item.id]}. {item.options.find(option => option.id === keys[item.id])?.text}</p></div></div><p className={extra.responseNote}>Response time: {formatTime(result.responseTimeMs)}</p></div></details>;
    })}</div></section>
  </main></div>;

  return <div className={`${styles.page} ${extra.centeredPage}`}><main className={extra.roundWorkspace}>
    {storageUnavailable && <p className={styles.storageNote} role="status">Browser storage is unavailable. Keep this tab open to preserve your exam.</p>}
    <div className={styles.shell}>
      <div className={styles.testTop}><div className={styles.testTitle}><strong>GMAT {sessionLabel}{isExam ? " Mode" : ""}</strong><span>{round.settings.length === "unlimited" ? "Unlimited" : `${round.items.length} questions`} · {isExam ? "30 minutes · All sections" : `${round.items.length} available`}</span></div><div className={`${styles.timer} ${round.settings.timing !== "untimed" && left <= (isExam ? 300000 : 30000) ? styles.timerUrgent : ""}`} role="timer"><DiagnosticIcon name="clock" /><div><span>{round.settings.timing === "untimed" ? "Time elapsed" : round.settings.timing === "question" ? "Question time remaining" : isExam ? "Exam time remaining" : "Round time remaining"}</span><strong>{formatTime(round.settings.timing === "untimed" ? round.checkpointAt - round.startedAt : left)}</strong></div></div><button className={styles.endButton} onClick={() => setConfirmEnd(true)}>End {sessionLabel}</button></div>
      <div className={styles.body}>
        <aside className={styles.sidebar} aria-label="Question navigation"><div className={styles.sidebarTitle}><h2>Questions</h2><span>{submitted} / {round.items.length} submitted</span></div><div className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${submitted / round.items.length * 100}%` }} /></div><div className={styles.questionGrid}>{round.responses.map((item, index) => <button key={item.questionId} disabled={sequential} onClick={() => navigate(index)} aria-label={`Question ${index + 1}, ${item.status}`} aria-current={index === round.index ? "step" : undefined} className={`${styles.questionBox} ${item.status === "submitted" ? styles.submitted : ""} ${item.status === "timeout" ? extra.timedOut : ""} ${index === round.index ? styles.current : ""}`}>{index + 1}</button>)}</div><div className={styles.legend}><span><i className={styles.greenDot} />Submitted</span><span><i />Not submitted</span><span><i className={styles.blueDot} />Current question</span>{round.settings.timing === "question" && <span>Strikethrough: timed out</span>}</div><div className={styles.sidebarNote}><DiagnosticIcon name="lock" /><p>{isExam ? "Work in order. Submitted answers are final. The exam ends automatically when the timer reaches zero." : sequential ? "Per-question timing uses a fixed order. Each question gets its own time allowance." : "Once submitted, an answer is final. You can revisit it at any time."}</p></div></aside>
        <section className={styles.questionPanel} aria-labelledby="practice-question">
          <div className={styles.questionMeta}><span>{question.section.toUpperCase()}</span><span>Question {round.index + 1} of {round.items.length}</span></div><div className={styles.questionType}>{question.type}<span>•</span>{question.topic}</div>
          {question.passage && <div className={styles.passage}>{question.passage}</div>}<h2 className={styles.questionTitle} id="practice-question" ref={heading} tabIndex={-1}>{question.prompt}</h2>
          <fieldset className={styles.options} disabled={locked}><legend className={styles.srOnly}>Select one answer</legend>{question.options.map(option => <label key={`${question.id}-${option.id}`} className={`${styles.option} ${response.selected === option.id ? styles.selected : ""} ${locked ? styles.lockedOption : ""}`}><input type="radio" name={question.id} checked={response.selected === option.id} onChange={() => select(option.id)} /><span className={styles.optionLetter}>{option.id}</span><span className={styles.optionText}>{option.text}</span><span className={styles.radioMark} aria-hidden="true" /></label>)}</fieldset>
          <div className={styles.answerRow}><p role="status"><DiagnosticIcon name={locked ? "lock" : "check"} />{locked ? "Answer submitted. Your selection is locked." : "You can change your selection before submitting."}</p><button className={styles.primaryButton} disabled={locked || !response.selected} onClick={() => update(submitResponse(live.current, Date.now()))}>{locked ? "Submitted" : "Submit answer"}<DiagnosticIcon name="check" /></button></div>
          {!isExam && <div className={extra.mentor}><button className={styles.secondaryButton} onClick={() => setMentor(true)}>✦ AI Mentor</button><span>Help when you choose it.</span></div>}
          <div className={styles.questionNavigation}><button className={styles.secondaryButton} disabled={round.index === 0 || sequential} onClick={() => navigate(round.index - 1)}>← Previous</button><span>{round.index + 1} of {round.items.length} questions</span>{round.index < round.items.length - 1 ? <button className={styles.secondaryButton} disabled={sequential && !locked} onClick={() => navigate(round.index + 1)}>Next<DiagnosticIcon name="arrow" /></button> : <button className={styles.secondaryButton} onClick={() => setConfirmEnd(true)}>Finish<DiagnosticIcon name="check" /></button>}</div>
        </section>
      </div>
    </div><p className={styles.footnote}>{isExam ? "Timed mock exam · Submit each answer before moving forward. No hints or pauses. Leaving or refreshing loses your current progress. Answers are revealed after the exam." : "Response time is recorded until submission or timeout. Keep this tab open; reloading starts a new setup."}</p>
  </main>
    {confirmEnd && <DiagnosticModal titleId="practice-end-title" onClose={() => setConfirmEnd(false)}><h2 id="practice-end-title">{isExam ? "Submit your exam?" : "Ready to finish?"}</h2><p>You’ve submitted {submitted} of {round.items.length} answers. Unsubmitted selections won’t count.{isExam ? " This ends your exam and reveals your results." : ""}</p><div className={styles.modalActions}><button className={styles.secondaryButton} onClick={() => setConfirmEnd(false)}>Keep going</button><button className={styles.endButton} onClick={() => { const now = Date.now(); const next = advanceClock(live.current, now); update(next.completedAt === null ? { ...next, completedAt: now, reason: "stopped" } : next); }}>End {sessionLabel}</button></div></DiagnosticModal>}
    {!isExam && mentor && !confirmEnd && <DiagnosticModal titleId="mentor-title" onClose={() => setMentor(false)}><h2 id="mentor-title">AI Mentor</h2><p>AI guidance isn’t connected yet. For this {question.topic.toLowerCase()} question, start by identifying what is given and what you need to find, then evaluate each option.</p><p>This is a general study tip, not an AI-generated response. Your timer keeps running.</p><div className={styles.modalActions}><button className={styles.primaryButton} onClick={() => setMentor(false)}>Back to question</button></div></DiagnosticModal>}
  </div>;
}
