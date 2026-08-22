import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getExpenses } from '../services/expenseService';
import { getBudgets } from '../services/budgetService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [expensesRes, budgetsRes] = await Promise.all([
          getExpenses(),
          getBudgets()
        ]);
        
        setExpenses(expensesRes.data.data.expenses || expensesRes.data.data || []);
        setBudgets(budgetsRes.data.data.budgets || budgetsRes.data.data || []);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const getCurrentMonthStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const currentMonthStr = getCurrentMonthStr();
  
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonthStr);
  const currentMonthExpenses = expenses.filter(e => {
    if (!e.date) return false;
    const expenseMonth = new Date(e.date).toISOString().slice(0, 7);
    return expenseMonth === currentMonthStr;
  });

  const totalExpenses = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = currentMonthBudgets.reduce((sum, b) => sum + b.limit, 0);
  const remainingBudget = totalBudget - totalExpenses;

  const recentExpenses = [...expenses].slice(0, 5);

  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Good morning, {user?.name}!</h1>
        <p className="text-slate-600 mt-2">Here's your financial overview for this month.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-slate-800">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-slate-400 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Total Budget</h3>
          <p className="text-3xl font-bold text-slate-800">{formatCurrency(totalBudget)}</p>
          <p className="text-xs text-slate-400 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Remaining Budget</h3>
          <p className={`text-3xl font-bold ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(remainingBudget)}
          </p>
          <p className="text-xs text-slate-400 mt-2">This month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">Recent Expenses</h2>
            <Link to="/expenses" className="text-sm font-medium text-purple-600 hover:text-purple-700">
              View all
            </Link>
          </div>
          <div className="p-0 flex-1">
            {recentExpenses.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                No recent expenses.
                <div className="mt-4">
                  <button onClick={() => navigate('/expenses')} className="text-purple-600 font-medium hover:underline">
                    Add your first expense
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentExpenses.map(expense => (
                  <div key={expense._id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">{expense.title}</span>
                      <div className="flex items-center text-xs text-slate-500 mt-1 gap-2">
                        <span>{formatDate(expense.date)}</span>
                        <span>•</span>
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{expense.category}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-slate-800">
                      -{formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Spending by Category</h2>
              <p className="text-xs text-slate-500 mt-1">This month</p>
            </div>
            <div className="p-6">
              {sortedCategories.length === 0 ? (
                <div className="text-center text-slate-500 py-4">No spending data yet.</div>
              ) : (
                <div className="space-y-4">
                  {sortedCategories.map(([category, amount]) => {
                    const percentage = Math.min((amount / totalExpenses) * 100, 100);
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700">{category}</span>
                          <span className="text-slate-600">{formatCurrency(amount)}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex-1">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Budget Overview</h2>
              <Link to="/budgets" className="text-sm font-medium text-purple-600 hover:text-purple-700">
                View all
              </Link>
            </div>
            <div className="p-6">
              {currentMonthBudgets.length === 0 ? (
                <div className="text-center text-slate-500 py-4">
                  No budgets set for this month.
                  <div className="mt-4">
                    <button onClick={() => navigate('/budgets')} className="text-purple-600 font-medium hover:underline">
                      Set a budget
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {currentMonthBudgets.slice(0, 3).map(budget => {
                    const usagePercentage = Math.min((budget.amountSpent / budget.limit) * 100, 100);
                    const isExceeded = budget.amountSpent >= budget.limit;
                    const isWarning = budget.warning && !isExceeded;
                    
                    let progressColor = 'bg-green-500';
                    if (isExceeded) progressColor = 'bg-red-500';
                    else if (isWarning) progressColor = 'bg-yellow-500';

                    return (
                      <div key={budget._id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700 flex items-center gap-1.5">
                            {budget.category}
                            {isExceeded && (
                              <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            )}
                          </span>
                          <span className="text-slate-600 text-xs">
                            {formatCurrency(budget.amountSpent)} of {formatCurrency(budget.limit)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className={`${progressColor} h-2 rounded-full transition-all`} 
                            style={{ width: `${usagePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
