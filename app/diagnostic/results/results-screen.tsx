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
import common from "../test/test.module.css";
import styles from "./results.module.css";

// Load the report only after sign-in or an explicit temporary preview bypass.
const UnlockedResults = lazy(() => import("./unlocked-results"));

export function ResultsScreen() {
  const user = useAuthUser();
  const router = useRouter();
  const [skipLogin, setSkipLogin] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  useEffect(() => {
    try { setSkipLogin(sessionStorage.getItem("gmat-results-preview") === "1"); } catch { /* Preview still works for this render without storage. */ }
    const saved = readAttempt();
    if (!saved) { router.replace("/diagnostic"); return; }
    if (saved.completedAt === null) { router.replace("/diagnostic/test"); return; }
    setAttempt(saved);
  }, [router]);

  if (!attempt) return <div className={common.page}><DiagnosticHeader label="DIAGNOSTIC COMPLETE" /><main className={common.loading} role="status">Preparing your results…</main></div>;
  if (user || skipLogin) return <Suspense fallback={<div className={common.loading} role="status">Loading your results…</div>}><UnlockedResults attempt={attempt} name={user?.name ?? ""} /></Suspense>;

  return <div className={common.page}>
    <DiagnosticHeader label="DIAGNOSTIC COMPLETE" />
    <LockedResultsBackdrop />
    <DiagnosticModal titleId="signin-title" descriptionId="signin-description">
      <span className={common.modalIcon}><DiagnosticIcon name="lock" /></span>
      <span className={styles.completeTag}>{attempt.endReason === "timeout" ? "TIME’S UP · DIAGNOSTIC SAVED" : "DIAGNOSTIC COMPLETE"}</span>
      <h2 id="signin-title">Your next chapter<br />starts with clarity.</h2>
      <p id="signin-description">Your answers are saved. {mode === "signin" ? "Sign in" : "Create an account"} to view your strengths and see where to focus your prep.</p>
      <div className={styles.authTabs} role="tablist" aria-label="Account access"><button id="signin-tab" role="tab" aria-selected={mode === "signin"} aria-controls="account-panel" tabIndex={mode === "signin" ? 0 : -1} onClick={() => setMode("signin")} onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { setMode("signup"); document.getElementById("signup-tab")?.focus(); } }}>Sign in</button><button id="signup-tab" role="tab" aria-selected={mode === "signup"} aria-controls="account-panel" tabIndex={mode === "signup" ? 0 : -1} onClick={() => setMode("signup")} onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { setMode("signin"); document.getElementById("signin-tab")?.focus(); } }}>Create account</button></div>
      <div id="account-panel" role="tabpanel" aria-labelledby={mode === "signin" ? "signin-tab" : "signup-tab"} className={styles.authPanel}>
        <label>Email address<input disabled type="email" placeholder="you@example.com" autoComplete="email" /></label>
        <label>Password<input disabled type="password" placeholder="Enter your password" autoComplete={mode === "signin" ? "current-password" : "new-password"} /></label>
        <button className={common.primaryButton} disabled>{mode === "signin" ? "Sign in to view results" : "Create account to view results"}<DiagnosticIcon name="arrow" /></button>
      </div>
      <button type="button" className={styles.skipButton} onClick={() => {
        try { sessionStorage.setItem("gmat-results-preview", "1"); } catch { /* No persistence required to preview. */ }
        setSkipLogin(true);
      }}>Skip for now →</button>
      <p className={styles.authNotice}>Account access is coming soon. This is a UI preview; sign-in is not connected yet.</p>
      <Link href="/" className={styles.backLink}>← Back to home</Link>
    </DiagnosticModal>
  </div>;
}
