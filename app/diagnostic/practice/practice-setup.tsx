"use client";

import Link from "next/link";
import { useState } from "react";
import { DiagnosticIcon } from "../ui";
import {
  approvedQuestions,
  selectQuestions,
  topicKey,
  type Settings,
  type Timing,
} from "./practice-engine";

const sections = [
  ...new Set(approvedQuestions.map((question) => question.section)),
];

export function PracticeSetup({
  section,
  onStart,
}: {
  section: string | null;
  onStart: (settings: Settings) => void;
}) {
  const [selectedSections, setSelectedSections] = useState<string[]>(() =>
    sections.filter((name) => !section || name === section),
  );
  const [length, setLength] = useState<number | "unlimited">(10);
  const [timing, setTiming] = useState<Timing>("untimed");
  const [minutes, setMinutes] = useState(20);
  const [seconds, setSeconds] = useState(120);
  const selectedQuestions = approvedQuestions.filter((question) =>
    selectedSections.includes(question.section),
  );
  const topics = selectedQuestions.map(topicKey);
  const settings: Settings = {
    topics,
    length,
    timing,
    seconds: timing === "round" ? minutes * 60 : seconds,
  };
  const available = selectedQuestions.length;
  const count = selectQuestions(settings).length;
  const validTime =
    timing === "untimed" ||
    (Number.isInteger(settings.seconds) &&
      settings.seconds >= (timing === "round" ? 60 : 10) &&
      settings.seconds <= (timing === "round" ? 10800 : 900));

  return (
    <div className="min-h-svh text-foreground bg-background [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-focus [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-focus [&_button:focus-visible]:outline-offset-4 [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-focus [&_input:focus-visible]:outline-offset-4 [&&]:flex [&&]:flex-col [&&]:min-h-dvh [&&]:p-6 max-[600px]:[&&]:p-3">
      <main className="w-full max-w-220 m-auto">
        <form
          className="border border-line rounded-[14px] bg-surface shadow-[0_8px_35px_var(--shadow)] p-6 max-[700px]:p-4.5"
          onSubmit={(event) => {
            event.preventDefault();
            if (count && validTime) onStart(settings);
          }}
        >
          <div className="[&_h1]:text-[clamp(25px,_3vw,_34px)] [&_h1]:font-[550] [&_h1]:tracking-[-1px] [&_h1]:leading-[1.2] [&_h1]:mt-3 [&_h1]:mx-0 [&_h1]:mb-2.5 [&_p]:text-[13px] [&_p]:text-muted [&_p]:mt-0 [&_p]:mx-0 [&_p]:mb-7 [&_p]:leading-[1.7] [&&]:[&_h1]:text-[clamp(24px,_3vw,_29px)] [&&]:[&_h1]:my-2 [&&]:[&_h1]:mx-0 [&&]:[&_p]:mb-5.5">
            <span className="text-[9px] tracking-[1.8px] font-semibold text-accent">
              PRACTICE YOUR WAY
            </span>
            <h1>Build your practice round.</h1>
            <p>A few choices. Then you’re ready to go.</p>
          </div>
          <fieldset className="border-0 p-0 m-0 min-w-0 [&_legend]:text-[13px] [&_legend]:font-[650] [&_legend]:mb-2.5 [&_p]:text-muted [&_p]:text-[11px] [&_p]:leading-[1.6] [&_p]:mt-2.5 [&_p]:mx-0 [&_p]:mb-0">
            <legend>Main topics</legend>
            <div className="flex items-center gap-3.5 mt-0 mx-0 mb-4.5 flex-wrap [&_span]:text-muted [&_span]:text-[11px] [&_span]:mr-auto [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-accent [&_button]:py-1 [&_button]:px-0 [&_button]:text-[11px]">
              <span role="status">
                {available} approved questions available
              </span>
              <button
                type="button"
                onClick={() => setSelectedSections(sections)}
              >
                Select all
              </button>
              <button type="button" onClick={() => setSelectedSections([])}>
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-[7px]">
              {sections.map((name) => (
                <label
                  key={name}
                  className="relative inline-flex items-center gap-1.5 py-[7px] px-2.5 border border-line rounded-[20px] text-[11px] text-muted cursor-pointer [&_input]:absolute [&_input]:w-px [&_input]:h-px [&_input]:opacity-0 has-[:checked]:text-accent has-[:checked]:border-[color-mix(in_srgb,_var(--accent)_40%,_var(--line))] has-[:checked]:bg-[color-mix(in_srgb,_var(--accent)_6%,_var(--surface))] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-focus has-[:focus-visible]:outline-offset-[3px] hover:border-accent"
                >
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(name)}
                    onChange={(event) =>
                      setSelectedSections((current) =>
                        event.target.checked
                          ? [...current, name]
                          : current.filter((value) => value !== name),
                      )
                    }
                  />
                  <span className="w-2.5 text-[11px]" aria-hidden="true">
                    {selectedSections.includes(name) ? "✓" : "+"}
                  </span>
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid grid-cols-2 gap-7 py-5 px-0 mt-5.5 border-t border-t-line border-b border-b-line mb-5 max-[700px]:grid-cols-1 max-[700px]:gap-5">
            <fieldset className="border-0 p-0 m-0 min-w-0 [&_legend]:text-[13px] [&_legend]:font-[650] [&_legend]:mb-2.5 [&_p]:text-muted [&_p]:text-[11px] [&_p]:leading-[1.6] [&_p]:mt-2.5 [&_p]:mx-0 [&_p]:mb-0">
              <legend>Round length</legend>
              <div className="flex gap-1 p-1 rounded-[9px] bg-background border border-line">
                {([10, 15, 20, "unlimited"] as const).map((value) => (
                  <label
                    className="[&_input]:absolute [&_input]:w-px [&_input]:h-px [&_input]:opacity-0 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-focus has-[:focus-visible]:outline-offset-[3px] relative flex flex-1 justify-center items-center py-2 px-[7px] border border-transparent rounded-[6px] text-[11px] whitespace-nowrap cursor-pointer text-muted has-[:checked]:border-line has-[:checked]:bg-surface has-[:checked]:text-foreground has-[:checked]:shadow-[0_1px_3px_var(--shadow)] has-[:checked]:font-semibold"
                    key={value}
                  >
                    <input
                      type="radio"
                      name="length"
                      aria-label={
                        value === "unlimited"
                          ? "Unlimited questions"
                          : `${value} questions`
                      }
                      checked={length === value}
                      onChange={() => setLength(value)}
                    />
                    <span>{value === "unlimited" ? "Unlimited" : value}</span>
                  </label>
                ))}
              </div>
              <p>
                {length === "unlimited"
                  ? "Until you stop or content runs out. No repeats."
                  : available < length
                    ? `${count} of ${length} questions available. This round has ${count}.`
                    : `${count} questions from your selected topics.`}
              </p>
            </fieldset>
            <fieldset className="border-0 p-0 m-0 min-w-0 [&_legend]:text-[13px] [&_legend]:font-[650] [&_legend]:mb-2.5 [&_p]:text-muted [&_p]:text-[11px] [&_p]:leading-[1.6] [&_p]:mt-2.5 [&_p]:mx-0 [&_p]:mb-0">
              <legend>Timing</legend>
              <div className="flex gap-1 p-1 rounded-[9px] bg-background border border-line">
                {(
                  [
                    { value: "untimed", title: "Untimed" },
                    { value: "round", title: "Whole round" },
                    { value: "question", title: "Per question" },
                  ] as const
                ).map((option) => (
                  <label
                    className="[&_input]:absolute [&_input]:w-px [&_input]:h-px [&_input]:opacity-0 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-focus has-[:focus-visible]:outline-offset-[3px] relative flex flex-1 justify-center items-center py-2 px-[7px] border border-transparent rounded-[6px] text-[11px] whitespace-nowrap cursor-pointer text-muted has-[:checked]:border-line has-[:checked]:bg-surface has-[:checked]:text-foreground has-[:checked]:shadow-[0_1px_3px_var(--shadow)] has-[:checked]:font-semibold"
                    key={option.value}
                  >
                    <input
                      type="radio"
                      name="timing"
                      checked={timing === option.value}
                      onChange={() => setTiming(option.value)}
                    />
                    <span>{option.title}</span>
                  </label>
                ))}
              </div>
              {timing === "round" && (
                <label className="flex items-center justify-between gap-2.5 mt-3 text-[11px] [&_input]:w-18 [&_input]:py-1.5 [&_input]:px-2 [&_input]:border [&_input]:border-line [&_input]:rounded-[6px] [&_input]:bg-background [&_input]:text-foreground">
                  Minutes for the complete round
                  <input
                    type="number"
                    min={1}
                    max={180}
                    step={1}
                    required
                    value={minutes || ""}
                    onChange={(event) => setMinutes(Number(event.target.value))}
                  />
                </label>
              )}
              {timing === "question" && (
                <label className="flex items-center justify-between gap-2.5 mt-3 text-[11px] [&_input]:w-18 [&_input]:py-1.5 [&_input]:px-2 [&_input]:border [&_input]:border-line [&_input]:rounded-[6px] [&_input]:bg-background [&_input]:text-foreground">
                  Seconds per question
                  <input
                    type="number"
                    min={10}
                    max={900}
                    step={1}
                    required
                    value={seconds || ""}
                    onChange={(event) => setSeconds(Number(event.target.value))}
                  />
                </label>
              )}
              <p>
                {timing === "question"
                  ? "Timeout locks the question and advances. Timer runs in the background."
                  : timing === "round"
                    ? "Timeout ends the round. Timer runs in the background."
                    : "No countdown. Response times are still recorded."}
              </p>
            </fieldset>
          </div>
          <div className="flex items-center justify-between gap-3.5 max-[700px]:flex-wrap">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-3 border border-line text-foreground bg-surface py-[11px] px-3.5 text-[11px]! rounded-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:w-[15px] [&_svg]:h-[15px] max-[600px]:py-2.5 max-[600px]:px-3 max-[600px]:gap-1.5"
            >
              ← Dashboard
            </Link>
            <button
              className="inline-flex items-center justify-center gap-[13px] bg-accent text-button-text border border-transparent py-3 px-[17px] rounded-[7px] text-[12px]! font-[550]! no-underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0"
              disabled={!count || !validTime}
            >
              Start Practice · {count} questions
              <DiagnosticIcon name="arrow" />
            </button>
          </div>
          <p className="text-center text-muted text-[10px] leading-[1.8] mt-[19px]">
            Sample question bank with demo approval statuses. Questions are
            shared with the diagnostic.
          </p>
        </form>
      </main>
    </div>
  );
}
