import { ATTEMPT_KEY, type Attempt, parseAttempt } from "./attempt";
import { saveSession } from "../dashboard/session-storage";

let memoryAttempt: Attempt | null = null;

export function readAttempt(): Attempt | null {
  try {
    const stored = parseAttempt(localStorage.getItem(ATTEMPT_KEY));
    return stored ?? memoryAttempt;
  } catch { return memoryAttempt; }
}
export function saveAttempt(attempt: Attempt): boolean {
  memoryAttempt = attempt;
  const historySaved = attempt.completedAt === null || saveSession({
    id: attempt.id, kind: "diagnostic", section: "All sections", completedAt: attempt.completedAt,
    answered: attempt.answers.filter(answer => answer.submittedAt !== null).length,
    total: attempt.answers.length, correct: null,
  });
  try { localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempt)); return historySaved; }
  catch { return false; }
}
