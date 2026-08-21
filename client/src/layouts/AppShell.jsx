/**
 * Minimal app shell used to confirm the frontend foundation works.
 * This is intentionally simple — the real layout (nav, sidebar, etc.)
 * will be built in a later phase alongside authentication and routing.
 */
const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <span className="text-xl font-semibold text-emerald-600">SpendWise</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 text-sm text-slate-400 text-center">
          SpendWise &mdash; personal finance, made simple.
        </div>
      </footer>
    </div>
  );
};

export default AppShell;
