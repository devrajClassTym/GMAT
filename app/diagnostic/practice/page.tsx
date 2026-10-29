import { Suspense } from "react";
import type { Metadata } from "next";
import { PracticeScreen } from "./practice-screen";

export const metadata: Metadata = { title: "Practice review | GMAT Prep" };
export default function PracticePage() {
  return <Suspense fallback={<p role="status">Preparing practice…</p>}><PracticeScreen /></Suspense>;
}
