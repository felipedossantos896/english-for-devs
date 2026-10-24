import type {
  InterviewQuestionDetailDto,
  InterviewQuestionDto,
  InterviewStage,
  StarParts,
} from '@efd/shared';
import { api } from '../../lib/api';

export interface QuestionInput {
  stage: InterviewStage;
  question: string;
  tags?: string[];
  difficulty?: number;
}

export interface RehearsalInput {
  durationSec: number;
  selfScore: number;
  notes?: string | null;
}

const json = (method: string, body: unknown) => ({ method, body: JSON.stringify(body) });

export const interviewApi = {
  list: (stage?: InterviewStage) =>
    api<InterviewQuestionDto[]>(`/interview/questions${stage ? `?stage=${stage}` : ''}`),
  get: (id: string) => api<InterviewQuestionDetailDto>(`/interview/questions/${id}`),
  create: (input: QuestionInput) =>
    api<InterviewQuestionDetailDto>('/interview/questions', json('POST', input)),
  remove: (id: string) => api<void>(`/interview/questions/${id}`, { method: 'DELETE' }),
  saveAnswer: (id: string, answer: StarParts & { fullAnswer: string | null }) =>
    api<InterviewQuestionDetailDto>(`/interview/questions/${id}/answer`, json('PUT', answer)),
  addRehearsal: (id: string, input: RehearsalInput) =>
    api<InterviewQuestionDetailDto>(`/interview/questions/${id}/rehearsals`, json('POST', input)),
};
