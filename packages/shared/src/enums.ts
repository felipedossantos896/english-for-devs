export const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
export type CefrLevel = (typeof cefrLevels)[number];

export const phaseStatuses = ['locked', 'active', 'done'] as const;
export type PhaseStatus = (typeof phaseStatuses)[number];

export const deckLayers = ['vocabulary', 'phrases', 'tech', 'interview'] as const;
export type DeckLayer = (typeof deckLayers)[number];

export const interviewStages = ['hr', 'behavioral', 'technical', 'system_design', 'closing'] as const;
export type InterviewStage = (typeof interviewStages)[number];
