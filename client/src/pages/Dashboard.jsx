import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Welcome, {user?.name}!</h1>
        <p className="text-slate-600 mt-2">Here's an overview of your finances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">$0.00</p>
          <p className="text-xs text-slate-400 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">$0.00</p>
          <p className="text-xs text-slate-400 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-medium text-slate-600 mb-2">Balance</h3>
          <p className="text-3xl font-bold text-slate-800">$0.00</p>
          <p className="text-xs text-slate-400 mt-2">This month</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
            Add Expense
          </button>
          <button className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition text-sm font-medium">
            View Budgets
          </button>
          <button className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition text-sm font-medium">
            Analytics
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          💡 More features coming soon: expense tracking, budget management, analytics, and more!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
