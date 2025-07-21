
// Main App component with authentication routing
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Loader2 } from 'lucide-react';

// Protected route component that requires authentication
const ProtectedApp: React.FC = () => {
  const { currentUser, loading } = useAuth();

  // Show loading spinner while checking authentication state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading SkyCloud...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if user is authenticated, otherwise show auth page
  return currentUser ? <Dashboard /> : <AuthPage />;
};

// Main App component
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <ProtectedApp />
          {/* Toast notification system */}
          <Toaster 
            position="top-right"
            richColors
            closeButton
            expand={false}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
