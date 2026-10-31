export type SessionRecord = {
  id: string;
  kind: "practice" | "diagnostic" | "exam";
  section: string;
  completedAt: number;
  answered: number;
  total: number;
  correct: number | null;
  timing?: "untimed" | "round" | "question";
  timeLimitSeconds?: number;
  topics?: string[];
  responses?: { questionId: string; submitted: string | null; responseTimeMs: number; status: "open" | "submitted" | "timeout" }[];
};

const STORAGE_KEY = "gmat-session-history-v1";
let memory: SessionRecord[] = [];

export function readSessions(): SessionRecord[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(value)) return memory;
    const stored = value.filter((item): item is SessionRecord => item !== null &&
      typeof item === "object" && typeof item.id === "string" &&
      (item.kind === "practice" || item.kind === "diagnostic" || item.kind === "exam") && typeof item.section === "string" &&
      Number.isFinite(item.completedAt) && item.completedAt > 0 &&
      Number.isInteger(item.total) && item.total > 0 && Number.isInteger(item.answered) &&
      item.answered >= 0 && item.answered <= item.total &&
      (item.correct === null || (Number.isInteger(item.correct) && item.correct >= 0 && item.correct <= item.answered)));
    return [...new Map([...stored, ...memory].map(item => [item.id, item])).values()]
      .sort((first, second) => second.completedAt - first.completedAt);
  } catch { return memory; }
}

export function saveSession(session: SessionRecord): boolean {
  memory = [session, ...readSessions().filter(item => item.id !== session.id)]
    .sort((first, second) => second.completedAt - first.completedAt);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(memory)); return true; }
  catch { return false; }
}
