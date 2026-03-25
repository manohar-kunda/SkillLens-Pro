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

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  // Silent ping on primary load to wake up Render backend from cold-start
  React.useEffect(() => {
    api.get('/health').catch(() => {});
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

const AppContent = () => {
  const { pathname } = useLocation();
  const authRoutes = ['/login', '/register'];
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
