"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { questions, type Question } from "../attempt";
import answerKey from "../data/answer-key.json";
import { DiagnosticHeader } from "../ui";
import common from "../test/test.module.css";
import styles from "../results/results.module.css";

export function PracticeScreen() {
  const params = useSearchParams();
  const section = params.get("section");
  const items = questions.filter(question => question.section === section);
  if (!items.length) return <div className={common.page}><DiagnosticHeader label="PRACTICE REVIEW" /><main className={styles.report}><h1>Choose a practice set</h1><p>Select a section from your results to begin.</p><Link href="/diagnostic/results" className={common.secondaryButton}>Back to results</Link></main></div>;
  return <PracticeSet key={section} items={items} section={section!} />;
}

function PracticeSet({ items, section }: { items: Question[]; section: string }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const question = items[index];
  const answer = (answerKey as Record<string, string>)[question.id];
  function next() {
    if (index === items.length - 1) setFinished(true);
    else { setIndex(index + 1); setSelected(null); setChecked(false); }
    heading.current?.focus();
  }
  return <div className={common.page}><DiagnosticHeader label="PRACTICE REVIEW" /><main className={styles.report}>
    <span className={common.eyebrow}>{section.toUpperCase()}</span>
    <h1 ref={heading} tabIndex={-1}>{finished ? "Practice review complete." : "Take another look."}</h1>
    <p>Reviewing existing diagnostic questions · Untimed · Your original results stay saved.</p>
    {finished ? <section className={styles.breakdown}><h2>{correct} / {items.length} correct in this review</h2><p className={styles.sectionIntro}>These were repeated questions. This review does not increase the evidence available for your diagnostic.</p><button className={common.secondaryButton} onClick={() => { setIndex(0); setSelected(null); setChecked(false); setCorrect(0); setFinished(false); }}>Review again</button></section>
      : <section className={styles.breakdown} aria-label="Practice question">
        <p className={styles.sectionIntro}>Question {index + 1} of {items.length} · {question.topic}</p>
        {question.passage && <div className={common.passage}>{question.passage}</div>}
        <h2 className={styles.practicePrompt}>{question.prompt}</h2>
        <fieldset className={common.options} disabled={checked}><legend className={common.srOnly}>Choose an answer</legend>{question.options.map(option => <label className={`${common.option} ${selected === option.id ? common.selected : ""}`} key={`${question.id}-${option.id}`}>
          <input type="radio" name={question.id} checked={selected === option.id} onChange={() => setSelected(option.id)} /><span className={common.optionLetter}>{option.id}</span><span className={common.optionText}>{option.text}</span>
        </label>)}</fieldset>
        {checked && <p className={styles.feedback} role="status">{selected === answer ? "Correct." : "Not quite."} Answer {answer}: {question.options.find(option => option.id === answer)?.text}</p>}
        <div className={styles.practiceActions}>{checked
          ? <button className={common.primaryButton} onClick={next}>{index === items.length - 1 ? "Finish practice" : "Next question →"}</button>
          : <button className={common.primaryButton} disabled={!selected} onClick={() => { setChecked(true); if (selected === answer) setCorrect(value => value + 1); }}>Check answer</button>}</div>
      </section>}
    <div className={styles.practiceActions}><Link href="/diagnostic/results" className={common.secondaryButton}>← Back to results</Link></div>
  </main></div>;
}
