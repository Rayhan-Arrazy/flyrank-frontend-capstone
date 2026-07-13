import { SettingsForm } from './components/settings/SettingsForm';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              FlyRank
            </p>
            <h1 className="text-lg font-semibold text-slate-900">Account Settings</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <SettingsForm />
      </main>
    </div>
  );
}

export default App;
