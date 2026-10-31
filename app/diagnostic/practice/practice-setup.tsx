"use client";

import Link from "next/link";
import { useState } from "react";
import { DiagnosticIcon } from "../ui";
import { approvedQuestions, selectQuestions, topicKey, type Settings, type Timing } from "./practice-engine";
import styles from "../test/test.module.css";
import setup from "./practice.module.css";

export function PracticeSetup({ section, onStart }: { section: string | null; onStart: (settings: Settings) => void }) {
  const [topics, setTopics] = useState<string[]>(() => approvedQuestions.filter(question => !section || question.section === section).map(topicKey));
  const [length, setLength] = useState<number | "unlimited">(10);
  const [timing, setTiming] = useState<Timing>("untimed");
  const [minutes, setMinutes] = useState(20);
  const [seconds, setSeconds] = useState(120);
  const settings: Settings = { topics, length, timing, seconds: timing === "round" ? minutes * 60 : seconds };
  const available = approvedQuestions.filter(question => topics.includes(topicKey(question))).length;
  const count = selectQuestions(settings).length;
  const validTime = timing === "untimed" || (Number.isInteger(settings.seconds) && settings.seconds >= (timing === "round" ? 60 : 10) && settings.seconds <= (timing === "round" ? 10800 : 900));

  return <div className={`${styles.page} ${setup.centeredPage}`}><main className={setup.setupWorkspace}>
    <form className={`${styles.shell} ${setup.form}`} onSubmit={event => { event.preventDefault(); if (count && validTime) onStart(settings); }}>
      <div className={`${styles.intro} ${setup.intro}`}><span className={styles.eyebrow}>PRACTICE YOUR WAY</span><h1>Build your practice round.</h1><p>A few choices. Then you’re ready to go.</p></div>
      <fieldset className={setup.fieldset}><legend>Subjects & topics</legend><div className={setup.topicActions}><span role="status">{available} approved questions available</span><button type="button" onClick={() => setTopics(approvedQuestions.map(topicKey))}>Select all</button><button type="button" onClick={() => setTopics([])}>Clear</button></div>
        <div className={setup.sections}>{[...new Set(approvedQuestions.map(question => question.section))].map(name => {
          const subjectTopics = [...new Set(approvedQuestions.filter(question => question.section === name).map(topicKey))];
          const allSelected = subjectTopics.every(key => topics.includes(key));
          const partlySelected = !allSelected && subjectTopics.some(key => topics.includes(key));
          return <div className={setup.subject} key={name}><button type="button" className={setup.subjectChip} aria-pressed={partlySelected ? "mixed" : allSelected} onClick={() => setTopics(current => allSelected ? current.filter(key => !subjectTopics.includes(key)) : [...new Set([...current, ...subjectTopics])])}><span aria-hidden="true">{allSelected ? "✓" : partlySelected ? "−" : "+"}</span>{name}</button><div className={setup.topicChips}>{[...new Set(approvedQuestions.filter(question => question.section === name).map(question => question.topic))].map(topic => {
          const key = `${name}::${topic}`;
          return <label key={key} className={setup.topic}><input type="checkbox" checked={topics.includes(key)} onChange={event => setTopics(current => event.target.checked ? [...current, key] : current.filter(value => value !== key))} /><span className={setup.chipMark} aria-hidden="true">{topics.includes(key) ? "✓" : "+"}</span><span>{topic}</span><small>{approvedQuestions.filter(question => topicKey(question) === key).length}</small></label>;
        })}</div></div>;
        })}</div>
      </fieldset>
      <div className={setup.settingsGrid}>
      <fieldset className={setup.fieldset}><legend>Round length</legend><div className={setup.choices}>{([10, 15, 20, "unlimited"] as const).map(value => <label className={setup.choice} key={value}><input type="radio" name="length" aria-label={value === "unlimited" ? "Unlimited questions" : `${value} questions`} checked={length === value} onChange={() => setLength(value)} /><span>{value === "unlimited" ? "Unlimited" : value}</span></label>)}</div><p>{length === "unlimited" ? "Until you stop or content runs out. No repeats." : available < length ? `${count} of ${length} questions available. This round has ${count}.` : `${count} questions from your selected topics.`}</p></fieldset>
      <fieldset className={setup.fieldset}><legend>Timing</legend><div className={setup.choices}>{([{ value: "untimed", title: "Untimed" }, { value: "round", title: "Whole round" }, { value: "question", title: "Per question" }] as const).map(option => <label className={setup.choice} key={option.value}><input type="radio" name="timing" checked={timing === option.value} onChange={() => setTiming(option.value)} /><span>{option.title}</span></label>)}</div>
        {timing === "round" && <label className={setup.timeInput}>Minutes for the complete round<input type="number" min={1} max={180} step={1} required value={minutes || ""} onChange={event => setMinutes(Number(event.target.value))} /></label>}
        {timing === "question" && <label className={setup.timeInput}>Seconds per question<input type="number" min={10} max={900} step={1} required value={seconds || ""} onChange={event => setSeconds(Number(event.target.value))} /></label>}
        <p>{timing === "question" ? "Timeout locks the question and advances. Timer runs in the background." : timing === "round" ? "Timeout ends the round. Timer runs in the background." : "No countdown. Response times are still recorded."}</p>
      </fieldset>
      </div>
      <div className={setup.footer}><Link href="/dashboard" className={styles.secondaryButton}>← Dashboard</Link><button className={styles.primaryButton} disabled={!count || !validTime}>Start Practice · {count} questions<DiagnosticIcon name="arrow" /></button></div>
      <p className={styles.footnote}>Sample question bank with demo approval statuses. Questions are shared with the diagnostic.</p>
    </form>
  </main></div>;
}
