"use client";

import Link from "next/link";
import { lazy, Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthUser } from "../../auth-session";
import { type Attempt } from "../attempt";
import { readAttempt } from "../attempt-storage";
import { DiagnosticHeader, DiagnosticIcon } from "../ui";
import { DiagnosticModal } from "../modal";
import { LockedResultsBackdrop } from "./locked-backdrop";

// Load the report only after sign-in or an explicit temporary preview bypass.
const UnlockedResults = lazy(() => import("./unlocked-results"));

export function ResultsScreen() {
  const user = useAuthUser();
  const router = useRouter();
  const [skipLogin, setSkipLogin] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  useEffect(() => {
    try {
      setSkipLogin(sessionStorage.getItem("gmat-results-preview") === "1");
    } catch {
      /* Preview still works for this render without storage. */
    }
    const saved = readAttempt();
    if (!saved) {
      router.replace("/diagnostic");
      return;
    }
    if (saved.completedAt === null) {
      router.replace("/diagnostic/test");
      return;
    }
    setAttempt(saved);
  }, [router]);

  if (!attempt)
    return (
      <div className="min-h-svh text-foreground bg-background [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-focus [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-focus [&_button:focus-visible]:outline-offset-4 [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-focus [&_input:focus-visible]:outline-offset-4">
        <DiagnosticHeader label="DIAGNOSTIC COMPLETE" />
        <main
          className="text-center text-muted py-25 px-6 text-[14px]"
          role="status"
        >
          Preparing your results…
        </main>
      </div>
    );
  if (user || skipLogin)
    return (
      <Suspense
        fallback={
          <div
            className="text-center text-muted py-25 px-6 text-[14px]"
            role="status"
          >
            Loading your results…
          </div>
        }
      >
        <UnlockedResults attempt={attempt} name={user?.name ?? ""} />
      </Suspense>
    );

  return (
    <div className="min-h-svh text-foreground bg-background [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50 [&_a:focus-visible]:outline-3 [&_a:focus-visible]:outline-focus [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-3 [&_button:focus-visible]:outline-focus [&_button:focus-visible]:outline-offset-4 [&_input:focus-visible]:outline-3 [&_input:focus-visible]:outline-focus [&_input:focus-visible]:outline-offset-4">
      <DiagnosticHeader label="DIAGNOSTIC COMPLETE" />
      <LockedResultsBackdrop />
      <DiagnosticModal
        titleId="signin-title"
        descriptionId="signin-description"
      >
        <span className="grid place-items-center w-11 h-11 bg-[color-mix(in_srgb,_var(--accent)_10%,_var(--surface))] border border-line rounded-[12px] text-accent">
          <DiagnosticIcon name="lock" />
        </span>
        <span className="block text-[8px] text-accent tracking-[1.4px] mt-[19px] font-semibold">
          {attempt.endReason === "timeout"
            ? "TIME’S UP · DIAGNOSTIC SAVED"
            : "DIAGNOSTIC COMPLETE"}
        </span>
        <h2 id="signin-title">
          Your next chapter
          <br />
          starts with clarity.
        </h2>
        <p id="signin-description">
          Your answers are saved.{" "}
          {mode === "signin" ? "Sign in" : "Create an account"} to view your
          strengths and see where to focus your prep.
        </p>
        <div
          className="grid grid-cols-2 gap-1 p-1 my-5.5 mx-0 bg-background border border-line rounded-[8px] [&_button]:bg-transparent [&_button]:text-muted [&_button]:border [&_button]:border-transparent [&_button]:rounded-[5px] [&_button]:py-[9px] [&_button]:px-2 [&_button]:text-[11px] [&_button]:cursor-pointer [&_button[aria-selected=true]]:text-foreground [&_button[aria-selected=true]]:bg-surface [&_button[aria-selected=true]]:border-line [&_button[aria-selected=true]]:shadow-[0_2px_6px_var(--shadow)]"
          role="tablist"
          aria-label="Account access"
        >
          <button
            id="signin-tab"
            role="tab"
            aria-selected={mode === "signin"}
            aria-controls="account-panel"
            tabIndex={mode === "signin" ? 0 : -1}
            onClick={() => setMode("signin")}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                setMode("signup");
                document.getElementById("signup-tab")?.focus();
              }
            }}
          >
            Sign in
          </button>
          <button
            id="signup-tab"
            role="tab"
            aria-selected={mode === "signup"}
            aria-controls="account-panel"
            tabIndex={mode === "signup" ? 0 : -1}
            onClick={() => setMode("signup")}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                setMode("signin");
                document.getElementById("signin-tab")?.focus();
              }
            }}
          >
            Create account
          </button>
        </div>
        <div
          id="account-panel"
          role="tabpanel"
          aria-labelledby={mode === "signin" ? "signin-tab" : "signup-tab"}
          className="grid gap-[15px] [&_label]:grid [&_label]:gap-2 [&_label]:text-[11px] [&_input]:w-full [&_input]:py-3 [&_input]:px-[13px] [&_input]:rounded-[7px] [&_input]:border [&_input]:border-line [&_input]:bg-background [&_input]:text-muted [&_input]:text-[12px] [&_button]:mt-[3px]"
        >
          <Link
            className="inline-flex items-center justify-center gap-[13px] bg-accent text-button-text border border-transparent py-3 px-[17px] rounded-[7px] text-[12px]! font-[550]! no-underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0"
            href={`${mode === "signin" ? "/login" : "/register"}?next=/diagnostic/results`}
          >
            {mode === "signin"
              ? "Sign in to view results"
              : "Create account to view results"}
            <DiagnosticIcon name="arrow" />
          </Link>
        </div>
        <button
          type="button"
          className="block mt-4 mx-auto mb-0 py-2 px-3 border-0 rounded-[6px] bg-transparent text-accent text-[12px] cursor-pointer underline underline-offset-[4px] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4"
          onClick={() => {
            try {
              sessionStorage.setItem("gmat-results-preview", "1");
            } catch {
              /* No persistence required to preview. */
            }
            setSkipLogin(true);
          }}
        >
          Skip for now →
        </button>
        <p className="text-[10px]! text-center mt-[17px] mx-0 mb-0">
          Sign in or create an account to continue to your results.
        </p>
        <Link
          href="/"
          className="block text-center text-muted text-[11px] mt-[19px]"
        >
          ← Back to home
        </Link>
      </DiagnosticModal>
    </div>
  );
}
