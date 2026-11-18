"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ThemeToggle } from "../theme-toggle";

const steps = [
  {
    target: "timer",
    title: "Keep an eye on the clock",
    text: "Your time remaining appears here. You’ll have 30 minutes for the diagnostic.",
  },
  {
    target: "question",
    title: "Know where you are",
    text: "The question number and section appear above each question. This is a sample question to help you get familiar with the screen.",
  },
  {
    target: "options",
    title: "Choose one of four options",
    text: "Select the answer you want to submit. You can change your selection before submitting.",
  },
  {
    target: "submit",
    title: "Submit means final",
    text: "Submit when you’re ready to lock in your answer. Once submitted, you cannot change it—even if you return to the question.",
  },
  {
    target: "navigation",
    title: "Move at your own pace",
    text: "Use Previous and Next to move between questions. Moving to another question does not submit your selected answer.",
  },
  {
    target: "sidebar",
    title: "Your question map",
    text: "Green boxes mean submitted, blank boxes mean not submitted, and a blue border marks your current question. During the test, you’ll be able to click a number to jump straight to it.",
  },
  {
    target: "end",
    title: "Finish when you’re ready",
    text: "End Diagnostic will finish your session. Before ending, use the question map to check for any answers you haven’t submitted.",
  },
] as const;
const finalStep = steps.length;
type Placement = {
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  width: number;
};

function SmallIcon({ kind }: { kind: "clock" | "arrow" | "check" | "book" }) {
  const paths = {
    clock: "M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    arrow: "M5 12h14m-6-6 6 6-6 6",
    check: "m5 12 4 4L19 6",
    book: "M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4V4Zm9 3a3 3 0 0 1 3-3h5v15h-4a4 4 0 0 0-4 2",
  };
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[kind]} />
    </svg>
  );
}

export function DiagnosticWalkthrough() {
  const [step, setStep] = useState(0);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const active = step < finalStep ? steps[step] : null;

  useLayoutEffect(() => {
    const target = active
      ? document.getElementById(`tour-${active.target}`)
      : null;
    target?.scrollIntoView({
      block: window.innerWidth < 900 ? "start" : "center",
      behavior: "instant",
    });
    if (target && window.innerWidth < 900) window.scrollBy(0, -24);
    function positionPanel() {
      if (!target || !panel.current) return;
      const rect = target.getBoundingClientRect();
      const width = Math.min(350, window.innerWidth - 32);
      const height = panel.current.offsetHeight;
      const gap = 28;
      let x: number,
        y: number,
        fromX: number,
        fromY: number,
        toX: number,
        toY: number;
      if (
        window.innerWidth >= 900 &&
        rect.right + width + gap < window.innerWidth - 16
      ) {
        x = rect.right + gap;
        y = Math.max(16, Math.min(rect.top, window.innerHeight - height - 16));
        fromX = x;
        fromY = y + 50;
        toX = rect.right + 5;
        toY = Math.min(rect.bottom - 10, Math.max(rect.top + 10, fromY));
      } else {
        x = Math.max(16, Math.min(rect.left, window.innerWidth - width - 16));
        const below = rect.bottom + gap + height < window.innerHeight - 16;
        y = below ? rect.bottom + gap : Math.max(16, rect.top - height - gap);
        fromX = x + width / 2;
        fromY = below ? y : y + height;
        toX = Math.max(rect.left + 10, Math.min(fromX, rect.right - 10));
        toY = below ? rect.bottom + 5 : rect.top - 5;
        if (!below && rect.top < height + gap + 16) {
          y = Math.max(16, window.innerHeight - height - 16);
          fromY = y;
          toY = rect.top + 5;
        }
      }
      setPlacement({ x, y, fromX, fromY, toX, toY, width });
    }
    // Measure the new content and target before paint to avoid a fallback-position flash.
    positionPanel();
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, true);
    const observer = new ResizeObserver(positionPanel);
    if (panel.current) observer.observe(panel.current);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", positionPanel);
      window.removeEventListener("scroll", positionPanel, true);
    };
  }, [active]);

  useEffect(() => {
    panel.current?.focus({ preventScroll: true });
  }, [step]);

  function spotlight(name: string) {
    return active?.target === name
      ? "[&&]:relative [&&]:z-12 [&&]:outline-3 [&&]:outline-[#a8c8ff] [&&]:outline-offset-[7px] [&&]:shadow-[0_0_0_9px_#a8c8ff18,_0_10px_45px_#0003] [&&]:rounded-[8px]"
      : "";
  }
  function goTo(next: number) {
    setStep(next);
  }

  return (
    <div className="min-h-svh bg-background text-foreground font-sans [&_button]:[-webkit-tap-highlight-color:transparent] [&_button]:cursor-pointer [&_a]:[-webkit-tap-highlight-color:transparent] [&_button:disabled]:cursor-default [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-focus [&_button:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-focus [&_a:focus-visible]:outline-offset-4">
      <header
        className="max-w-350 m-auto py-6 px-10 flex items-center gap-6 border-b border-b-line max-[900px]:py-5 max-[900px]:px-6 max-[600px]:py-4.5 max-[600px]:px-4 max-[600px]:gap-3.5"
        inert
      >
        <Link
          href="/"
          className="flex items-center gap-[7px] text-[19px] font-[650] tracking-[-.5px] [&_>_svg]:text-accent [&_>_svg]:mr-[3px] [&_>_span]:font-normal [&_>_span]:text-muted [&_>_span]:ml-[-5px]"
        >
          <SmallIcon kind="book" />
          GMAT<span>prep</span>
        </Link>
        <span className="ml-auto text-[9px] tracking-[1.5px] text-muted max-[600px]:text-[7px] max-[600px]:tracking-[.8px]">
          PLATFORM WALKTHROUGH
        </span>
        <ThemeToggle />
      </header>
      <main
        className="max-w-330 pt-10.5 px-10 pb-22.5 m-auto max-[900px]:pt-8 max-[900px]:px-6 max-[900px]:pb-32.5 max-[600px]:pt-7 max-[600px]:px-4 max-[600px]:pb-85"
        inert
      >
        <div className="[&_h1]:text-[clamp(25px,_3vw,_34px)] [&_h1]:font-[550] [&_h1]:tracking-[-1px] [&_h1]:leading-[1.2] [&_h1]:mt-3 [&_h1]:mx-0 [&_h1]:mb-2.5 [&_p]:text-[13px] [&_p]:text-muted [&_p]:mt-0 [&_p]:mx-0 [&_p]:mb-7">
          <div>
            <span className="text-accent text-[9px] tracking-[1.8px] font-semibold">
              BEFORE YOU BEGIN
            </span>
            <h1>Get to know your diagnostic.</h1>
            <p>A quick tour of the screen. No answers to submit just yet.</p>
          </div>
        </div>
        <div className="bg-surface border border-line rounded-[14px] shadow-[0_8px_35px_var(--shadow)]">
          <div className="flex items-center gap-7 border-b border-b-line py-5 px-[25px] [&_>_div:first-child]:mr-auto [&_>_div:first-child_>_strong]:block [&_>_div:first-child_>_strong]:text-[14px] [&_>_div:first-child_>_strong]:font-semibold [&_>_div:first-child_>_span]:block [&_>_div:first-child_>_span]:mt-[5px] [&_>_div:first-child_>_span]:text-[10px] [&_>_div:first-child_>_span]:text-muted max-[600px]:p-4 max-[600px]:gap-3 max-[600px]:flex-wrap max-[600px]:[&_>_div:first-child]:w-full">
            <div>
              <strong>GMAT Diagnostic</strong>
              <span>15 questions · Sample screen</span>
            </div>
            <div
              id="tour-timer"
              className={`flex items-center gap-[11px] bg-background border border-line rounded-[8px] py-[9px] px-[13px] [&_>_svg]:text-accent [&_div_>_span]:block [&_div_>_span]:text-muted [&_div_>_span]:text-[9px] [&_strong]:font-mono [&_strong]:text-[20px] [&_strong]:font-medium [&_strong]:tabular-nums max-[600px]:mr-auto ${spotlight("timer")}`}
            >
              <SmallIcon kind="clock" />
              <div>
                <span>Time remaining</span>
                <strong>30:00</strong>
              </div>
              <span className="text-[7px] tracking-[1px] text-muted border border-line rounded-[4px] py-1 px-[5px]">
                PAUSED
              </span>
            </div>
            <div id="tour-end" className={spotlight("end")}>
              <button
                className="block border border-danger bg-danger text-white rounded-[7px] py-3 px-4 text-[11px]! font-[550]!"
                disabled
              >
                End Diagnostic
              </button>
            </div>
          </div>
          <div className="grid grid-cols-[235px_1fr] max-[900px]:grid-cols-[190px_1fr] max-[600px]:flex max-[600px]:flex-col">
            <aside
              id="tour-sidebar"
              className={`py-[25px] px-5.5 border-r border-r-line bg-surface rounded-[0_0_0_14px] max-[900px]:py-5.5 max-[900px]:px-4 max-[600px]:border-r-0 max-[600px]:border-b max-[600px]:border-b-line max-[600px]:py-5 max-[600px]:px-4 max-[600px]:rounded-none ${spotlight("sidebar")}`}
              aria-label="Sample question map"
            >
              <div className="[&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-1.5 [&_h2]:text-[13px] [&_h2]:font-semibold [&_>_span]:text-[10px] [&_>_span]:text-muted max-[600px]:flex max-[600px]:justify-between max-[600px]:items-center">
                <h2>Questions</h2>
                <span>2 / 15 submitted</span>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-[23px] max-[900px]:grid-cols-3 max-[600px]:grid-cols-5 max-[600px]:gap-[7px] max-[600px]:mt-3.5">
                {Array.from({ length: 15 }, (_, i) => (
                  <button
                    key={i}
                    disabled
                    aria-label={`Question ${i + 1}, ${i < 2 ? "submitted" : "not submitted"}${i === 2 ? ", current question" : ""}`}
                    className={`aspect-square border border-line text-muted rounded-[6px] bg-background text-[11px]! p-0 max-[600px]:aspect-auto max-[600px]:h-[33px] ${i < 2 ? "[&&]:bg-complete [&&]:text-white [&&]:border-complete" : ""} ${i === 2 ? "[&&&]:border-2 [&&&]:border-question-current [&&&]:text-question-current [&&&]:shadow-[0_0_0_2px_color-mix(in_srgb,_var(--current)_9%,_transparent)]" : ""}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>
              <div className="mt-[25px] grid gap-[11px] [&_>_span]:text-[10px] [&_>_span]:text-muted [&_>_span]:flex [&_>_span]:items-center [&_>_span]:gap-2 [&_i]:w-2.5 [&_i]:h-2.5 [&_i]:border [&_i]:border-line [&_i]:rounded-[3px] [&_i]:bg-background max-[600px]:flex max-[600px]:flex-wrap max-[600px]:gap-2.5 max-[600px]:mt-[15px]">
                <span>
                  <i className="[&&]:bg-complete [&&]:border-complete" />
                  Submitted
                </span>
                <span>
                  <i />
                  Not submitted
                </span>
                <span>
                  <i className="[&&]:border-2 [&&]:border-question-current" />
                  Current question
                </span>
              </div>
              <p className="mt-5.5 pt-[17px] border-t border-t-line text-[9px] leading-[1.7] text-muted max-[600px]:mt-3 max-[600px]:pt-2.5">
                Sample states shown for the tour.
              </p>
            </aside>
            <section
              className="pt-7 px-8.5 pb-5 min-w-0 max-[900px]:pt-[25px] max-[900px]:px-[23px] max-[900px]:pb-5 max-[600px]:pt-[23px] max-[600px]:px-[17px] max-[600px]:pb-5"
              aria-label="Sample question"
            >
              <div
                id="tour-question"
                className={`bg-surface rounded-[8px] [&_h2]:mt-[25px] [&_h2]:mx-0 [&_h2]:mb-[27px] [&_h2]:text-[clamp(18px,_2vw,_23px)] [&_h2]:font-medium [&_h2]:leading-[1.6] [&_h2]:tracking-[-.4px] max-[600px]:[&_h2]:text-[18px] max-[600px]:[&_h2]:my-5 max-[600px]:[&_h2]:mx-0 ${spotlight("question")}`}
              >
                <div className="flex items-center justify-between gap-4 [&_>_span:first-child]:text-[9px] [&_>_span:first-child]:tracking-[1px] [&_>_span:first-child]:font-[550] [&_>_span:first-child]:text-accent [&_>_span:last-child]:text-[10px] [&_>_span:last-child]:text-muted max-[600px]:flex-wrap max-[600px]:gap-2.5">
                  <span>QUANTITATIVE REASONING</span>
                  <span>Question 3 of 15</span>
                </div>
                <h2>
                  A number increased by 20% equals 60.
                  <br />
                  What is the original number?
                </h2>
              </div>
              <div
                id="tour-options"
                className={`grid gap-[11px] bg-surface rounded-[8px] ${spotlight("options")}`}
                aria-label="Four sample answer options"
              >
                {["40", "48", "50", "54"].map((value, i) => (
                  <button
                    disabled
                    key={value}
                    className={`flex items-center gap-4 w-full text-left border border-line bg-surface text-foreground py-3 px-4 rounded-[7px] text-[14px]! ${i === 2 ? "[&&]:border-accent [&&]:bg-[color-mix(in_srgb,_var(--accent)_7%,_var(--surface))] [&&]:[&_>_span:first-of-type]:border-accent [&&]:[&_>_span:first-of-type]:text-accent" : ""}`}
                  >
                    <span className="grid place-items-center w-6.5 h-6.5 border border-line rounded-[5px] text-[10px] text-muted">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{value}</span>
                    {i === 2 && (
                      <span className="w-[13px] h-[13px] border-4 border-accent rounded-full ml-auto" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4.5 mt-5.5 mx-0 mb-6.5 [&_>_p]:flex [&_>_p]:items-center [&_>_p]:gap-[7px] [&_>_p]:text-[10px] [&_>_p]:text-muted [&_>_p]:m-0 [&_>_p_svg]:w-3.5 [&_>_p_svg]:h-3.5 [&_>_p_svg]:text-accent max-[900px]:items-start max-[900px]:flex-col">
                <p>
                  <SmallIcon kind="check" />
                  Submitted answers cannot be changed.
                </p>
                <div id="tour-submit" className={spotlight("submit")}>
                  <button
                    disabled
                    className="border border-transparent rounded-[7px] bg-accent text-button-text py-3 px-[17px] inline-flex items-center justify-center gap-[13px] text-[12px]! font-[550]! [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0"
                  >
                    Submit answer
                    <SmallIcon kind="check" />
                  </button>
                </div>
              </div>
              <div
                id="tour-navigation"
                className={`flex items-center justify-between gap-[15px] border-t border-t-line pt-5 bg-surface rounded-[0_0_8px_8px] [&_>_span]:text-muted [&_>_span]:text-[10px] [&_button]:inline-flex [&_button]:items-center [&_button]:gap-[13px] [&_button]:bg-surface [&_button]:border [&_button]:border-line [&_button]:text-foreground [&_button]:py-2.5 [&_button]:px-3.5 [&_button]:rounded-[6px] [&_button]:text-[11px] max-[600px]:gap-2 max-[600px]:[&_>_span]:text-[9px] max-[600px]:[&_button]:p-2.5 max-[600px]:[&_button]:gap-1.5 ${spotlight("navigation")}`}
              >
                <button disabled>← Previous</button>
                <span>3 of 15 questions</span>
                <button disabled>
                  Next
                  <SmallIcon kind="arrow" />
                </button>
              </div>
            </section>
          </div>
        </div>
        <p className="text-center text-[10px] text-muted mt-4.5">
          This is a walkthrough only. The timer and test controls are inactive.
        </p>
      </main>
      <div className="fixed inset-0 bg-overlay z-10" aria-hidden="true" />
      {active && placement && (
        <svg
          className="fixed inset-0 w-screen h-screen pointer-events-none z-14 text-[#d3e3ff] overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="tour-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path
                d="M 1 1 L 9 5 L 1 9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </marker>
          </defs>
          <path
            d={`M ${placement.fromX} ${placement.fromY} L ${placement.toX} ${placement.toY}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            markerEnd="url(#tour-arrow)"
          />
        </svg>
      )}
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-description"
        className={`fixed z-15 w-[min(350px,_calc(100vw_-_32px))] left-4 bottom-4 h-fit max-h-[calc(100dvh_-_32px)] overflow-auto p-[23px] border border-line rounded-[13px] bg-surface text-foreground shadow-[0_20px_65px_#0004] outline-none [&_h2]:text-[20px] [&_h2]:font-[550] [&_h2]:tracking-[-.5px] [&_h2]:leading-[1.3] [&_h2]:mt-4.5 [&_h2]:mx-0 [&_h2]:mb-3 [&_>_p]:text-[12px] [&_>_p]:text-muted [&_>_p]:leading-[1.85] [&_>_p]:m-0 max-[600px]:p-5 ${!active ? "[&&]:left-[50%] [&&]:top-[50%] [&&]:bottom-auto [&&]:-translate-x-1/2 [&&]:-translate-y-1/2 [&&]:w-[min(440px,_calc(100vw_-_32px))] [&&]:p-8 [&&]:text-center [&&]:[&_>_div:first-child]:justify-center [&&]:[&_h2]:text-[27px] [&&]:[&_h2]:mt-5 [&&]:[&_>_p:last-of-type]:text-[10px] [&&]:[&_>_p:last-of-type]:mt-[17px] [&&]:[&_>_p:last-of-type]:mx-0 [&&]:[&_>_p:last-of-type]:mb-5.5 max-[600px]:[&&]:p-[27px]" : ""}`}
        style={
          active
            ? placement
              ? {
                  left: placement.x,
                  top: placement.y,
                  bottom: "auto",
                  width: placement.width,
                }
              : { visibility: "hidden" }
            : undefined
        }
        onKeyDown={(event) => {
          if (event.key === "Escape" && active) goTo(finalStep);
          if (event.key === "Tab") {
            const buttons = panel.current?.querySelectorAll<HTMLElement>(
              "button:not(:disabled), a[href]",
            );
            if (!buttons?.length) return;
            const first = buttons[0],
              last = buttons[buttons.length - 1];
            if (
              event.shiftKey &&
              (document.activeElement === first ||
                document.activeElement === panel.current)
            ) {
              event.preventDefault();
              last.focus();
            } else if (
              !event.shiftKey &&
              (document.activeElement === last ||
                document.activeElement === panel.current)
            ) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <div className="flex justify-between items-center gap-[15px] [&_>_span]:text-[9px] [&_>_span]:tracking-[1.3px] [&_>_span]:text-accent [&_>_span]:font-semibold">
          <span>
            {active ? `STEP ${step + 1} OF ${steps.length}` : "YOU’RE ALL SET"}
          </span>
          {active && (
            <button
              className="py-1 px-0 bg-transparent border-0 text-[10px]! underline underline-offset-3 text-muted"
              onClick={() => goTo(finalStep)}
            >
              Skip walkthrough
            </button>
          )}
        </div>
        {!active && (
          <div className="mt-[23px] mx-auto mb-0 grid place-items-center w-12 h-12 border border-line bg-[color-mix(in_srgb,_var(--accent)_10%,_var(--surface))] text-accent rounded-full">
            <SmallIcon kind="check" />
          </div>
        )}
        <h2 id="tour-title">
          {active ? active.title : "Ready for your starting point?"}
        </h2>
        <p id="tour-description">
          {active
            ? active.text
            : "You’ve seen how it works: 15 questions, 30 minutes, and a clearer view of where to focus your prep."}
        </p>
        {active ? (
          <>
            <div
              className="flex gap-[5px] mt-5 [&_i]:w-[5px] [&_i]:h-[5px] [&_i]:rounded-[10px] [&_i]:bg-line"
              aria-hidden="true"
            >
              {steps.map((_, i) => (
                <i
                  key={i}
                  className={i === step ? "[&&]:w-4.5 [&&]:bg-accent" : ""}
                />
              ))}
            </div>
            <div className="flex justify-between items-center gap-[15px] mt-5.5">
              <button
                className="bg-transparent border-0 text-muted py-2 px-0 text-[12px]! disabled:opacity-40"
                disabled={step === 0}
                onClick={() => goTo(step - 1)}
              >
                Back
              </button>
              <button
                className="border border-transparent rounded-[7px] bg-accent text-button-text py-3 px-[17px] inline-flex items-center justify-center gap-[13px] text-[12px]! font-[550]! [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0"
                onClick={() => goTo(step + 1)}
              >
                {step === steps.length - 1 ? "Finish walkthrough" : "Next step"}
                <SmallIcon kind="arrow" />
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="">
              No signup to begin. An account will be required to view results.
            </p>
            <Link
              href="/diagnostic/test"
              className="border border-transparent rounded-[7px] bg-accent text-button-text py-3 px-[17px] inline-flex items-center justify-center gap-[13px] text-[12px]! font-[550]! [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 w-full"
            >
              Start My Diagnostic
              <SmallIcon kind="arrow" />
            </Link>
            <div className="mt-6 flex justify-center gap-[23px] text-[10px] [&_button]:bg-transparent [&_button]:p-0 [&_button]:border-0 [&_button]:text-accent [&_button]:underline [&_button]:underline-offset-3 [&_a]:text-muted">
              <button onClick={() => goTo(0)}>Replay walkthrough</button>
              <Link href="/">Back to home</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
