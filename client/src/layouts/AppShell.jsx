import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * App Shell / Main Layout
 * 
 * Provides header, main content area, and footer.
 * Header includes navigation and logout button if authenticated.
 */
const AppShell = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-purple-600 hover:text-purple-700">
            SpendWise
          </Link>

          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                Welcome, <span className="font-medium">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition"
              >
                Logout
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium text-sm"
              >
                Register
              </Link>
            </div>
          )}
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

export default AppShell;
