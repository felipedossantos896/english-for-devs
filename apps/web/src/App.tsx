import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { DeckPage } from './features/flashcards/DeckPage';
import { DecksPage } from './features/flashcards/DecksPage';
import { ReviewPage } from './features/flashcards/ReviewPage';
import { InterviewPage } from './features/interview/InterviewPage';
import { QuestionPage } from './features/interview/QuestionPage';
import { PhasesPage } from './features/phases/PhasesPage';
import { RoutinePage } from './features/routine/RoutinePage';

const navItems = [
  { to: '/today', label: 'Today' },
  { to: '/cards', label: 'Flashcards' },
  { to: '/interview', label: 'Interview' },
  { to: '/phases', label: 'Phases' },
];

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-4">
            <h1 className="text-xl font-semibold">English for Devs</h1>
            <nav className="flex gap-4 text-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'font-medium text-indigo-600' : 'text-slate-500')}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route path="/today" element={<RoutinePage />} />
            <Route path="/cards" element={<DecksPage />} />
            <Route path="/cards/decks/:deckId" element={<DeckPage />} />
            <Route path="/cards/review" element={<ReviewPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/interview/:questionId" element={<QuestionPage />} />
            <Route path="/phases" element={<PhasesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
