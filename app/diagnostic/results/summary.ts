import answerKey from "../data/answer-key.json";
import { questions, type Attempt } from "../attempt";

const key = answerKey as Record<string, string>;

/** Describe the fixed blueprint; never infer mastery from a single topic item. */
export function summarize(attempt: Attempt) {
  const count = (ids: string[]) => {
    const answers = attempt.answers.filter(answer => ids.includes(answer.questionId));
    const submitted = answers.filter(answer => answer.submittedAt !== null);
    return {
      total: ids.length,
      submitted: submitted.length,
      correct: submitted.filter(answer => answer.submittedOptionId === key[answer.questionId]).length,
      incorrect: submitted.filter(answer => answer.submittedOptionId !== key[answer.questionId]).length,
      unanswered: ids.length - submitted.length,
    };
  };
  const sections = [...new Set(questions.map(question => question.section))].map(section => {
    const items = questions.filter(question => question.section === section);
    const skills = [...new Set(items.map(question => question.topic))].map(topic => ({
      topic, ...count(items.filter(question => question.topic === topic).map(question => question.id)),
    }));
    return { section, ...count(items.map(question => question.id)), skills };
  });
  return {
    ...count(questions.map(question => question.id)), sections,
    elapsedMs: Math.max(0, (attempt.completedAt ?? attempt.startedAt) - attempt.startedAt),
  };
}
