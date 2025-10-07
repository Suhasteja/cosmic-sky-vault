
// Main App component with authentication routing
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { RecipesPage } from './pages/RecipesPage';
import { ProfilePage } from './pages/ProfilePage';
import { Loader2, ChefHat, User, Home } from 'lucide-react';
import { Button } from './components/ui/button';

// Navigation component
const Navigation: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <ChefHat className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">FlavorHub</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" asChild>
                <a href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Recipes
                </a>
              </Button>
              {currentUser && (
                <Button variant="ghost" asChild>
                  <a href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUser ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button asChild>
                <a href="/auth">Login</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main app content with routing
const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  // Show loading spinner while checking authentication state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading FlavorHub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<RecipesPage />} />
          <Route 
            path="/profile" 
            element={currentUser ? <ProfilePage /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/auth" 
            element={!currentUser ? <AuthPage /> : <Navigate to="/" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App component
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <AppContent />
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
