import questionData from "./data/questions.json";

export type Question = {
  id: string; section: string; type: string; topic: string; difficulty: string;
  prompt: string; passage?: string; options: { id: string; text: string }[];
};
export const questions: Question[] = questionData;
export const DURATION_MS = 30 * 60 * 1000;
export const ATTEMPT_KEY = "gmat-diagnostic-attempt-v1";
export type Answer = {
  questionId: string; section: string; type: string; topic: string; difficulty: string;
  selectedOptionId: string | null; submittedOptionId: string | null;
  firstViewedAt: number | null; lastViewedAt: number | null; submittedAt: number | null;
  timeSpentMs: number; timeAtSubmissionMs: number | null; visits: number;
};
export type Attempt = {
  version: 1; id: string; startedAt: number; deadlineAt: number; completedAt: number | null;
  endReason: "manual" | "timeout" | null; currentIndex: number; answers: Answer[];
};

export function createAttempt(now: number, id: string): Attempt {
  return { version: 1, id, startedAt: now, deadlineAt: now + DURATION_MS, completedAt: null,
    endReason: null, currentIndex: 0, answers: questions.map((question, index) => ({
      questionId: question.id, section: question.section, type: question.type, topic: question.topic,
      difficulty: question.difficulty, selectedOptionId: null, submittedOptionId: null,
      firstViewedAt: index === 0 ? now : null, lastViewedAt: index === 0 ? now : null,
      submittedAt: null, timeSpentMs: 0, timeAtSubmissionMs: null, visits: index === 0 ? 1 : 0,
    })) };
}

export function remainingMs(attempt: Attempt, now: number) {
  return Math.max(0, attempt.deadlineAt - now);
}
export function isOpen(attempt: Attempt, now: number) {
  return attempt.completedAt === null && remainingMs(attempt, now) > 0;
}
export function addActiveTime(attempt: Attempt, duration: number): Attempt {
  if (attempt.completedAt !== null || duration <= 0) return attempt;
  return { ...attempt, answers: attempt.answers.map((answer, index) => index === attempt.currentIndex
    ? { ...answer, timeSpentMs: answer.timeSpentMs + Math.max(0, duration) } : answer) };
}
export function selectOption(attempt: Attempt, optionId: string, now: number): Attempt {
  const index = attempt.currentIndex;
  if (!isOpen(attempt, now) || attempt.answers[index].submittedAt !== null || !questions[index].options.some(option => option.id === optionId)) return attempt;
  return { ...attempt, answers: attempt.answers.map((answer, i) => i === index ? { ...answer, selectedOptionId: optionId } : answer) };
}
export function submitAnswer(attempt: Attempt, now: number): Attempt {
  const answer = attempt.answers[attempt.currentIndex];
  if (!isOpen(attempt, now) || answer.submittedAt !== null || answer.selectedOptionId === null) return attempt;
  return { ...attempt, answers: attempt.answers.map((item, i) => i === attempt.currentIndex
    ? { ...item, submittedOptionId: item.selectedOptionId, submittedAt: now, timeAtSubmissionMs: item.timeSpentMs } : item) };
}
export function navigateTo(attempt: Attempt, index: number, now: number): Attempt {
  if (!isOpen(attempt, now) || index === attempt.currentIndex || !Number.isInteger(index) || index < 0 || index >= questions.length) return attempt;
  return { ...attempt, currentIndex: index, answers: attempt.answers.map((answer, i) => i === index
    ? { ...answer, firstViewedAt: answer.firstViewedAt ?? now, lastViewedAt: now, visits: answer.visits + 1 } : answer) };
}
export function completeAttempt(attempt: Attempt, now: number, reason: "manual" | "timeout"): Attempt {
  if (attempt.completedAt !== null) return attempt;
  const timedOut = reason === "timeout" || now >= attempt.deadlineAt;
  return { ...attempt, completedAt: timedOut ? attempt.deadlineAt : now, endReason: timedOut ? "timeout" : "manual" };
}

/** Only answers and timing are persisted. No score or correctness is stored. */
export function parseAttempt(raw: string | null): Attempt | null {
  if (!raw) return null;
  try {
    const data: Attempt = JSON.parse(raw);
    const validTime = (value: unknown) => typeof value === "number" && Number.isFinite(value) && value >= 0;
    const nullableTime = (value: unknown) => value === null || validTime(value);
    if (data.version !== 1 || typeof data.id !== "string" || !validTime(data.startedAt) ||
      data.deadlineAt !== data.startedAt + DURATION_MS || !nullableTime(data.completedAt) ||
      (data.endReason !== null && data.endReason !== "manual" && data.endReason !== "timeout") ||
      ((data.completedAt === null) !== (data.endReason === null)) ||
      !Number.isInteger(data.currentIndex) || data.currentIndex < 0 || data.currentIndex >= questions.length ||
      !Array.isArray(data.answers) || data.answers.length !== questions.length) return null;
    for (const [i, answer] of data.answers.entries()) {
      const q = questions[i];
      const validOption = (id: string | null) => id === null || q.options.some(option => option.id === id);
      if (answer.questionId !== q.id || answer.section !== q.section || answer.type !== q.type ||
        answer.topic !== q.topic || answer.difficulty !== q.difficulty ||
        !validOption(answer.selectedOptionId) || !validOption(answer.submittedOptionId) ||
        !nullableTime(answer.firstViewedAt) || !nullableTime(answer.lastViewedAt) || !nullableTime(answer.submittedAt) ||
        !validTime(answer.timeSpentMs) || !nullableTime(answer.timeAtSubmissionMs) ||
        !Number.isInteger(answer.visits) || answer.visits < 0 ||
        ((answer.submittedAt === null) !== (answer.submittedOptionId === null)) ||
        ((answer.submittedAt === null) !== (answer.timeAtSubmissionMs === null)) ||
        (answer.submittedAt !== null && answer.selectedOptionId !== answer.submittedOptionId)) return null;
    }
    return data;
  } catch { return null; }
}
export function formatTime(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
