import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { restoreSession } from './store/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isInitializing, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Auth Routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthLayout><Landing /></AuthLayout>
          } 
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthLayout><Login /></AuthLayout>
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthLayout><Register /></AuthLayout>
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute element={<DashboardLayout><Expenses /></DashboardLayout>} />
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute element={<DashboardLayout><Budgets /></DashboardLayout>} />
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute element={<DashboardLayout><Analytics /></DashboardLayout>} />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute element={<DashboardLayout><Profile /></DashboardLayout>} />
          }
        />
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
