import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-2">
            <span className="text-2xl">💰</span>
            SpendWise
          </Link>
          <p className="text-sm text-slate-600">
            Manage your finances with ease
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
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

export default AuthLayout;
