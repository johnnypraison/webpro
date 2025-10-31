import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import * as api from './api';

// Pages
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import LoginFailurePage from './pages/LoginFailurePage';

/**
 * A wrapper to show a loading spinner while checking auth.
 */
function LoadingScreen() {
  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="spinner-border text-yellow" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

/**
 * This component handles all the routing logic.
 */
function AppRoutes() {
  const [auth, setAuth] = useState({ user: null, isLoading: true });
  const location = useLocation();

  useEffect(() => {
    // Check auth status on initial load
    api.checkAuthStatus()
      .then((res) => {
        setAuth({ user: res, isLoading: false });
      })
      .catch(() => {
        setAuth({ user: null, isLoading: false });
      });
  }, []);

  if (auth.isLoading) {
    return <LoadingScreen />;
  }

  // --- Protected Route Logic ---

  // 1. If user is NOT logged in
  if (!auth.user) {
    // This logic allows both /login and /login-failure
    // for unauthenticated users. All other paths redirect to /login.
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-failure" element={<LoginFailurePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 2. If user IS logged in but profile is NOT complete
  if (auth.user && !auth.user.profileCompleted) {
    // Force user to /profile page
    if (location.pathname !== '/profile') {
      return <Navigate to="/profile" replace />;
    }
    return (
      <Routes>
        <Route path="/profile" element={<ProfilePage setAuth={setAuth} />} />
        {/* Redirect all other paths to /profile */}
        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    );
  }

  // 3. If user IS logged in AND profile IS complete
  // User is fully authenticated.
  return (
    <Routes>
      <Route path="/" element={<HomePage auth={auth} setAuth={setAuth} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * Main App component.
 */
function App() {
  return (
    // This is the correct setup for Vercel deployment.
    // The <BrowserRouter> tag does NOT have a "basename" prop,
    // which is what we want.
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
app.listen(3000, () => console.log("Server running on http://localhost:3000"));

export default App;
