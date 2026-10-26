import common from "../test/test.module.css";
import styles from "./results.module.css";

/** This component accepts no result data. Removing its blur only reveals XX values. */
export function LockedResultsBackdrop() {
  return <main className={styles.maskedReport} aria-hidden="true" inert>
      <span className={common.eyebrow}>YOUR STARTING POINT</span><h1>Your diagnostic, decoded.</h1><p>A clearer picture of your strengths and what comes next.</p>
      <div className={styles.metrics}>{[["Practice accuracy", "XX%"], ["Correct answers", "XX / XX"], ["Time taken", "XX:XX"]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong><span>Diagnostic overview</span></div>)}</div>
      <section className={styles.breakdown}><h2>Your skill breakdown</h2>{["Quantitative Reasoning", "Verbal Reasoning", "Data Insights"].map((section, index) => <div className={styles.skillRow} key={section}><div><span>{section}</span><strong>XX%</strong></div><div className={styles.skillTrack}><span style={{ width: `${[72, 58, 64][index]}%` }} /></div><p>XX correct · XX questions · XX:XX average time</p></div>)}</section>
    </main>;
}
