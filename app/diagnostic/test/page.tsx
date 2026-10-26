import type { Metadata } from "next";
import { DiagnosticTest } from "./test-screen";
export const metadata: Metadata = { title: "Your diagnostic | GMAT Prep" };
export default function TestPage() { return <DiagnosticTest />; }
