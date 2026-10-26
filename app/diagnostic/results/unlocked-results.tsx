"use client";

import Link from "next/link";
import answerKey from "../data/answer-key.json";
import { questions, formatTime, type Attempt } from "../attempt";
import { DiagnosticHeader } from "../ui";
import common from "../test/test.module.css";
import styles from "./results.module.css";

// UI-only scoring. Replace this with authenticated server results when APIs exist.
export function summarize(attempt: Attempt) {
  const key = answerKey as Record<string, string>;
  const correct = attempt.answers.filter(answer => answer.submittedAt !== null && answer.submittedOptionId === key[answer.questionId]).length;
  const sections = [...new Set(questions.map(question => question.section))].map(section => {
    const answers = attempt.answers.filter(answer => answer.section === section);
    return { section, total: answers.length,
      correct: answers.filter(answer => answer.submittedAt !== null && answer.submittedOptionId === key[answer.questionId]).length,
      activeMs: answers.reduce((sum, answer) => sum + answer.timeSpentMs, 0),
      visited: answers.filter(answer => answer.firstViewedAt !== null).length,
    };
  });
  return { correct, sections, accuracy: Math.round(correct / questions.length * 100),
    submitted: attempt.answers.filter(answer => answer.submittedAt !== null).length,
    elapsedMs: Math.max(0, (attempt.completedAt ?? attempt.startedAt) - attempt.startedAt) };
}

export default function UnlockedResults({ attempt, name }: { attempt: Attempt; name: string }) {
  const summary = summarize(attempt);
  return <div className={common.page}><DiagnosticHeader label="YOUR DIAGNOSTIC RESULTS" /><main className={styles.report}><span className={common.eyebrow}>YOUR STARTING POINT</span><h1>{name ? `${name}, here’s your starting point.` : "Here’s your starting point."}</h1><p>A practice snapshot to help you choose what to work on next.</p><div className={styles.metrics}><div><span>Practice accuracy</span><strong>{summary.accuracy}%</strong><span>Across all 15 questions</span></div><div><span>Correct answers</span><strong>{summary.correct} / {questions.length}</strong><span>{summary.submitted} answers submitted</span></div><div><span>Time taken</span><strong>{formatTime(summary.elapsedMs)}</strong><span>Of 30 minutes available</span></div></div><section className={styles.breakdown}><h2>Your skill breakdown</h2>{summary.sections.map(item => <div className={styles.skillRow} key={item.section}><div><span>{item.section}</span><strong>{Math.round(item.correct / item.total * 100)}%</strong></div><div className={styles.skillTrack}><span style={{ width: `${item.correct / item.total * 100}%` }} /></div><p>{item.correct} correct · {item.total} questions · {formatTime(item.visited ? item.activeMs / item.visited : 0)} average active time per visited question</p></div>)}</section><p className={styles.resultNote}>This short practice diagnostic is not an official GMAT score prediction. Unsubmitted answers do not count as correct. Timing excludes inactive tab time for each question.</p><Link className={common.secondaryButton} href="/">Back to home</Link></main></div>;
}
