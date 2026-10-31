import type { Metadata } from "next";
import { ExamScreen } from "./exam-screen";

export const metadata: Metadata = { title: "Exam Mode | GMAT Prep" };

export default function ExamPage() {
  return <ExamScreen />;
}
