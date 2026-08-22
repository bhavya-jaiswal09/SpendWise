import { useAuth } from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-600 mt-2">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100">
          <div className="w-24 h-24 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-4xl font-bold shadow-sm">
            {getInitials(user?.name)}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-slate-500 mt-1">{user?.email}</p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Account Information</h3>
          
          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
              <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                {user?.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
              <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                {user?.email}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                Editing profile information (such as changing your name, email, or password) is not currently supported in this version.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 sm:p-10">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Account Actions</h3>
        <p className="text-slate-500 text-sm mb-6">Securely sign out of your SpendWise account.</p>
        
        <button
          onClick={handleLogout}
          disabled={loading}
          className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {loading ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
