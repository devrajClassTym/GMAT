import { ATTEMPT_KEY, type Attempt, parseAttempt } from "./attempt";

let memoryAttempt: Attempt | null = null;

export function readAttempt(): Attempt | null {
  try {
    const stored = parseAttempt(localStorage.getItem(ATTEMPT_KEY));
    return stored ?? memoryAttempt;
  } catch { return memoryAttempt; }
}
export function saveAttempt(attempt: Attempt): boolean {
  memoryAttempt = attempt;
  try { localStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempt)); return true; }
  catch { return false; }
}
