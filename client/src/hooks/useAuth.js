import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';

/**
 * useAuth Hook
 * 
 * Provides easy access to authentication state and actions.
 * 
 * Usage:
 * const { user, isAuthenticated, logout } = useAuth();
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(logoutUser());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout,
  };
};

export default useAuth;
