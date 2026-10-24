import type { InterviewStage } from '@efd/shared';

interface StarterQuestion {
  stage: InterviewStage;
  question: string;
  tags?: string[];
  difficulty?: number;
}

/** Common questions for each stage of a developer interview. Difficulty goes from 1 (easy) to 3. */
export const starterQuestions: StarterQuestion[] = [
  { stage: 'hr', question: 'Tell me about yourself.', tags: ['pitch'] },
  { stage: 'hr', question: 'Why do you want to work here?', tags: ['motivation'] },
  { stage: 'hr', question: 'Why are you looking for a new job?', tags: ['motivation'] },
  { stage: 'hr', question: 'What are your salary expectations?', tags: ['negotiation'], difficulty: 2 },
  { stage: 'hr', question: 'Why do you want to work for an international company?', tags: ['motivation'] },
  { stage: 'behavioral', question: 'Describe a project you are proud of.', tags: ['impact'] },
  { stage: 'behavioral', question: 'Tell me about a time you disagreed with a teammate.', tags: ['conflict'], difficulty: 2 },
  { stage: 'behavioral', question: 'Tell me about a mistake you made and what you learned.', tags: ['failure'], difficulty: 2 },
  { stage: 'behavioral', question: 'Tell me about a time you had to meet a tight deadline.', tags: ['pressure'] },
  { stage: 'behavioral', question: 'Describe a time you had to learn a new technology quickly.', tags: ['learning'] },
  { stage: 'behavioral', question: 'Tell me about a time you received difficult feedback.', tags: ['feedback'], difficulty: 2 },
  { stage: 'technical', question: 'Walk me through how you would debug a slow API endpoint.', tags: ['debugging', 'performance'], difficulty: 2 },
  { stage: 'technical', question: 'Explain the difference between SQL and NoSQL databases.', tags: ['databases'] },
  { stage: 'technical', question: 'What happens when you type a URL into the browser?', tags: ['web'], difficulty: 2 },
  { stage: 'technical', question: 'How do you make sure your code is well tested?', tags: ['testing'] },
  { stage: 'technical', question: 'Explain how React decides when to re-render a component.', tags: ['react'], difficulty: 2 },
  { stage: 'system_design', question: 'How would you design a URL shortener?', tags: ['design'], difficulty: 3 },
  { stage: 'system_design', question: 'How would you scale an API that gets 10x more traffic?', tags: ['scaling'], difficulty: 3 },
  { stage: 'closing', question: 'Do you have any questions for us?', tags: ['questions'] },
  { stage: 'closing', question: 'When could you start?', tags: ['logistics'] },
];
