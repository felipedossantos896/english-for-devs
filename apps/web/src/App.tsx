import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/app-shell';
import { StyleguidePage } from '@/features/styleguide/StyleguidePage';
import { DeckPage } from '@/features/flashcards/DeckPage';
import { DecksPage } from '@/features/flashcards/DecksPage';
import { ReviewPage } from '@/features/flashcards/ReviewPage';
import { InterviewPage } from '@/features/interview/InterviewPage';
import { QuestionPage } from '@/features/interview/QuestionPage';
import { PhasesPage } from '@/features/phases/PhasesPage';
import { RoutinePage } from '@/features/routine/RoutinePage';

export function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<RoutinePage />} />
          <Route path="/cards" element={<DecksPage />} />
          <Route path="/cards/decks/:deckId" element={<DeckPage />} />
          <Route path="/cards/review" element={<ReviewPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/interview/:questionId" element={<QuestionPage />} />
          <Route path="/phases" element={<PhasesPage />} />
          <Route path="/ui" element={<StyleguidePage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
