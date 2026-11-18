"use client";

import Link from "next/link";
import { questions, formatTime, type Attempt } from "../attempt";
import { DiagnosticHeader, DiagnosticIcon } from "../ui";
import { summarize } from "./summary";

export default function UnlockedResults({
  attempt,
  name,
}: {
  attempt: Attempt;
  name: string;
}) {
  const summary = summarize(attempt);
  return (
    <div className="min-h-svh text-foreground bg-background [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-focus [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-focus [&_button:focus-visible]:outline-offset-4 [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-focus [&_input:focus-visible]:outline-offset-4">
      <DiagnosticHeader label="YOUR DIAGNOSTIC RESULTS" />
      <main className="max-w-260 m-auto pt-[65px] px-[35px] pb-17.5 [&_h1]:mt-4 [&_h1]:mx-0 [&_h1]:mb-3.5 [&_h1]:text-[clamp(30px,_4vw,_45px)] [&_h1]:font-medium [&_h1]:leading-[1.2] [&_h1]:tracking-[-1.5px] [&_>_p]:text-[13px] [&_>_p]:text-muted [&_>_p]:leading-[1.9] max-[650px]:py-9 max-[650px]:px-5">
        <span className="text-[9px] tracking-[1.8px] font-semibold text-accent">
          YOUR STARTING POINT
        </span>
        <h1>
          {name
            ? `${name}, here’s your starting point.`
            : "Here’s your starting point."}
        </h1>
        <p>
          A first look at your answers, with room to learn more. These{" "}
          {questions.length} questions are an initial screening, not a complete
          skill diagnosis.
        </p>
        <div className="grid grid-cols-3 gap-4.5 mt-[35px] [&_>_div]:bg-surface [&_>_div]:border [&_>_div]:border-line [&_>_div]:rounded-[12px] [&_>_div]:p-[25px] [&_span]:block [&_span]:text-[11px] [&_span]:text-muted [&_strong]:block [&_strong]:mt-4.5 [&_strong]:mx-0 [&_strong]:mb-3 [&_strong]:text-[42px] [&_strong]:tabular-nums [&_strong]:tracking-[-2px] [&_strong]:font-[550] [&_span:last-child]:text-[10px] max-[650px]:gap-2.5 max-[650px]:[&_>_div]:py-[17px] max-[650px]:[&_>_div]:px-3 max-[650px]:[&_strong]:text-[28px] max-[650px]:[&_strong]:tracking-[-1px] max-[650px]:[&_span]:text-[10px] max-[650px]:[&_span:last-child]:text-[8px]">
          <div>
            <span>Correct answers</span>
            <strong>
              {summary.correct} / {summary.total}
            </strong>
            <span>
              {summary.submitted} submitted · {summary.unanswered} unsubmitted
            </span>
          </div>
          <div>
            <span>Observed accuracy</span>
            <strong>
              {Math.round((summary.correct / summary.total) * 100)}%
            </strong>
            <span>
              Across all {summary.total} questions, including unsubmitted
            </span>
          </div>
          <div>
            <span>Time taken</span>
            <strong>{formatTime(summary.elapsedMs)}</strong>
            <span>Of 30 minutes available</span>
          </div>
        </div>

        <section
          className="bg-surface border border-line rounded-[12px] p-7 mt-[25px] [&_h2]:text-[19px] [&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-7 [&_h2]:font-[550] [&_h2]:tracking-[-.5px] [&_h2]:mb-3.5 max-[650px]:py-[23px] max-[650px]:px-[19px]"
          aria-labelledby="observed-title"
        >
          <span className="block text-accent text-[10px] font-semibold tracking-[1.3px] mb-3">
            OBSERVED PERFORMANCE · YOUR ANSWERS
          </span>
          <h2 id="observed-title">What this diagnostic measured</h2>
          <p className="text-muted text-[13px] leading-[1.8] mt-0 mx-0 mb-6">
            Section totals describe this attempt. Expand each section for topic
            results and evidence counts; a single answer cannot establish a
            skill level.
          </p>
          {summary.sections.map((item) => (
            <div
              className="[&:not(:first-child)]:mt-6.5 [&_>_div:first-child]:flex [&_>_div:first-child]:justify-between [&_>_div:first-child]:gap-[15px] [&_>_div:first-child]:text-[12px] [&_strong]:font-medium [&_strong]:text-accent [&_p]:text-[10px] [&_p]:text-muted [&_p]:m-0 [&_p]:leading-[1.8]"
              key={item.section}
            >
              <div>
                <span>{item.section}</span>
                <strong>
                  {item.correct} / {item.total} correct
                </strong>
              </div>
              <div
                className="h-[7px] bg-line rounded-[7px] my-3 mx-0 overflow-hidden [&_>_span]:block [&_>_span]:bg-accent [&_>_span]:h-full [&_>_span]:rounded-[inherit]"
                aria-hidden="true"
              >
                <span
                  style={{ width: `${(item.correct / item.total) * 100}%` }}
                />
              </div>
              <p>
                {item.submitted} answered · {item.incorrect} incorrect ·{" "}
                {item.unanswered} unsubmitted · {item.total} questions available
              </p>
              <details className="[&_summary:focus-visible]:outline-2 [&_summary:focus-visible]:outline-accent [&_summary:focus-visible]:outline-offset-4 mt-3 text-[12px] [&_summary]:cursor-pointer [&_summary]:text-foreground [&_summary]:py-1.5 [&_summary]:px-0 [&_ul]:list-none [&_ul]:p-0 [&_ul]:mt-3 [&_ul]:mx-0 [&_ul]:mb-0 [&_li]:border-t [&_li]:border-t-line [&_li]:py-[15px] [&_li]:px-0 [&_li_>_div]:flex [&_li_>_div]:justify-between [&_li_>_div]:gap-3 [&_li_>_div]:flex-wrap [&_li_>_div]:mb-[9px] [&_li_strong]:text-foreground [&_li_>_div_>_span]:text-muted [&_li_p]:text-[12px] [&_li_p]:mt-2">
                <summary>View topic evidence</summary>
                <ul>
                  {item.skills.map((skill) => (
                    <li key={skill.topic}>
                      <div>
                        <strong>{skill.topic}</strong>
                        <span>
                          {skill.correct} / {skill.total} correct ·{" "}
                          {skill.submitted} answered
                        </span>
                      </div>
                      <span className="inline-block text-[10px] leading-[1.5] py-1 px-2 border border-line rounded-[5px] text-muted bg-background">
                        Insufficient evidence
                      </span>
                      <p>
                        {skill.submitted === 0
                          ? "No submitted answer to assess this topic."
                          : `Only ${skill.submitted} question assessed this topic. More varied questions are needed before identifying a strength or weakness.`}
                      </p>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </section>

        <section
          className="bg-surface border border-line rounded-[12px] p-7 mt-[25px] [&_h2]:text-[19px] [&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-7 [&_h2]:font-[550] [&_h2]:tracking-[-.5px] [&_h2]:mb-3.5 max-[650px]:py-[23px] max-[650px]:px-[19px] [&&]:border-t-3 [&&]:border-t-accent"
          aria-labelledby="interpretation-title"
        >
          <span className="block text-accent text-[10px] font-semibold tracking-[1.3px] mb-3">
            INTERPRETATION · RULES-BASED PREVIEW
          </span>
          <h2 id="interpretation-title">Where to go next</h2>
          <p className="text-muted text-[13px] leading-[1.8] mt-0 mx-0 mb-6">
            No topic weakness can be identified reliably from this question set.
            These suggestions use your submitted answers, not an AI diagnosis.
            AI analysis is not connected yet.
          </p>
          <div className="grid gap-4">
            {summary.sections.map((item) => (
              <article
                className="border border-line bg-background rounded-[9px] p-5 [&_h3]:text-[16px] [&_h3]:font-[550] [&_h3]:my-3 [&_h3]:mx-0 [&_p]:text-muted [&_p]:text-[13px] [&_p]:leading-[1.8] [&_p]:mb-4.5 [&_p_strong]:text-foreground [&_p_strong]:font-medium"
                key={item.section}
              >
                <span className="inline-block text-[10px] leading-[1.5] py-1 px-2 border border-line rounded-[5px] text-muted bg-background">
                  {item.incorrect
                    ? "Review opportunity"
                    : "Build more evidence"}
                </span>
                <h3>{item.section}</h3>
                <p>
                  <strong>Why this is suggested: </strong>
                  {item.incorrect > 0
                    ? `You answered ${item.incorrect} of ${item.submitted} submitted questions incorrectly. Reviewing this section may help you understand those misses; it does not establish a topic weakness.`
                    : item.unanswered > 0
                      ? `${item.unanswered} of ${item.total} questions were unsubmitted. Try this section at your own pace; unanswered items do not establish a weakness.`
                      : `You answered all ${item.total} questions correctly. That is encouraging for these items, but one question per topic cannot establish mastery.`}
                </p>
                <Link
                  className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
                  href={`/diagnostic/practice?section=${encodeURIComponent(item.section)}`}
                >
                  Begin practice review
                  <DiagnosticIcon name="arrow" />
                </Link>
              </article>
            ))}
          </div>
          <p className="text-[11px]! my-[25px] mx-0">
            For now, practice reuses the five diagnostic questions in each
            section. It supports review; repeated answers do not provide new
            diagnostic evidence.
          </p>
        </section>
        <p className="text-[11px]! my-[25px] mx-0"></p>
        <Link
          className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
          href="/"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
