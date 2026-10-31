import Link from "next/link";
import { DiagnosticHeader, DiagnosticIcon } from "../diagnostic/ui";
import type { SessionRecord } from "./session-storage";
import sessionData from "./data/sessions.json";
import styles from "./dashboard.module.css";

export function Dashboard() {
  const records = [...sessionData as SessionRecord[]].sort((first, second) => second.completedAt - first.completedAt);
  const practice = records.filter(session => session.kind === "practice");
  const latest = practice[0];
  const baseline = latest && practice.findLast(session => session.section === latest.section && session.total === latest.total);
  const firstAccuracy = baseline?.correct == null ? 0 : baseline.correct / baseline.total;
  const improvement = latest && baseline && latest.id !== baseline.id && latest.correct !== null && firstAccuracy > 0
    ? Math.round(((latest.correct / latest.total - firstAccuracy) / firstAccuracy) * 100) : null;

  return <div className={styles.page}>
    <DiagnosticHeader label="DASHBOARD" />
    <main className={styles.main}>
      <div className={styles.intro}><span className={styles.eyebrow}>YOUR LEARNING JOURNEY</span><h1>A little practice. Real progress.</h1><p>Pick up where you left off and make your next session count.</p></div>
      <section className={styles.stats} aria-label="Your statistics">
        <article className={styles.stat}><span className={styles.statIcon}><DiagnosticIcon name="clock" /></span><h2>Total tests taken</h2><strong>{records.filter(session => session.kind === "diagnostic" || session.kind === "exam").length}</strong><p>Completed diagnostics and exams</p></article>
        <article className={styles.stat}><span className={styles.statIcon}><DiagnosticIcon name="check" /></span><h2>Questions answered</h2><strong>{records.reduce((total, session) => total + session.answered, 0)}</strong><p>Across completed tests and practice</p></article>
        <article className={styles.stat}><span className={styles.statIcon}>↗</span><h2>Percentage improvement</h2><strong>{improvement === null ? "—" : `${improvement > 0 ? "+" : ""}${improvement}%`}</strong><p>{improvement === null ? "Needs two same-section practices and a nonzero baseline" : `${latest.section}: latest vs. first practice accuracy`}</p></article>
      </section>
      <section className={styles.actions} aria-label="Start a session">
        <Link href="/diagnostic/practice" className={styles.practice}><span className={styles.actionIcon}><DiagnosticIcon name="book" /></span><span><strong>Start Practice</strong><small>Choose your topics, round length, and timing.</small></span><DiagnosticIcon name="arrow" /></Link>
        <Link href="/exam" className={styles.exam}><span className={styles.actionIcon}><DiagnosticIcon name="clock" /></span><span><strong>Exam Mode</strong><small>Start your timed exam. 15 questions · 30 minutes.</small></span><DiagnosticIcon name="arrow" /></Link>
      </section>
      <section className={styles.history} aria-labelledby="history-title">
        <div className={styles.historyHeading}><div><span className={styles.eyebrow}>KEEP THE MOMENTUM</span><h2 id="history-title">Previous practice sessions</h2></div><span className={styles.count}>{practice.length} sessions</span></div>
        {practice.length === 0 ? <div className={styles.empty}><DiagnosticIcon name="book" /><h3>Your first session starts here.</h3><p>Finish a practice set and your results will appear here.</p><Link href="/diagnostic/practice">Start your first practice →</Link></div> :
          <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th scope="col">Practice session</th><th scope="col">Completed</th><th scope="col">Answered</th><th scope="col">Accuracy</th><th scope="col">Action</th></tr></thead><tbody>{practice.map(session => <tr key={session.id}><td><strong>{session.section}</strong><small>Untimed practice</small></td><td>{new Date(session.completedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</td><td>{session.answered} / {session.total}</td><td>{session.correct === null ? "—" : `${Math.round(session.correct / session.total * 100)}%`}</td><td><Link href={`/diagnostic/practice?section=${encodeURIComponent(session.section)}`} aria-label={`Practice ${session.section} again`}>Practice again ↗</Link></td></tr>)}</tbody></table></div>}
      </section>
      <p className={styles.note}>Showing sample data. Improvement compares the latest and first practice accuracy for the same section; it is not a GMAT score prediction.</p>
    </main>
  </div>;
}
