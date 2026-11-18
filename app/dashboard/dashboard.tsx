import Link from "next/link";
import { DiagnosticHeader, DiagnosticIcon } from "../diagnostic/ui";
import type { SessionRecord } from "./session-storage";
import sessionData from "./data/sessions.json";

export function Dashboard() {
  const records = [...(sessionData as SessionRecord[])].sort(
    (first, second) => second.completedAt - first.completedAt,
  );
  const practice = records.filter((session) => session.kind === "practice");
  const latest = practice[0];
  const baseline =
    latest &&
    practice.findLast(
      (session) =>
        session.section === latest.section && session.total === latest.total,
    );
  const firstAccuracy =
    baseline?.correct == null ? 0 : baseline.correct / baseline.total;
  const improvement =
    latest &&
    baseline &&
    latest.id !== baseline.id &&
    latest.correct !== null &&
    firstAccuracy > 0
      ? Math.round(
          ((latest.correct / latest.total - firstAccuracy) / firstAccuracy) *
            100,
        )
      : null;

  return (
    <div className="min-h-screen">
      <DiagnosticHeader label="DASHBOARD" />
      <main className="max-w-290 my-0 mx-auto pt-14 px-8 pb-8 max-[760px]:py-8 max-[760px]:px-4.5">
        <div className="mb-8 [&_h1]:my-3 [&_h1]:mx-0 [&_h1]:text-[clamp(28px,_4vw,_40px)] [&_h1]:tracking-[-.045em] [&_h1]:font-bold [&_h1]:leading-[1.2] [&_p]:text-muted [&_p]:text-[14px] [&_p]:leading-[1.6]">
          <span className="text-accent text-[11px] font-[750] tracking-[.16em]">
            YOUR LEARNING JOURNEY
          </span>
          <h1>A little practice. Real progress.</h1>
          <p>Pick up where you left off and make your next session count.</p>
        </div>
        <section
          className="grid grid-cols-3 gap-5 max-[760px]:grid-cols-1 max-[760px]:gap-3.5"
          aria-label="Your statistics"
        >
          <article className="[&_p]:text-muted [&_p]:text-[12px] [&_p]:leading-[1.6] [&_p]:mt-3 [&_p]:mx-0 [&_p]:mb-0 relative p-7 border border-line rounded-[18px] bg-surface [&_h2]:text-[14px] [&_h2]:font-medium [&_h2]:pr-9 [&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-5.5 [&_strong]:text-[44px] [&_strong]:font-[650] [&_strong]:tracking-[-.05em] [&_strong]:leading-none max-[760px]:p-6">
            <span className="absolute right-5.5 top-5 grid place-items-center w-9 h-9 rounded-[10px] bg-background text-accent">
              <DiagnosticIcon name="clock" />
            </span>
            <h2>Total tests taken</h2>
            <strong>
              {
                records.filter(
                  (session) =>
                    session.kind === "diagnostic" || session.kind === "exam",
                ).length
              }
            </strong>
            <p>Completed diagnostics and exams</p>
          </article>
          <article className="[&_p]:text-muted [&_p]:text-[12px] [&_p]:leading-[1.6] [&_p]:mt-3 [&_p]:mx-0 [&_p]:mb-0 relative p-7 border border-line rounded-[18px] bg-surface [&_h2]:text-[14px] [&_h2]:font-medium [&_h2]:pr-9 [&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-5.5 [&_strong]:text-[44px] [&_strong]:font-[650] [&_strong]:tracking-[-.05em] [&_strong]:leading-none max-[760px]:p-6">
            <span className="absolute right-5.5 top-5 grid place-items-center w-9 h-9 rounded-[10px] bg-background text-accent">
              <DiagnosticIcon name="check" />
            </span>
            <h2>Questions answered</h2>
            <strong>
              {records.reduce((total, session) => total + session.answered, 0)}
            </strong>
            <p>Across completed tests and practice</p>
          </article>
          <article className="[&_p]:text-muted [&_p]:text-[12px] [&_p]:leading-[1.6] [&_p]:mt-3 [&_p]:mx-0 [&_p]:mb-0 relative p-7 border border-line rounded-[18px] bg-surface [&_h2]:text-[14px] [&_h2]:font-medium [&_h2]:pr-9 [&_h2]:mt-0 [&_h2]:mx-0 [&_h2]:mb-5.5 [&_strong]:text-[44px] [&_strong]:font-[650] [&_strong]:tracking-[-.05em] [&_strong]:leading-none max-[760px]:p-6">
            <span className="absolute right-5.5 top-5 grid place-items-center w-9 h-9 rounded-[10px] bg-background text-accent">
              ↗
            </span>
            <h2>Percentage improvement</h2>
            <strong>
              {improvement === null
                ? "—"
                : `${improvement > 0 ? "+" : ""}${improvement}%`}
            </strong>
            <p>
              {improvement === null
                ? "Needs two same-section practices and a nonzero baseline"
                : `${latest.section}: latest vs. first practice accuracy`}
            </p>
          </article>
        </section>
        <section
          className="grid grid-cols-2 gap-5 mt-6.5 mx-0 mb-11 [&_a]:flex [&_a]:items-center [&_a]:gap-4 [&_a]:p-[25px] [&_a]:rounded-[16px] [&_a]:transition-transform [&_a]:duration-150 [&_a:hover]:-translate-y-0.5 [&_a_>_span:nth-child(2)]:flex-1 [&_strong]:block [&_strong]:text-[18px] [&_strong]:font-[650] [&_strong]:mb-[5px] [&_small]:block [&_small]:text-[12px] [&_small]:leading-[1.6] max-[760px]:grid-cols-1 max-[760px]:gap-3.5 motion-reduce:[&_a]:transition-none"
          aria-label="Start a session"
        >
          <Link
            href="/diagnostic/practice"
            className="bg-accent text-button-text border border-accent"
          >
            <span className="grid place-items-center w-10.5 h-10.5 border border-question-current rounded-[12px] shrink-0">
              <DiagnosticIcon name="book" />
            </span>
            <span>
              <strong>Start Practice</strong>
              <small>Choose your topics, round length, and timing.</small>
            </span>
            <DiagnosticIcon name="arrow" />
          </Link>
          <Link
            href="/exam"
            className="bg-surface border border-line [&_small]:text-muted"
          >
            <span className="grid place-items-center w-10.5 h-10.5 border border-question-current rounded-[12px] shrink-0">
              <DiagnosticIcon name="clock" />
            </span>
            <span>
              <strong>Exam Mode</strong>
              <small>Start your timed exam. 15 questions · 30 minutes.</small>
            </span>
            <DiagnosticIcon name="arrow" />
          </Link>
        </section>
        <section
          className="border border-line rounded-[18px] bg-surface overflow-hidden"
          aria-labelledby="history-title"
        >
          <div className="flex items-center justify-between gap-4 py-6.5 px-7 border-b border-b-line [&_h2]:mt-[7px] [&_h2]:mx-0 [&_h2]:mb-0 [&_h2]:text-[21px] [&_h2]:font-[650] [&_h2]:tracking-[-.03em] max-[760px]:py-5.5 max-[760px]:px-4.5 max-[760px]:[&_h2]:text-[18px]">
            <div>
              <span className="text-accent text-[11px] font-[750] tracking-[.16em]">
                KEEP THE MOMENTUM
              </span>
              <h2 id="history-title">Previous practice sessions</h2>
            </div>
            <span className="whitespace-nowrap rounded-[20px] bg-background py-[7px] px-3 text-muted text-[12px]">
              {practice.length} sessions
            </span>
          </div>
          {practice.length === 0 ? (
            <div className="py-13 px-6 text-center text-muted [&_svg]:mt-0 [&_svg]:mx-auto [&_svg]:mb-4 [&_svg]:w-7 [&_svg]:h-7 [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:mt-0 [&_h3]:mx-0 [&_h3]:mb-2 [&_p]:text-[14px] [&_p]:mt-0 [&_p]:mx-0 [&_p]:mb-5 [&_a]:text-accent [&_a]:text-[13px] [&_a]:font-semibold">
              <DiagnosticIcon name="book" />
              <h3>Your first session starts here.</h3>
              <p>Finish a practice set and your results will appear here.</p>
              <Link href="/diagnostic/practice">
                Start your first practice →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="[&_a]:text-accent [&_a]:text-[13px] [&_a]:font-semibold w-full border-collapse text-left text-[13px] [&_th]:bg-background [&_th]:text-muted [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[.06em] [&_th]:py-4.5 [&_th]:px-6 [&_th]:whitespace-nowrap [&_td]:py-4.5 [&_td]:px-6 [&_td]:whitespace-nowrap [&_td]:border-t [&_td]:border-t-line [&_small]:block [&_small]:mt-1 [&_small]:text-muted [&_small]:text-[11px]">
                <thead>
                  <tr>
                    <th scope="col">Practice session</th>
                    <th scope="col">Completed</th>
                    <th scope="col">Answered</th>
                    <th scope="col">Accuracy</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {practice.map((session) => (
                    <tr key={session.id}>
                      <td>
                        <strong>{session.section}</strong>
                        <small>Untimed practice</small>
                      </td>
                      <td>
                        {new Date(session.completedAt).toLocaleString(
                          undefined,
                          { dateStyle: "medium", timeStyle: "short" },
                        )}
                      </td>
                      <td>
                        {session.answered} / {session.total}
                      </td>
                      <td>
                        {session.correct === null
                          ? "—"
                          : `${Math.round((session.correct / session.total) * 100)}%`}
                      </td>
                      <td>
                        <Link
                          href={`/diagnostic/practice?section=${encodeURIComponent(session.section)}`}
                          aria-label={`Practice ${session.section} again`}
                        >
                          Practice again ↗
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <p className="text-muted text-[11px] leading-[1.6] mt-5">
          Showing sample data. Improvement compares the latest and first
          practice accuracy for the same section; it is not a GMAT score
          prediction.
        </p>
      </main>
    </div>
  );
}
