"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "../theme-toggle";
import styles from "./walkthrough.module.css";

const steps = [
  { target: "timer", title: "Keep an eye on the clock", text: "Your time remaining appears here. You’ll have 30 minutes for the diagnostic." },
  { target: "question", title: "Know where you are", text: "The question number and section appear above each question. This is a sample question to help you get familiar with the screen." },
  { target: "options", title: "Choose one of four options", text: "Select the answer you want to submit. You can change your selection before submitting." },
  { target: "submit", title: "Submit means final", text: "Submit when you’re ready to lock in your answer. Once submitted, you cannot change it—even if you return to the question." },
  { target: "navigation", title: "Move at your own pace", text: "Use Previous and Next to move between questions. Moving to another question does not submit your selected answer." },
  { target: "sidebar", title: "Your question map", text: "Green boxes mean submitted, blank boxes mean not submitted, and a blue border marks your current question. During the test, you’ll be able to click a number to jump straight to it." },
  { target: "end", title: "Finish when you’re ready", text: "End Diagnostic will finish your session. Before ending, use the question map to check for any answers you haven’t submitted." },
] as const;
const finalStep = steps.length;
type Placement = { x: number; y: number; fromX: number; fromY: number; toX: number; toY: number; width: number };

function SmallIcon({ kind }: { kind: "clock" | "arrow" | "check" | "book" }) {
  const paths = { clock: "M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", arrow: "M5 12h14m-6-6 6 6-6 6", check: "m5 12 4 4L19 6", book: "M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4V4Zm9 3a3 3 0 0 1 3-3h5v15h-4a4 4 0 0 0-4 2" };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[kind]} /></svg>;
}

export function DiagnosticWalkthrough() {
  const [step, setStep] = useState(0);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const active = step < finalStep ? steps[step] : null;

  useEffect(() => {
    const target = active ? document.getElementById(`tour-${active.target}`) : null;
    target?.scrollIntoView({ block: window.innerWidth < 900 ? "start" : "center", behavior: "instant" });
    if (target && window.innerWidth < 900) window.scrollBy(0, -24);
    function positionPanel() {
      if (!target || !panel.current) return;
      const rect = target.getBoundingClientRect();
      const width = Math.min(350, window.innerWidth - 32);
      const height = panel.current.offsetHeight;
      const gap = 28;
      let x: number, y: number, fromX: number, fromY: number, toX: number, toY: number;
      if (window.innerWidth >= 900 && rect.right + width + gap < window.innerWidth - 16) {
        x = rect.right + gap; y = Math.max(16, Math.min(rect.top, window.innerHeight - height - 16));
        fromX = x; fromY = y + 50; toX = rect.right + 5; toY = Math.min(rect.bottom - 10, Math.max(rect.top + 10, fromY));
      } else {
        x = Math.max(16, Math.min(rect.left, window.innerWidth - width - 16));
        const below = rect.bottom + gap + height < window.innerHeight - 16;
        y = below ? rect.bottom + gap : Math.max(16, rect.top - height - gap);
        fromX = x + width / 2; fromY = below ? y : y + height;
        toX = Math.max(rect.left + 10, Math.min(fromX, rect.right - 10)); toY = below ? rect.bottom + 5 : rect.top - 5;
        if (!below && rect.top < height + gap + 16) {
          y = Math.max(16, window.innerHeight - height - 16);
          fromY = y; toY = rect.top + 5;
        }
      }
      setPlacement({ x, y, fromX, fromY, toX, toY, width });
    }
    const frame = requestAnimationFrame(positionPanel);
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, true);
    const observer = new ResizeObserver(positionPanel);
    if (panel.current) observer.observe(panel.current);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("resize", positionPanel); window.removeEventListener("scroll", positionPanel, true); };
  }, [active]);

  useEffect(() => { panel.current?.focus({ preventScroll: true }); }, [step]);

  function spotlight(name: string) { return active?.target === name ? styles.spotlight : ""; }
  function goTo(next: number) { setPlacement(null); setStep(next); }

  return <div className={styles.page}>
    <header className={styles.header} inert>
      <Link href="/" className={styles.brand}><SmallIcon kind="book" />GMAT<span>prep</span></Link>
      <span className={styles.previewTag}>PLATFORM WALKTHROUGH</span>
      <ThemeToggle />
    </header>
    <main className={styles.workspace} inert>
      <div className={styles.intro}><div><span className={styles.eyebrow}>BEFORE YOU BEGIN</span><h1>Get to know your diagnostic.</h1><p>A quick tour of the screen. No answers to submit just yet.</p></div></div>
      <div className={styles.testShell}>
        <div className={styles.testTop}>
          <div><strong>GMAT Diagnostic</strong><span>15 questions · Sample screen</span></div>
          <div id="tour-timer" className={`${styles.timer} ${spotlight("timer")}`}><SmallIcon kind="clock" /><div><span>Time remaining</span><strong>30:00</strong></div><span className={styles.paused}>PAUSED</span></div>
          <div id="tour-end" className={spotlight("end")}><button className={styles.endButton} disabled>End Diagnostic</button></div>
        </div>
        <div className={styles.testBody}>
          <aside id="tour-sidebar" className={`${styles.sidebar} ${spotlight("sidebar")}`} aria-label="Sample question map">
            <div className={styles.sidebarTitle}><h2>Questions</h2><span>2 / 15 submitted</span></div>
            <div className={styles.questionGrid}>{Array.from({ length: 15 }, (_, i) => <button key={i} disabled aria-label={`Question ${i + 1}, ${i < 2 ? "submitted" : "not submitted"}${i === 2 ? ", current question" : ""}`} className={`${styles.questionBox} ${i < 2 ? styles.submitted : ""} ${i === 2 ? styles.current : ""}`}>{String(i + 1).padStart(2, "0")}</button>)}</div>
            <div className={styles.legend}><span><i className={styles.greenDot} />Submitted</span><span><i />Not submitted</span><span><i className={styles.blueDot} />Current question</span></div>
            <p className={styles.sidebarNote}>Sample states shown for the tour.</p>
          </aside>
          <section className={styles.questionPanel} aria-label="Sample question">
            <div id="tour-question" className={`${styles.questionHeading} ${spotlight("question")}`}><div className={styles.questionMeta}><span>QUANTITATIVE REASONING</span><span>Question 3 of 15</span></div><h2>A number increased by 20% equals 60.<br />What is the original number?</h2></div>
            <div id="tour-options" className={`${styles.options} ${spotlight("options")}`} aria-label="Four sample answer options">{["40", "48", "50", "54"].map((value, i) => <button disabled key={value} className={`${styles.option} ${i === 2 ? styles.selected : ""}`}><span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span><span>{value}</span>{i === 2 && <span className={styles.selectionDot} />}</button>)}</div>
            <div className={styles.answerRow}><p><SmallIcon kind="check" />Submitted answers cannot be changed.</p><div id="tour-submit" className={spotlight("submit")}><button disabled className={styles.primaryButton}>Submit answer<SmallIcon kind="check" /></button></div></div>
            <div id="tour-navigation" className={`${styles.questionNavigation} ${spotlight("navigation")}`}><button disabled>← Previous</button><span>3 of 15 questions</span><button disabled>Next<SmallIcon kind="arrow" /></button></div>
          </section>
        </div>
      </div>
      <p className={styles.demoNote}>This is a walkthrough only. The timer and test controls are inactive.</p>
    </main>
    <div className={styles.shade} aria-hidden="true" />
    {active && placement && <svg className={styles.connector} aria-hidden="true"><defs><marker id="tour-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="currentColor" strokeWidth="1.8" /></marker></defs><path d={`M ${placement.fromX} ${placement.fromY} L ${placement.toX} ${placement.toY}`} fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#tour-arrow)" /></svg>}
    <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description" className={`${styles.tourPanel} ${!active ? styles.finalPanel : ""}`} style={active && placement ? { left: placement.x, top: placement.y, width: placement.width } : undefined} onKeyDown={(event) => {
      if (event.key === "Escape" && active) goTo(finalStep);
      if (event.key === "Tab") {
        const buttons = panel.current?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]");
        if (!buttons?.length) return;
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel.current)) { event.preventDefault(); first.focus(); }
      }
    }}>
      <div className={styles.tourTop}><span>{active ? `STEP ${step + 1} OF ${steps.length}` : "YOU’RE ALL SET"}</span>{active && <button className={styles.skip} onClick={() => goTo(finalStep)}>Skip walkthrough</button>}</div>
      {!active && <div className={styles.readyIcon}><SmallIcon kind="check" /></div>}
      <h2 id="tour-title">{active ? active.title : "Ready for your starting point?"}</h2>
      <p id="tour-description">{active ? active.text : "You’ve seen how it works: 15 questions, 30 minutes, and a clearer view of where to focus your prep."}</p>
      {active ? <><div className={styles.dots} aria-hidden="true">{steps.map((_, i) => <i key={i} className={i === step ? styles.activeDot : ""} />)}</div><div className={styles.tourActions}><button className={styles.back} disabled={step === 0} onClick={() => goTo(step - 1)}>Back</button><button className={styles.primaryButton} onClick={() => goTo(step + 1)}>{step === steps.length - 1 ? "Finish walkthrough" : "Next step"}<SmallIcon kind="arrow" /></button></div></> : <><p className={styles.accountNote}>No signup to begin. An account will be required to view results. This diagnostic is not an official GMAT score prediction.</p><button className={`${styles.primaryButton} ${styles.startButton}`} disabled title="The diagnostic test will be available later">Start My Diagnostic<SmallIcon kind="arrow" /></button><span className={styles.comingSoon}>The actual diagnostic is coming next.</span><div className={styles.finalLinks}><button onClick={() => goTo(0)}>Replay walkthrough</button><Link href="/">Back to home</Link></div></>}
    </div>
  </div>;
}
