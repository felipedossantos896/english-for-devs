import { PhasesPage } from './features/phases/PhasesPage';

export function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <h1 className="text-xl font-semibold">English for Devs</h1>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <PhasesPage />
      </main>
    </div>
  );
}
