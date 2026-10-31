import { questions, type Question } from "../attempt";
import bank from "./data/question-bank.json";

export type Timing = "untimed" | "round" | "question";
export type Settings = { topics: string[]; length: number | "unlimited"; timing: Timing; seconds: number };
export type Response = { questionId: string; selected: string | null; submitted: string | null; responseTimeMs: number; status: "open" | "submitted" | "timeout" };
export type Round = { id: string; items: Question[]; settings: Settings; responses: Response[]; index: number; startedAt: number; checkpointAt: number; completedAt: number | null; reason: "finished" | "stopped" | "timeout" | null };
export const approvedQuestions = questions.filter(question => bank.questions.some(entry => entry.questionId === question.id && entry.status === "approved"));
export const topicKey = (question: Question) => `${question.section}::${question.topic}`;

export function selectQuestions(settings: Settings) {
  const matching = approvedQuestions.filter(question => settings.topics.includes(topicKey(question)));
  return settings.length === "unlimited" ? matching : matching.slice(0, settings.length);
}

export function startRound(settings: Settings, now: number, id: string): Round {
  const items = selectQuestions(settings);
  if (!items.length) throw new Error("Select at least one available topic.");
  return { id, items, settings, responses: items.map(question => ({ questionId: question.id, selected: null, submitted: null, responseTimeMs: 0, status: "open" })), index: 0, startedAt: now, checkpointAt: now, completedAt: null, reason: null };
}

export function advanceClock(round: Round, now: number): Round {
  if (round.completedAt !== null) return round;
  const deadline = round.settings.timing === "round" ? round.startedAt + round.settings.seconds * 1000 : Infinity;
  const effectiveNow = Math.min(now, deadline);
  const elapsed = Math.max(0, effectiveNow - round.checkpointAt);
  const responses = round.responses.map((response, index) => index === round.index && response.status === "open"
    ? { ...response, responseTimeMs: response.responseTimeMs + elapsed } : response);
  let updated = { ...round, responses, checkpointAt: now };
  if (now >= deadline) return { ...updated, completedAt: deadline, reason: "timeout" };
  const current = responses[round.index];
  if (round.settings.timing === "question" && current.status === "open" && current.responseTimeMs >= round.settings.seconds * 1000) {
    updated = { ...updated, responses: responses.map((response, index) => index === round.index
      ? { ...response, responseTimeMs: round.settings.seconds * 1000, status: "timeout" as const } : response) };
    const expiredAt = round.checkpointAt + Math.max(0, round.settings.seconds * 1000 - round.responses[round.index].responseTimeMs);
    if (round.index === round.items.length - 1) return { ...updated, checkpointAt: expiredAt, completedAt: expiredAt, reason: "finished" };
    return advanceClock({ ...updated, index: round.index + 1, checkpointAt: expiredAt }, now);
  }
  return updated;
}

export function submitResponse(round: Round, now: number): Round {
  const updated = advanceClock(round, now);
  if (updated.completedAt !== null || updated.index !== round.index) return updated;
  const current = updated.responses[updated.index];
  if (current.status !== "open" || current.selected === null) return updated;
  const responses = updated.responses.map((response, index) => index === updated.index
    ? { ...response, submitted: response.selected, status: "submitted" as const } : response);
  const complete = responses.every(response => response.status !== "open");
  return { ...updated, responses, completedAt: complete ? now : null, reason: complete ? "finished" : null };
}
