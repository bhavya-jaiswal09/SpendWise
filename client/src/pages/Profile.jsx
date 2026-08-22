import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-600 mt-2">Manage your account and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Account Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Name</label>
            <p className="text-slate-800 mt-1">{user?.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Email</label>
            <p className="text-slate-800 mt-1">{user?.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">User ID</label>
            <p className="text-slate-800 font-mono text-sm mt-1">{user?.id}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Role</label>
            <p className="text-slate-800 mt-1">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {user?.role}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-sm text-slate-600">
          Additional profile features like password change, preferences, and notifications will be available in future phases.
        </p>
      </div>
    </div>
  );
};

export default Profile;
