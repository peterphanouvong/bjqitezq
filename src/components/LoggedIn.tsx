import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useCallback } from 'react';

export default function LoggedIn() {
  const { user, logout, isLoading } = useKindeAuth();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      <header className="flex-shrink-0 text-center pt-16 pb-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Welcome back!
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            {user?.name || user?.email || "User"}
          </p>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <div className="w-8 h-8 bg-white rounded-full shadow-inner"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Ready to Play?
            </h2>
            <p className="text-gray-600 mb-6">
              Challenge yourself or friends to an exciting game of Connect 4
            </p>
            <button 
              type="button"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Game
            </button>
          </div>
        </div>
      </main>

      <footer className="flex-shrink-0 text-center pb-8 px-4">
        <button
          type="button"
          onClick={handleLogout}
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      </footer>
    </div>
  );
}