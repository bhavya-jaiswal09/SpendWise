import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses } from '../services/expenseService';
import { getBudgets } from '../services/budgetService';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [period, setPeriod] = useState('current'); // 'current' or 'previous'

  useEffect(() => {
    const fetchAnalyticsData = async () => {
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
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);

  const monthInfo = useMemo(() => {
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // Calculate previous month
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;
    
    return {
      current: currentMonthStr,
      previous: prevMonthStr,
      currentLabel: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      previousLabel: prevDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
  }, []);

  const targetMonthStr = period === 'current' ? monthInfo.current : monthInfo.previous;

  // Filter data based on selected period
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      if (!e.date) return false;
      return new Date(e.date).toISOString().slice(0, 7) === targetMonthStr;
    });
  }, [expenses, targetMonthStr]);

  const filteredBudgets = useMemo(() => {
    return budgets.filter(b => b.month === targetMonthStr);
  }, [budgets, targetMonthStr]);

  // Calculations
  const totalSpending = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const numTransactions = filteredExpenses.length;
  const averageExpense = numTransactions > 0 ? totalSpending / numTransactions : 0;
  
  let largestExpense = 0;
  if (filteredExpenses.length > 0) {
    largestExpense = Math.max(...filteredExpenses.map(e => e.amount));
  }

  // Group by Category
  const categoryTotals = useMemo(() => {
    const totals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a);
  }, [filteredExpenses]);

  // Group by Week for Trend
  const weeklyTrend = useMemo(() => {
    const weeks = { 'Week 1': 0, 'Week 2': 0, 'Week 3': 0, 'Week 4': 0, 'Week 5+': 0 };
    let maxWeekly = 0;
    
    filteredExpenses.forEach(expense => {
      const date = new Date(expense.date);
      const day = date.getDate();
      let weekLabel = 'Week 5+';
      
      if (day <= 7) weekLabel = 'Week 1';
      else if (day <= 14) weekLabel = 'Week 2';
      else if (day <= 21) weekLabel = 'Week 3';
      else if (day <= 28) weekLabel = 'Week 4';
      
      weeks[weekLabel] += expense.amount;
      if (weeks[weekLabel] > maxWeekly) maxWeekly = weeks[weekLabel];
    });
    
    return { data: Object.entries(weeks), max: maxWeekly };
  }, [filteredExpenses]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
          <p className="text-slate-600 mt-2">Insights into your spending habits</p>
        </div>
        <div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition bg-white text-slate-700 shadow-sm font-medium"
          >
            <option value="current">This Month ({monthInfo.currentLabel})</option>
            <option value="previous">Last Month ({monthInfo.previousLabel})</option>
          </select>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Total Spending</h3>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalSpending)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Transactions</h3>
            <p className="text-2xl font-bold text-slate-800">{numTransactions}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Average Expense</h3>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(averageExpense)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Largest Expense</h3>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(largestExpense)}</p>
          </div>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 py-16 px-4 text-center">
          <div className="w-16 h-16 bg-purple-50 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-1">No spending data yet</h3>
          <p className="text-slate-500 mb-6">There are no expenses recorded for this time period.</p>
          <Link
            to="/expenses"
            className="inline-flex items-center px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium shadow-sm"
          >
            Add Expense
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Spending Categories */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Spending by Category</h2>
            </div>
            <div className="p-6 flex-1">
              <div className="space-y-5">
                {categoryTotals.map(([category, amount], index) => {
                  const percentage = (amount / totalSpending) * 100;
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-slate-700 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          {category}
                        </span>
                        <div className="text-right">
                          <span className="text-slate-800 font-medium">{formatCurrency(amount)}</span>
                          <span className="text-slate-400 text-xs ml-2 w-8 inline-block text-right">{percentage.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div 
                          className="bg-purple-500 h-2.5 rounded-full transition-all" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Spending Trend (Weekly) */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Weekly Trend</h2>
              </div>
              <div className="p-6 pt-8">
                <div className="flex items-end justify-between h-40 gap-2">
                  {weeklyTrend.data.map(([week, amount]) => {
                    // Avoid division by zero
                    const heightPercent = weeklyTrend.max > 0 ? (amount / weeklyTrend.max) * 100 : 0;
                    return (
                      <div key={week} className="flex flex-col items-center flex-1 group">
                        <div className="relative w-full flex justify-center h-full items-end">
                          <div 
                            className="w-12 sm:w-16 bg-purple-200 rounded-t-md relative group-hover:bg-purple-300 transition-colors"
                            style={{ height: `${Math.max(heightPercent, 2)}%` }} // Minimum height for visibility
                          >
                            {amount > 0 && (
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                {formatCurrency(amount)}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-slate-500 mt-3">{week}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Budget vs Spending */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex-1">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Budget vs Actual</h2>
              </div>
              <div className="p-6">
                {filteredBudgets.length === 0 ? (
                  <div className="text-center text-slate-500 py-6">
                    <p className="mb-4">No budgets established for this period.</p>
                    <Link to="/budgets" className="text-purple-600 font-medium hover:underline">
                      Set up a budget
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredBudgets.map(budget => {
                      const usagePercentage = Math.min((budget.amountSpent / budget.limit) * 100, 100);
                      const isExceeded = budget.amountSpent >= budget.limit;
                      const isWarning = budget.warning && !isExceeded;
                      
                      let progressColor = 'bg-green-500';
                      if (isExceeded) progressColor = 'bg-red-500';
                      else if (isWarning) progressColor = 'bg-yellow-500';

                      return (
                        <div key={budget._id}>
                          <div className="flex justify-between items-end mb-1.5">
                            <span className="font-medium text-slate-700">{budget.category}</span>
                            <div className="text-right">
                              <span className={`font-semibold ${isExceeded ? 'text-red-600' : 'text-slate-800'}`}>
                                {formatCurrency(budget.amountSpent)}
                              </span>
                              <span className="text-slate-500 text-xs ml-1">
                                / {formatCurrency(budget.limit)}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div 
                              className={`${progressColor} h-2 rounded-full transition-all`} 
                              style={{ width: `${usagePercentage}%` }}
                            ></div>
                          </div>
                          {isExceeded && (
                            <p className="text-xs text-red-600 mt-1 font-medium text-right">
                              Over budget by {formatCurrency(Math.abs(budget.remaining))}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
