import type { Metadata } from "next";
import { ResultsScreen } from "./results-screen";
export const metadata: Metadata = { title: "Your diagnostic results | GMAT Prep" };
export default function ResultsPage() { return <ResultsScreen />; }
