import { useAuth } from '../hooks/useAuth';

/**
 * Protected Test Page
 * 
 * This page verifies that the protected routing and authentication works.
 * It should only be accessible by authenticated users.
 * This is temporary and will be removed when real application pages are built.
 */
const ProtectedTest = () => {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-2xl px-4">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Protected Route Test</h1>
        <p className="text-slate-600 mb-6">
          If you can see this page, you are successfully authenticated!
        </p>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Your Authentication Details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-slate-600">User ID</dt>
              <dd className="text-slate-800 font-mono bg-white p-2 rounded border border-slate-200 mt-1">
                {user?.id}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600">Name</dt>
              <dd className="text-slate-800 bg-white p-2 rounded border border-slate-200 mt-1">
                {user?.name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600">Email</dt>
              <dd className="text-slate-800 bg-white p-2 rounded border border-slate-200 mt-1">
                {user?.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-600">Role</dt>
              <dd className="text-slate-800 bg-white p-2 rounded border border-slate-200 mt-1">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {user?.role}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
          <p className="font-semibold mb-2">Development Note</p>
          <p>
            This page confirms that JWT authentication is working. It will be removed when
            real application pages (Dashboard, Transactions, etc.) are built in future phases.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProtectedTest;
