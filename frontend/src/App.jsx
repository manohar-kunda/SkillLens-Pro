/**
 * -----------------------------------------------------------------------------
 * File: App.jsx
 * Component: React Root Layout & Client-Side Router
 * Purpose: Anchors global state context wrapper providers and coordinates 
 *          declarative routing pathways using `react-router-dom`.
 *
 * Responsibilities:
 * - Mount and orchestrate `AuthProvider` and `ThemeProvider` globally.
 * - Establish client-side single-page-application (SPA) navigation trees.
 * - Enforce route guards (`ProtectedRoute`) redirecting unauthenticated users to `/login`.
 * - Mitigate cold-start latency of hosting infrastructure (Render/Heroku free tiers) 
 *   by firing concurrent silent background ping requests to backend services during bootstrap.
 * - Implement smart UI overrides, hiding floating widgets (such as the AI ChatAssistant) 
 *   on space-critical pages (like the multi-pane ResumeBuilder).
 *
 * Author: Manohar Kunda
 * -----------------------------------------------------------------------------
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MockInterview from './pages/MockInterview';
import AdminDashboard from './pages/AdminDashboard';
import CurriculumView from './pages/CurriculumView';
import Profile from './pages/Profile';
import VoiceInterview from './pages/VoiceInterview';
import QuizList from './pages/QuizList';
import ResumeBuilder from './pages/ResumeBuilder';
import Navbar from './components/Navbar';
import ChatAssistant from './components/ChatAssistant';
import { api } from './services/authService';

import { ThemeProvider } from './context/ThemeContext';

/**
 * Access guard component intercepting protected view allocations.
 * Verifies if user profiles are present, redirecting unauthorized navigations to login blocks.
 *
 * @param {Object} props - React props.
 * @param {React.ReactNode} props.children - Secured component tree node.
 * @returns {React.ReactElement} Active layout or route redirection block.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/**
 * Main Application bootstrapper.
 * Establishes context boundaries and triggers silent cold-start wakeups.
 *
 * @returns {React.ReactElement} Structured root context layouts.
 */
function App() {
  // Side-effect: Sends background pings to both Node.js and Python FastAPI health services
  // This mitigates the typical 30-50s cold-start latency of free-tier hosting (Render)
  React.useEffect(() => {
    const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || '';
    api.get('/health').catch(() => {});
    if (AI_SERVICE_URL) {
      fetch(`${AI_SERVICE_URL}/health`).catch(() => {});
    }
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

/**
 * Secondary layout router component that consumes route parameters.
 * Manages standard header inclusions and controls the float chat widgets displays.
 *
 * @returns {React.ReactElement} Sub-layout route switcher views.
 */
const AppContent = () => {
  const { pathname } = useLocation();
  const authRoutes = ['/login', '/register'];
  
  // Hide the AI floating assistant on layout-heavy panels to preserve visual canvas space
  const hideChat = pathname.startsWith('/resume-builder') || authRoutes.includes(pathname);

  return (
    <>
      <Navbar />
      {!hideChat && <ChatAssistant />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
        />
        <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
        />
        <Route 
            path="/quizzes" 
            element={
              <ProtectedRoute>
                <QuizList />
              </ProtectedRoute>
            } 
        />
        <Route 
            path="/resume-builder" 
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            } 
        />
        <Route 
            path="/interview" 
            element={
              <ProtectedRoute>
                <MockInterview />
              </ProtectedRoute>
            } 
        />
        <Route 
            path="/ai-interview" 
            element={
              <ProtectedRoute>
                <VoiceInterview />
              </ProtectedRoute>
            } 
        />
        <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
        />
        <Route 
            path="/curriculum/:roleName" 
            element={
              <ProtectedRoute>
                <CurriculumView />
              </ProtectedRoute>
            } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
