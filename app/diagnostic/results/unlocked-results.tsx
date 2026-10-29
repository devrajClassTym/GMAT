"use client";

import Link from "next/link";
import { questions, formatTime, type Attempt } from "../attempt";
import { DiagnosticHeader, DiagnosticIcon } from "../ui";
import { summarize } from "./summary";
import common from "../test/test.module.css";
import styles from "./results.module.css";

export default function UnlockedResults({ attempt, name }: { attempt: Attempt; name: string }) {
  const summary = summarize(attempt);
  return <div className={common.page}>
    <DiagnosticHeader label="YOUR DIAGNOSTIC RESULTS" />
    <main className={styles.report}>
      <span className={common.eyebrow}>YOUR STARTING POINT</span>
      <h1>{name ? `${name}, here’s your starting point.` : "Here’s your starting point."}</h1>
      <p>A first look at your answers, with room to learn more. These {questions.length} questions are an initial screening, not a complete skill diagnosis.</p>
      <div className={styles.metrics}>
        <div><span>Correct answers</span><strong>{summary.correct} / {summary.total}</strong><span>{summary.submitted} submitted · {summary.unanswered} unsubmitted</span></div>
        <div><span>Observed accuracy</span><strong>{Math.round(summary.correct / summary.total * 100)}%</strong><span>Across all {summary.total} questions, including unsubmitted</span></div>
        <div><span>Time taken</span><strong>{formatTime(summary.elapsedMs)}</strong><span>Of 30 minutes available</span></div>
      </div>

      <section className={styles.breakdown} aria-labelledby="observed-title">
        <span className={styles.sectionLabel}>OBSERVED PERFORMANCE · YOUR ANSWERS</span>
        <h2 id="observed-title">What this diagnostic measured</h2>
        <p className={styles.sectionIntro}>Section totals describe this attempt. Expand each section for topic results and evidence counts; a single answer cannot establish a skill level.</p>
        {summary.sections.map(item => <div className={styles.skillRow} key={item.section}>
          <div><span>{item.section}</span><strong>{item.correct} / {item.total} correct</strong></div>
          <div className={styles.skillTrack} aria-hidden="true"><span style={{ width: `${item.correct / item.total * 100}%` }} /></div>
          <p>{item.submitted} answered · {item.incorrect} incorrect · {item.unanswered} unsubmitted · {item.total} questions available</p>
          <details className={styles.topicDetails}>
            <summary>View topic evidence</summary>
            <ul>{item.skills.map(skill => <li key={skill.topic}>
              <div><strong>{skill.topic}</strong><span>{skill.correct} / {skill.total} correct · {skill.submitted} answered</span></div>
              <span className={styles.uncertain}>Insufficient evidence</span>
              <p>{skill.submitted === 0 ? "No submitted answer to assess this topic." : `Only ${skill.submitted} question assessed this topic. More varied questions are needed before identifying a strength or weakness.`}</p>
            </li>)}</ul>
          </details>
        </div>)}
      </section>

      <section className={`${styles.breakdown} ${styles.interpretation}`} aria-labelledby="interpretation-title">
        <span className={styles.sectionLabel}>INTERPRETATION · RULES-BASED PREVIEW</span>
        <h2 id="interpretation-title">Where to go next</h2>
        <p className={styles.sectionIntro}>No topic weakness can be identified reliably from this question set. These suggestions use your submitted answers, not an AI diagnosis. AI analysis is not connected yet.</p>
        <div className={styles.recommendations}>{summary.sections.map(item => <article className={styles.recommendation} key={item.section}>
          <span className={styles.uncertain}>{item.incorrect ? "Review opportunity" : "Build more evidence"}</span>
          <h3>{item.section}</h3>
          <p><strong>Why this is suggested: </strong>{item.incorrect > 0
            ? `You answered ${item.incorrect} of ${item.submitted} submitted questions incorrectly. Reviewing this section may help you understand those misses; it does not establish a topic weakness.`
            : item.unanswered > 0
              ? `${item.unanswered} of ${item.total} questions were unsubmitted. Try this section at your own pace; unanswered items do not establish a weakness.`
              : `You answered all ${item.total} questions correctly. That is encouraging for these items, but one question per topic cannot establish mastery.`}</p>
          <Link className={common.secondaryButton} href={`/diagnostic/practice?section=${encodeURIComponent(item.section)}`}>Begin practice review<DiagnosticIcon name="arrow" /></Link>
        </article>)}</div>
        <p className={styles.resultNote}>For now, practice reuses the five diagnostic questions in each section. It supports review; repeated answers do not provide new diagnostic evidence.</p>
      </section>
      <p className={styles.resultNote}>This is not an official GMAT score prediction. Unsubmitted answers do not count as correct or as evidence of a skill weakness. Results are calculated in your browser.</p>
      <Link className={common.secondaryButton} href="/">Back to home</Link>
    </main>
  </div>;
}
