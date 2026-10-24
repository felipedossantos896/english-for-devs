import type { InterviewStage } from './enums.js';

export interface StarParts {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface StarAnswerDto extends StarParts {
  fullAnswer: string | null;
  version: number;
  updatedAt: string;
}

export interface RehearsalDto {
  id: string;
  practicedAt: string;
  durationSec: number;
  selfScore: number;
  notes: string | null;
}

export interface InterviewQuestionDto {
  id: string;
  stage: InterviewStage;
  question: string;
  tags: string[];
  difficulty: number;
  hasAnswer: boolean;
  rehearsalCount: number;
  lastPracticedAt: string | null;
  averageScore: number | null;
}

export interface InterviewQuestionDetailDto extends InterviewQuestionDto {
  answer: StarAnswerDto | null;
  rehearsals: RehearsalDto[];
}

export const stageLabels: Record<InterviewStage, string> = {
  hr: 'HR screen',
  behavioral: 'Behavioral',
  technical: 'Technical',
  system_design: 'System design',
  closing: 'Closing',
};

/** Joins the STAR parts into one spoken answer, skipping empty parts. */
export function composeStarAnswer(parts: StarParts): string {
  return [parts.situation, parts.task, parts.action, parts.result]
    .map((p) => p.trim())
    .filter(Boolean)
    .join(' ');
}

/** Good spoken answers usually take between 1 and 3 minutes. */
export function answerLengthFeedback(durationSec: number): 'too_short' | 'good' | 'too_long' {
  if (durationSec < 60) return 'too_short';
  if (durationSec > 180) return 'too_long';
  return 'good';
}

export function formatDuration(totalSec: number): string {
  const min = Math.floor(totalSec / 60);
  const sec = Math.floor(totalSec % 60);
  return `${min}:${String(sec).padStart(2, '0')}`;
}
