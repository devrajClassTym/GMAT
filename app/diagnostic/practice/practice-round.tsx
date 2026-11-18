"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatTime } from "../attempt";
import answerKey from "../data/answer-key.json";
import { DiagnosticIcon } from "../ui";
import { DiagnosticModal } from "../modal";
import { saveSession } from "../../dashboard/session-storage";
import { guardExamExit } from "../../exam/exit-guard";
import { advanceClock, submitResponse, type Round } from "./practice-engine";

const keys: Record<string, string> = answerKey;

export function PracticeRound({
  initial,
  onReset,
  mode = "practice",
}: {
  initial: Round;
  onReset: () => void;
  mode?: "practice" | "exam";
}) {
  const isExam = mode === "exam";
  const sessionLabel = isExam ? "Exam" : "Practice";
  const [round, setRound] = useState(initial);
  const live = useRef(initial);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [mentor, setMentor] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);

  const update = useCallback(
    (next: Round) => {
      if (next === live.current) return;
      if (next.completedAt !== null && live.current.completedAt === null) {
        const sections = [
          ...new Set(next.items.map((question) => question.section)),
        ];
        const historySaved = saveSession({
          id: next.id,
          kind: isExam ? "exam" : "practice",
          section: sections.length === 1 ? sections[0] : "Mixed topics",
          completedAt: next.completedAt,
          answered: next.responses.filter(
            (response) => response.status === "submitted",
          ).length,
          total: next.items.length,
          correct: next.responses.filter(
            (response) => response.submitted === keys[response.questionId],
          ).length,
          timing: next.settings.timing,
          timeLimitSeconds:
            next.settings.timing === "untimed"
              ? undefined
              : next.settings.seconds,
          topics: next.settings.topics,
          responses: next.responses,
        });
        setStorageUnavailable(!historySaved);
      }
      if (next.index !== live.current.index || next.completedAt !== null)
        setMentor(false);
      live.current = next;
      setRound(next);
    },
    [isExam],
  );

  useEffect(() => {
    if (isExam && round.completedAt === null) return guardExamExit();
  }, [isExam, round.completedAt]);

  useEffect(() => {
    function tick() {
      update(advanceClock(live.current, Date.now()));
    }
    const interval = window.setInterval(tick, 250);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [update]);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [round.index, round.completedAt]);

  const question = round.items[round.index];
  const response = round.responses[round.index];
  const locked = response.status !== "open";
  const submitted = round.responses.filter(
    (item) => item.status === "submitted",
  ).length;
  const correct = round.responses.filter(
    (item) => item.submitted === keys[item.questionId],
  ).length;
  const sequential = isExam || round.settings.timing === "question";
  const left =
    round.settings.timing === "round"
      ? Math.max(
          0,
          round.startedAt + round.settings.seconds * 1000 - round.checkpointAt,
        )
      : Math.max(0, round.settings.seconds * 1000 - response.responseTimeMs);
  const navigate = useCallback(
    (index: number) => {
      const next = advanceClock(live.current, Date.now());
      if (next.completedAt !== null || next.index !== round.index) {
        update(next);
        return;
      }
      if (
        index < 0 ||
        index >= next.items.length ||
        (sequential &&
          (index !== next.index + 1 ||
            next.responses[next.index].status === "open"))
      )
        return;
      update({ ...next, index });
    },
    [round.index, sequential, update],
  );
  const select = useCallback(
    (option: string) => {
      const next = advanceClock(live.current, Date.now());
      if (
        next.completedAt !== null ||
        next.index !== round.index ||
        next.responses[next.index].status !== "open"
      ) {
        update(next);
        return;
      }
      update({
        ...next,
        responses: next.responses.map((item, index) =>
          index === next.index ? { ...item, selected: option } : item,
        ),
      });
    },
    [round.index, update],
  );

  if (round.completedAt !== null)
    return (
      <div className="min-h-svh text-foreground bg-background [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-focus [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-focus [&_button:focus-visible]:outline-offset-4 [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-focus [&_input:focus-visible]:outline-offset-4 [&&]:bg-surface">
        <main className="w-full max-w-290 my-0 mx-auto py-9 px-8 max-[700px]:py-6 max-[700px]:px-4">
          <header className="flex items-center justify-between gap-6 mb-6.5 [&_h1]:text-[clamp(25px,_3vw,_34px)] [&_h1]:font-semibold [&_h1]:tracking-[-1px] [&_h1]:my-1.5 [&_h1]:mx-0 [&_p]:text-[12px] [&_p]:text-muted [&_p]:m-0 [&_p]:leading-[1.6] max-[700px]:items-start max-[700px]:flex-col max-[700px]:gap-4">
            <div>
              <span className="text-[9px] tracking-[1.8px] font-semibold text-accent">
                {isExam ? "EXAM RESULTS" : "YOUR ROUND, REVIEWED"}
              </span>
              <h1 ref={heading} tabIndex={-1}>
                {round.reason === "timeout"
                  ? "Time’s up."
                  : `${sessionLabel} complete.`}
              </h1>
              <p>
                {round.reason === "stopped"
                  ? `You ended this ${isExam ? "exam" : "round"}.`
                  : round.settings.length === "unlimited"
                    ? "You’ve reached the end of the selected content."
                    : isExam
                      ? "Your exam has been submitted."
                      : "One more round in the books."}{" "}
                Review your answers below.
              </p>
            </div>
            <div className="flex gap-2.5 shrink-0">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
              >
                Dashboard
              </Link>
              <button
                className="inline-flex items-center justify-center gap-[13px] bg-accent text-button-text border border-transparent py-3 px-[17px] rounded-[7px] text-[12px]! font-[550]! no-underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0"
                onClick={onReset}
              >
                {isExam ? "New exam" : "Practice again"}
                <DiagnosticIcon name="arrow" />
              </button>
            </div>
          </header>
          <section
            className="grid grid-cols-4 border border-line rounded-[12px] mb-7 overflow-hidden [&_>_div]:p-5 [&_>_div]:border-r [&_>_div]:border-r-line [&_>_div:last-child]:border-r-0 [&_>_div:first-child]:bg-[color-mix(in_srgb,_var(--accent)_5%,_var(--surface))] [&_span]:block [&_span]:text-muted [&_span]:text-[11px] [&_span]:mb-2 [&_strong]:text-[28px] [&_strong]:font-semibold [&_strong]:tabular-nums [&_strong]:tracking-[-1px] [&_small]:text-[16px] [&_small]:font-normal [&_small]:text-muted max-[700px]:grid-cols-2 max-[700px]:[&_>_div]:p-4 max-[700px]:[&_>_div:nth-child(2)]:border-r-0 max-[700px]:[&_>_div:nth-child(-n+2)]:border-b max-[700px]:[&_>_div:nth-child(-n+2)]:border-b-line"
            aria-label="Round summary"
          >
            <div>
              <span>Correct answers</span>
              <strong>
                {correct}
                <small> / {round.items.length}</small>
              </strong>
            </div>
            <div>
              <span>Accuracy · answered questions</span>
              <strong>
                {submitted
                  ? `${Math.round((correct / submitted) * 100)}%`
                  : "—"}
              </strong>
            </div>
            <div>
              <span>Questions answered</span>
              <strong>
                {submitted}
                <small> / {round.items.length}</small>
              </strong>
            </div>
            <div>
              <span>Total round time</span>
              <strong>{formatTime(round.completedAt - round.startedAt)}</strong>
            </div>
          </section>
          {storageUnavailable && (
            <p
              className="border border-line bg-surface text-muted py-3 px-4 text-[12px] rounded-[7px]"
              role="status"
            >
              Browser storage is unavailable. Your record may be lost on reload.
            </p>
          )}
          <section aria-labelledby="review-title">
            <div className="flex justify-between items-center gap-3 mb-3 [&_h2]:text-[15px] [&_h2]:font-semibold [&_>_span]:text-muted [&_>_span]:text-[11px] max-[700px]:items-start max-[700px]:flex-col max-[700px]:gap-1">
              <h2 id="review-title">Question review</h2>
              <span>Select a question to see its answers</span>
            </div>
            <div className="border border-line rounded-[12px] overflow-hidden">
              {round.items.map((item, index) => {
                const result = round.responses[index];
                const isCorrect = result.submitted === keys[item.id];
                const status =
                  result.status === "timeout"
                    ? "Timed out"
                    : result.submitted
                      ? isCorrect
                        ? "Correct"
                        : "Incorrect"
                      : "Not answered";
                return (
                  <details
                    key={item.id}
                    className="[&:not(:first-child)]:border-t [&:not(:first-child)]:border-t-line [&_summary]:flex [&_summary]:items-center [&_summary]:gap-4 [&_summary]:py-3.5 [&_summary]:px-4.5 [&_summary]:cursor-pointer [&_summary]:list-none [&_summary::-webkit-details-marker]:hidden [&_summary:hover]:bg-[color-mix(in_srgb,_var(--foreground)_3%,_var(--surface))] [&_summary:focus-visible]:outline-2 [&_summary:focus-visible]:outline-focus [&_summary:focus-visible]:outline-offset-[-3px] [&&]:[&[open]_>_summary_>_span:last-child]:rotate-45 max-[700px]:[&_summary]:gap-2.5 max-[700px]:[&_summary]:p-3"
                  >
                    <summary>
                      <span className="text-muted text-[11px] tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 min-w-0 [&_strong]:block [&_strong]:text-[12px] [&_strong]:font-[550] [&_small]:block [&_small]:text-muted [&_small]:text-[10px] [&_small]:mt-[3px]">
                        <strong>{item.topic}</strong>
                        <small>{item.section}</small>
                      </span>
                      <span
                        className={`rounded-[20px] py-[5px] px-[9px] text-[10px] text-muted bg-background whitespace-nowrap ${isCorrect ? "[&&]:text-foreground [&&]:bg-[color-mix(in_srgb,_var(--foreground)_9%,_var(--surface))]" : result.submitted ? "[&&]:text-accent [&&]:bg-[color-mix(in_srgb,_var(--accent)_9%,_var(--surface))]" : ""}`}
                      >
                        {status}
                      </span>
                      <span className="text-muted text-[11px] tabular-nums max-[700px]:hidden">
                        {formatTime(result.responseTimeMs)}
                      </span>
                      <span
                        className="text-muted text-[18px]"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </summary>
                    <div className="pt-1 pr-4.5 pb-4.5 pl-12 [&_h3]:text-[13px] [&_h3]:font-medium [&_h3]:leading-[1.7] [&_h3]:mb-3.5 max-[700px]:pt-1.5 max-[700px]:px-3.5 max-[700px]:pb-4">
                      {item.passage && (
                        <p className="whitespace-pre-line text-[12px] leading-[1.8] text-muted mt-2 mx-0 mb-4">
                          {item.passage}
                        </p>
                      )}
                      <h3>{item.prompt}</h3>
                      <div className="grid grid-cols-2 gap-4 [&_>_div]:border-l-2 [&_>_div]:border-l-line [&_>_div]:pl-3 [&_>_div:last-child]:border-accent [&_span]:text-[10px] [&_span]:text-muted [&_p]:text-[12px] [&_p]:leading-[1.7] [&_p]:mt-1 max-[700px]:grid-cols-1">
                        <div>
                          <span>Your answer</span>
                          <p>
                            {result.submitted
                              ? `${result.submitted}. ${item.options.find((option) => option.id === result.submitted)?.text}`
                              : status}
                          </p>
                        </div>
                        <div>
                          <span>Correct answer</span>
                          <p>
                            {keys[item.id]}.{" "}
                            {
                              item.options.find(
                                (option) => option.id === keys[item.id],
                              )?.text
                            }
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted mt-3">
                        Response time: {formatTime(result.responseTimeMs)}
                      </p>
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    );

  return (
    <div className="min-h-svh text-foreground bg-background [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-focus [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-focus [&_button:focus-visible]:outline-offset-4 [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-focus [&_input:focus-visible]:outline-offset-4 [&&]:flex [&&]:flex-col [&&]:min-h-dvh [&&]:p-6 max-[600px]:[&&]:p-3">
      <main className="w-full max-w-310 m-auto">
        {storageUnavailable && (
          <p
            className="border border-line bg-surface text-muted py-3 px-4 text-[12px] rounded-[7px]"
            role="status"
          >
            Browser storage is unavailable. Keep this tab open to preserve your
            exam.
          </p>
        )}
        <div className="border border-line rounded-[14px] bg-surface shadow-[0_8px_35px_var(--shadow)]">
          <div className="flex items-center gap-7 py-5 px-[25px] border-b border-b-line max-[600px]:p-4 max-[600px]:gap-[13px] max-[600px]:flex-wrap">
            <div className="mr-auto [&_strong]:block [&_strong]:text-[14px] [&_strong]:font-semibold [&_>_span]:block [&_>_span]:mt-[5px] [&_>_span]:text-[10px] [&_>_span]:text-muted max-[600px]:w-full">
              <strong>
                GMAT {sessionLabel}
                {isExam ? " Mode" : ""}
              </strong>
              <span>
                {round.settings.length === "unlimited"
                  ? "Unlimited"
                  : `${round.items.length} questions`}{" "}
                ·{" "}
                {isExam
                  ? "30 minutes · All sections"
                  : `${round.items.length} available`}
              </span>
            </div>
            <div
              className={`flex items-center gap-3 py-2.5 px-4 border border-line rounded-[8px] bg-background [&_>_svg]:text-accent [&_div_>_span]:block [&_div_>_span]:text-[9px] [&_div_>_span]:text-muted [&_strong]:font-mono [&_strong]:text-[21px] [&_strong]:font-medium [&_strong]:tabular-nums max-[600px]:mr-auto ${round.settings.timing !== "untimed" && left <= (isExam ? 300000 : 30000) ? "[&&]:text-danger [&&]:border-danger [&&]:[&_>_svg]:text-inherit" : ""}`}
              role="timer"
            >
              <DiagnosticIcon name="clock" />
              <div>
                <span>
                  {round.settings.timing === "untimed"
                    ? "Time elapsed"
                    : round.settings.timing === "question"
                      ? "Question time remaining"
                      : isExam
                        ? "Exam time remaining"
                        : "Round time remaining"}
                </span>
                <strong>
                  {formatTime(
                    round.settings.timing === "untimed"
                      ? round.checkpointAt - round.startedAt
                      : left,
                  )}
                </strong>
              </div>
            </div>
            <button
              className="inline-flex items-center justify-center border border-danger text-white bg-danger rounded-[7px] text-[11px]! font-[550]! py-3 px-4 cursor-pointer hover:bg-danger-hover"
              onClick={() => setConfirmEnd(true)}
            >
              End {sessionLabel}
            </button>
          </div>
          <div className="grid grid-cols-[235px_1fr] max-[900px]:grid-cols-[190px_1fr] max-[600px]:flex max-[600px]:flex-col">
            <aside
              className="py-[25px] px-5.5 border-r border-r-line max-[900px]:py-[23px] max-[900px]:px-4 max-[600px]:border-r-0 max-[600px]:border-b max-[600px]:border-b-line max-[600px]:py-5 max-[600px]:px-4"
              aria-label="Question navigation"
            >
              <div className="[&_h2]:text-[13px] [&_h2]:font-semibold [&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-1.5 [&_>_span]:text-muted [&_>_span]:text-[10px] max-[600px]:flex max-[600px]:justify-between max-[600px]:items-center">
                <h2>Questions</h2>
                <span>
                  {submitted} / {round.items.length} submitted
                </span>
              </div>
              <div
                className="h-[3px] bg-line mt-[15px] rounded-[3px] overflow-hidden [&_span]:block [&_span]:h-full [&_span]:bg-complete [&_span]:transition-[width] [&_span]:duration-200"
                aria-hidden="true"
              >
                <span
                  style={{
                    width: `${(submitted / round.items.length) * 100}%`,
                  }}
                />
              </div>
              <div className="grid grid-cols-5 gap-2 mt-5.5 max-[900px]:grid-cols-3 max-[600px]:grid-cols-5 max-[600px]:gap-2 max-[600px]:mt-[15px]">
                {round.responses.map((item, index) => (
                  <button
                    key={item.questionId}
                    data-submitted={item.status === "submitted"}
                    disabled={sequential}
                    onClick={() => navigate(index)}
                    aria-label={`Question ${index + 1}, ${item.status}`}
                    aria-current={index === round.index ? "step" : undefined}
                    className={`aspect-square border border-line bg-background text-muted rounded-[6px] p-0 text-[11px]! hover:border-accent max-[600px]:h-9 max-[600px]:aspect-auto ${item.status === "submitted" ? "[&&]:text-white [&&]:border-complete [&&]:bg-complete" : ""} ${item.status === "timeout" ? "[&&]:border-danger [&&]:line-through [&&]:text-danger" : ""} ${index === round.index ? "[&&&]:border-2 [&&&]:border-question-current [&&&]:shadow-[0_0_0_2px_color-mix(in_srgb,_var(--current)_15%,_transparent)] [&&&]:text-question-current data-[submitted=true]:text-white!" : ""}`}
                  >
                    {index + 1}
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
                {round.settings.timing === "question" && (
                  <span>Strikethrough: timed out</span>
                )}
              </div>
              <div className="flex items-start gap-2 border-t border-t-line mt-[25px] pt-[17px] text-muted [&_svg]:shrink-0 [&_svg]:w-[13px] [&_svg]:h-[13px] [&_svg]:mt-[3px] [&_p]:text-[10px] [&_p]:leading-[1.8] [&_p]:m-0 max-[600px]:hidden">
                <DiagnosticIcon name="lock" />
                <p>
                  {isExam
                    ? "Work in order. Submitted answers are final. The exam ends automatically when the timer reaches zero."
                    : sequential
                      ? "Per-question timing uses a fixed order. Each question gets its own time allowance."
                      : "Once submitted, an answer is final. You can revisit it at any time."}
                </p>
              </div>
            </aside>
            <section
              className="pt-7.5 px-8.5 pb-5.5 min-w-0 max-[900px]:pt-6.5 max-[900px]:px-[23px] max-[900px]:pb-5.5 max-[600px]:py-[23px] max-[600px]:px-[17px]"
              aria-labelledby="practice-question"
            >
              <div className="flex items-center justify-between gap-[15px] [&_>_span:first-child]:text-[9px] [&_>_span:first-child]:tracking-[1px] [&_>_span:first-child]:text-accent [&_>_span:first-child]:font-[550] [&_>_span:last-child]:text-muted [&_>_span:last-child]:text-[10px] [&_>_span:last-child]:whitespace-nowrap max-[600px]:flex-wrap">
                <span>{question.section.toUpperCase()}</span>
                <span>
                  Question {round.index + 1} of {round.items.length}
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
                className="my-[27px] mx-0 text-[clamp(18px,_2vw,_23px)] font-medium leading-[1.65] tracking-[-.4px] outline-none"
                id="practice-question"
                ref={heading}
                tabIndex={-1}
              >
                {question.prompt}
              </h2>
              <fieldset
                className="grid gap-[11px] border-0 m-0 p-0 min-w-0"
                disabled={locked}
              >
                <legend className="sr-only">Select one answer</legend>
                {question.options.map((option) => (
                  <label
                    key={`${question.id}-${option.id}`}
                    className={`flex items-center gap-[15px] border border-line py-3 px-4 rounded-[7px] text-[14px] cursor-pointer hover:border-accent [&_input]:absolute [&_input]:w-px [&_input]:h-px [&_input]:opacity-0 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-focus has-[:focus-visible]:outline-offset-[3px] ${response.selected === option.id ? "[&&]:border-accent [&&]:bg-[color-mix(in_srgb,_var(--accent)_7%,_var(--surface))] [&&]:[&_>_span:first-of-type]:border-accent [&&]:[&_>_span:first-of-type]:text-accent [&&]:[&_>_span:last-child]:border-4 [&&]:[&_>_span:last-child]:border-accent" : ""} ${locked ? "[&&]:cursor-default" : ""}`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      checked={response.selected === option.id}
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
                  disabled={locked || !response.selected}
                  onClick={() =>
                    update(submitResponse(live.current, Date.now()))
                  }
                >
                  {locked ? "Submitted" : "Submit answer"}
                  <DiagnosticIcon name="check" />
                </button>
              </div>
              {!isExam && (
                <div className="flex items-center gap-3 mb-6 [&_span]:text-[11px] [&_span]:text-muted">
                  <button
                    className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
                    onClick={() => setMentor(true)}
                  >
                    ✦ AI Mentor
                  </button>
                  <span>Help when you choose it.</span>
                </div>
              )}
              <div className="flex items-center justify-between gap-3.5 pt-[21px] border-t border-t-line [&_>_span]:text-[10px] [&_>_span]:text-muted max-[600px]:gap-2 max-[600px]:[&_>_span]:text-[9px]">
                <button
                  className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
                  disabled={round.index === 0 || sequential}
                  onClick={() => navigate(round.index - 1)}
                >
                  ← Previous
                </button>
                <span>
                  {round.index + 1} of {round.items.length} questions
                </span>
                {round.index < round.items.length - 1 ? (
                  <button
                    className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
                    disabled={sequential && !locked}
                    onClick={() => navigate(round.index + 1)}
                  >
                    Next
                    <DiagnosticIcon name="arrow" />
                  </button>
                ) : (
                  <button
                    className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
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
        <p className="text-center text-muted text-[10px] leading-[1.8] mt-[19px]">
          {isExam
            ? "Timed mock exam · Submit each answer before moving forward. No hints or pauses. Leaving or refreshing loses your current progress. Answers are revealed after the exam."
            : "Response time is recorded until submission or timeout. Keep this tab open; reloading starts a new setup."}
        </p>
      </main>
      {confirmEnd && (
        <DiagnosticModal
          titleId="practice-end-title"
          onClose={() => setConfirmEnd(false)}
        >
          <h2 id="practice-end-title">
            {isExam ? "Submit your exam?" : "Ready to finish?"}
          </h2>
          <p>
            You’ve submitted {submitted} of {round.items.length} answers.
            Unsubmitted selections won’t count.
            {isExam ? " This ends your exam and reveals your results." : ""}
          </p>
          <div className="flex justify-end gap-3 mt-6.5">
            <button
              className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
              onClick={() => setConfirmEnd(false)}
            >
              Keep going
            </button>
            <button
              className="inline-flex items-center justify-center border border-danger text-white bg-danger rounded-[7px] text-[11px]! font-[550]! py-3 px-4 cursor-pointer hover:bg-danger-hover"
              onClick={() => {
                const now = Date.now();
                const next = advanceClock(live.current, now);
                update(
                  next.completedAt === null
                    ? { ...next, completedAt: now, reason: "stopped" }
                    : next,
                );
              }}
            >
              End {sessionLabel}
            </button>
          </div>
        </DiagnosticModal>
      )}
      {!isExam && mentor && !confirmEnd && (
        <DiagnosticModal
          titleId="mentor-title"
          onClose={() => setMentor(false)}
        >
          <h2 id="mentor-title">AI Mentor</h2>
          <p>
            AI guidance isn’t connected yet. For this{" "}
            {question.topic.toLowerCase()} question, start by identifying what
            is given and what you need to find, then evaluate each option.
          </p>
          <p>
            This is a general study tip, not an AI-generated response. Your
            timer keeps running.
          </p>
          <div className="flex justify-end gap-3 mt-6.5">
            <button
              className="inline-flex items-center justify-center gap-[13px] bg-accent text-button-text border border-transparent py-3 px-[17px] rounded-[7px] text-[12px]! font-[550]! no-underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0"
              onClick={() => setMentor(false)}
            >
              Back to question
            </button>
          </div>
        </DiagnosticModal>
      )}
    </div>
  );
}
