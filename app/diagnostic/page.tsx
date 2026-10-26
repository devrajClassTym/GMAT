import type { Metadata } from "next";
import { DiagnosticWalkthrough } from "./walkthrough";

export const metadata: Metadata = {
  title: "Diagnostic walkthrough | GMAT Prep",
  description: "Learn how to navigate your diagnostic before you begin.",
};

export default function DiagnosticPage() {
  return <DiagnosticWalkthrough />;
}
