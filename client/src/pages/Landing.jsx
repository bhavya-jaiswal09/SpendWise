import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="text-center max-w-lg w-full px-4">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
          SpendWise
        </h1>
        <p className="text-xl text-slate-600 mb-2">
          Personal finance made simple.
        </p>
        <p className="text-slate-500 text-sm sm:text-base">
          Track your expenses, manage your budgets, and take control of your financial future.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
        <Link
          to="/register"
          className="w-full sm:w-auto px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-sm"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="w-full sm:w-auto px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition font-medium shadow-sm"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Landing;
