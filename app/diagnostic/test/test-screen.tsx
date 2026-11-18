"use client";

import { useRef, useState } from "react";
import { questions, remainingMs, formatTime } from "../attempt";
import { DiagnosticHeader, DiagnosticIcon } from "../ui";
import { DiagnosticModal } from "../modal";
import { useDiagnostic } from "./use-diagnostic";

export function DiagnosticTest() {
  const { attempt, now, storageUnavailable, select, submit, navigate, finish } =
    useDiagnostic();
  const [confirmEnd, setConfirmEnd] = useState(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  if (!attempt)
    return (
      <div className="min-h-svh text-foreground bg-background [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-focus [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-focus [&_button:focus-visible]:outline-offset-4 [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-focus [&_input:focus-visible]:outline-offset-4">
        <DiagnosticHeader label="DIAGNOSTIC" />
        <main
          className="text-center text-muted py-25 px-6 text-[14px]"
          role="status"
        >
          Preparing your diagnostic…
        </main>
      </div>
    );
  const question = questions[attempt.currentIndex];
  const answer = attempt.answers[attempt.currentIndex];
  const locked = answer.submittedAt !== null;
  const submitted = attempt.answers.filter(
    (item) => item.submittedAt !== null,
  ).length;
  const left = remainingMs(attempt, now);
  const ended = attempt.completedAt !== null || left === 0;
  function goTo(index: number) {
    navigate(index);
    questionHeading.current?.focus({ preventScroll: true });
  }

  return (
    <div className="min-h-svh text-foreground bg-background [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-focus [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-focus [&_button:focus-visible]:outline-offset-4 [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-focus [&_input:focus-visible]:outline-offset-4">
      <DiagnosticHeader label="YOUR STARTING POINT" />
      <main className="max-w-330 pt-10 px-10 pb-17.5 m-auto max-[900px]:pt-8 max-[900px]:px-6 max-[900px]:pb-15 max-[600px]:pt-7 max-[600px]:px-4 max-[600px]:pb-10">
        <div className="[&_h1]:text-[clamp(25px,_3vw,_34px)] [&_h1]:font-[550] [&_h1]:tracking-[-1px] [&_h1]:leading-[1.2] [&_h1]:mt-3 [&_h1]:mx-0 [&_h1]:mb-2.5 [&_p]:text-[13px] [&_p]:text-muted [&_p]:mt-0 [&_p]:mx-0 [&_p]:mb-7 [&_p]:leading-[1.7]">
          <span className="text-[9px] tracking-[1.8px] font-semibold text-accent">
            ONE QUESTION AT A TIME
          </span>
          <h1>Make your next move a clear one.</h1>
          <p>
            Choose an answer, submit to lock it in, and move at your own pace.
          </p>
        </div>
        {storageUnavailable && (
          <p
            role="status"
            className="border border-line bg-surface text-muted py-3 px-4 text-[12px] rounded-[7px]"
          >
            Browser storage is unavailable. Keep this tab open to preserve your
            progress.
          </p>
        )}
        <div className="border border-line rounded-[14px] bg-surface shadow-[0_8px_35px_var(--shadow)]">
          <div className="flex items-center gap-7 py-5 px-[25px] border-b border-b-line max-[600px]:p-4 max-[600px]:gap-[13px] max-[600px]:flex-wrap">
            <div className="mr-auto [&_strong]:block [&_strong]:text-[14px] [&_strong]:font-semibold [&_>_span]:block [&_>_span]:mt-[5px] [&_>_span]:text-[10px] [&_>_span]:text-muted max-[600px]:w-full">
              <strong>GMAT Diagnostic</strong>
              <span>15 questions · Practice assessment</span>
            </div>
            <div
              className={`flex items-center gap-3 py-2.5 px-4 border border-line rounded-[8px] bg-background [&_>_svg]:text-accent [&_div_>_span]:block [&_div_>_span]:text-[9px] [&_div_>_span]:text-muted [&_strong]:font-mono [&_strong]:text-[21px] [&_strong]:font-medium [&_strong]:tabular-nums max-[600px]:mr-auto ${left <= 5 * 60 * 1000 ? "[&&]:text-danger [&&]:border-danger [&&]:[&_>_svg]:text-inherit" : ""}`}
              role="timer"
              aria-label={`Time remaining: ${formatTime(left)}`}
            >
              <DiagnosticIcon name="clock" />
              <div>
                <span>Time remaining</span>
                <strong>{formatTime(left)}</strong>
              </div>
            </div>
            <button
              className="inline-flex items-center justify-center border border-danger text-white bg-danger rounded-[7px] text-[11px]! font-[550]! py-3 px-4 cursor-pointer hover:bg-danger-hover"
              onClick={() => setConfirmEnd(true)}
              disabled={ended}
            >
              End Diagnostic
            </button>
          </div>
          <div className="grid grid-cols-[235px_1fr] max-[900px]:grid-cols-[190px_1fr] max-[600px]:flex max-[600px]:flex-col">
            <aside
              className="py-[25px] px-5.5 border-r border-r-line max-[900px]:py-[23px] max-[900px]:px-4 max-[600px]:border-r-0 max-[600px]:border-b max-[600px]:border-b-line max-[600px]:py-5 max-[600px]:px-4"
              aria-label="Question navigation"
            >
              <div className="[&_h2]:text-[13px] [&_h2]:font-semibold [&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-1.5 [&_>_span]:text-muted [&_>_span]:text-[10px] max-[600px]:flex max-[600px]:justify-between max-[600px]:items-center">
                <h2>Questions</h2>
                <span>{submitted} / 15 submitted</span>
              </div>
              <div
                className="h-[3px] bg-line mt-[15px] rounded-[3px] overflow-hidden [&_span]:block [&_span]:h-full [&_span]:bg-complete [&_span]:transition-[width] [&_span]:duration-200"
                aria-hidden="true"
              >
                <span
                  style={{ width: `${(submitted / questions.length) * 100}%` }}
                />
              </div>
              <div className="grid grid-cols-5 gap-2 mt-5.5 max-[900px]:grid-cols-3 max-[600px]:grid-cols-5 max-[600px]:gap-2 max-[600px]:mt-[15px]">
                {attempt.answers.map((item, i) => (
                  <button
                    key={item.questionId}
                    data-submitted={item.submittedAt !== null}
                    disabled={ended}
                    aria-label={`Question ${i + 1}, ${item.submittedAt !== null ? "submitted" : "not submitted"}`}
                    aria-current={
                      attempt.currentIndex === i ? "step" : undefined
                    }
                    onClick={() => goTo(i)}
                    className={`aspect-square border border-line bg-background text-muted rounded-[6px] p-0 text-[11px]! hover:border-accent max-[600px]:h-9 max-[600px]:aspect-auto ${item.submittedAt !== null ? "[&&]:text-white [&&]:border-complete [&&]:bg-complete" : ""} ${i === attempt.currentIndex ? "[&&&]:border-2 [&&&]:border-question-current [&&&]:shadow-[0_0_0_2px_color-mix(in_srgb,_var(--current)_15%,_transparent)] [&&&]:text-question-current data-[submitted=true]:text-white!" : ""}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>
              <div className="grid gap-[11px] mt-6.5 [&_>_span]:flex [&_>_span]:gap-2 [&_>_span]:items-center [&_>_span]:text-muted [&_>_span]:text-[10px] [&_i]:w-2.5 [&_i]:h-2.5 [&_i]:border [&_i]:border-line [&_i]:bg-background [&_i]:rounded-[3px] max-[600px]:flex max-[600px]:flex-wrap max-[600px]:gap-3 max-[600px]:mt-[17px]">
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
              <div className="flex items-start gap-2 border-t border-t-line mt-[25px] pt-[17px] text-muted [&_svg]:shrink-0 [&_svg]:w-[13px] [&_svg]:h-[13px] [&_svg]:mt-[3px] [&_p]:text-[10px] [&_p]:leading-[1.8] [&_p]:m-0 max-[600px]:hidden">
                <DiagnosticIcon name="lock" />
                <p>
                  Once submitted, an answer is final. You can revisit it at any
                  time.
                </p>
              </div>
            </aside>
            <section
              className="pt-7.5 px-8.5 pb-5.5 min-w-0 max-[900px]:pt-6.5 max-[900px]:px-[23px] max-[900px]:pb-5.5 max-[600px]:py-[23px] max-[600px]:px-[17px]"
              aria-labelledby="question-title"
            >
              <div className="flex items-center justify-between gap-[15px] [&_>_span:first-child]:text-[9px] [&_>_span:first-child]:tracking-[1px] [&_>_span:first-child]:text-accent [&_>_span:first-child]:font-[550] [&_>_span:last-child]:text-muted [&_>_span:last-child]:text-[10px] [&_>_span:last-child]:whitespace-nowrap max-[600px]:flex-wrap">
                <span>{question.section.toUpperCase()}</span>
                <span>
                  Question {attempt.currentIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted mt-2.5 [&_>_span]:opacity-50">
                {question.type}
                <span>•</span>
                {question.topic}
              </div>
              {question.passage && (
                <div className="whitespace-pre-line bg-background border border-line rounded-[8px] py-4.5 px-5 mt-5.5 text-[13px] leading-[1.9]">
                  {question.passage}
                </div>
              )}
              <h2
                id="question-title"
                ref={questionHeading}
                tabIndex={-1}
                className="my-[27px] mx-0 text-[clamp(18px,_2vw,_23px)] font-medium leading-[1.65] tracking-[-.4px] outline-none"
              >
                {question.prompt}
              </h2>
              <fieldset
                className="grid gap-[11px] border-0 m-0 p-0 min-w-0"
                disabled={locked || ended}
              >
                <legend className="sr-only">Select one answer</legend>
                {question.options.map((option) => (
                  <label
                    key={`${question.id}-${option.id}`}
                    className={`flex items-center gap-[15px] border border-line py-3 px-4 rounded-[7px] text-[14px] cursor-pointer hover:border-accent [&_input]:absolute [&_input]:w-px [&_input]:h-px [&_input]:opacity-0 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-focus has-[:focus-visible]:outline-offset-[3px] ${answer.selectedOptionId === option.id ? "[&&]:border-accent [&&]:bg-[color-mix(in_srgb,_var(--accent)_7%,_var(--surface))] [&&]:[&_>_span:first-of-type]:border-accent [&&]:[&_>_span:first-of-type]:text-accent [&&]:[&_>_span:last-child]:border-4 [&&]:[&_>_span:last-child]:border-accent" : ""} ${locked ? "[&&]:cursor-default" : ""}`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={answer.selectedOptionId === option.id}
                      onChange={() => select(option.id)}
                    />
                    <span className="w-6.5 h-6.5 shrink-0 border border-line rounded-[5px] text-[10px] text-muted grid place-items-center">
                      {option.id}
                    </span>
                    <span className="leading-[1.7]">{option.text}</span>
                    <span
                      className="w-[13px] h-[13px] shrink-0 border border-line rounded-full ml-auto"
                      aria-hidden="true"
                    />
                  </label>
                ))}
              </fieldset>
              <div className="flex items-center justify-between gap-4.5 mt-6 mx-0 mb-7 [&_>_p]:flex [&_>_p]:gap-[7px] [&_>_p]:items-center [&_>_p]:text-[10px] [&_>_p]:text-muted [&_>_p]:m-0 [&_svg]:shrink-0 [&_svg]:w-3.5 [&_svg]:h-3.5 max-[900px]:items-start max-[900px]:flex-col">
                <p role="status">
                  <DiagnosticIcon name={locked ? "lock" : "check"} />
                  {locked
                    ? "Answer submitted. Your selection is locked."
                    : "You can change your selection before submitting."}
                </p>
                <button
                  className="inline-flex items-center justify-center gap-[13px] bg-accent text-button-text border border-transparent py-3 px-[17px] rounded-[7px] text-[12px]! font-[550]! no-underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0"
                  onClick={submit}
                  disabled={!answer.selectedOptionId || locked || ended}
                >
                  {locked ? "Submitted" : "Submit answer"}
                  <DiagnosticIcon name="check" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-3.5 pt-[21px] border-t border-t-line [&_>_span]:text-[10px] [&_>_span]:text-muted max-[600px]:gap-2 max-[600px]:[&_>_span]:text-[9px]">
                <button
                  className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
                  disabled={attempt.currentIndex === 0 || ended}
                  onClick={() => goTo(attempt.currentIndex - 1)}
                >
                  ← Previous
                </button>
                <span>
                  {attempt.currentIndex + 1} of {questions.length} questions
                </span>
                {attempt.currentIndex < questions.length - 1 ? (
                  <button
                    className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
                    disabled={ended}
                    onClick={() => goTo(attempt.currentIndex + 1)}
                  >
                    Next
                    <DiagnosticIcon name="arrow" />
                  </button>
                ) : (
                  <button
                    className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
                    disabled={ended}
                    onClick={() => setConfirmEnd(true)}
                  >
                    Finish
                    <DiagnosticIcon name="check" />
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
      {confirmEnd && !ended && (
        <DiagnosticModal
          titleId="end-title"
          descriptionId="end-description"
          onClose={() => setConfirmEnd(false)}
        >
          <span className="grid place-items-center w-11 h-11 bg-[color-mix(in_srgb,_var(--accent)_10%,_var(--surface))] border border-line rounded-[12px] text-accent">
            <DiagnosticIcon name="check" />
          </span>
          <h2 id="end-title">Ready to finish?</h2>
          <p id="end-description">
            You’ve submitted {submitted} of {questions.length} answers.{" "}
            {submitted < questions.length
              ? `${questions.length - submitted} questions remain unsubmitted. Selected answers that haven’t been submitted won’t count.`
              : "All your answers are locked in."}
          </p>
          <p>Once you end the diagnostic, you won’t be able to return to it.</p>
          <div className="flex justify-end gap-3 mt-6.5">
            <button
              className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
              onClick={() => setConfirmEnd(false)}
            >
              Keep going
            </button>
            <button
              className="inline-flex items-center justify-center border border-danger text-white bg-danger rounded-[7px] text-[11px]! font-[550]! py-3 px-4 cursor-pointer hover:bg-danger-hover"
              onClick={finish}
            >
              End Diagnostic
            </button>
          </div>
        </DiagnosticModal>
      )}
    </div>
  );
}
