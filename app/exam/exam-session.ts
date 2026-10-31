import { approvedQuestions, startRound, topicKey, type Round, type Settings } from "../diagnostic/practice/practice-engine";

const settings: Settings = { topics: approvedQuestions.map(topicKey), length: 15, timing: "round", seconds: 30 * 60 };

export function createExam(now: number, id: string): Round {
  return startRound(settings, now, id);
}
