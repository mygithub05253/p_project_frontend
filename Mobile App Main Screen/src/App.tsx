import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { DiaryBook } from './components/DiaryBook';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { TokenStorage } from './services/authApi';
import { LogOut, User } from 'lucide-react';

type AppState = 'landing' | 'login' | 'signup' | 'forgot-password' | 'diary';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    if (TokenStorage.hasValidToken()) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
        setAppState('diary');
      }
    }
  }, []);

  const handleOpenBook = () => {
    if (TokenStorage.hasValidToken()) {
      setAppState('diary');
    } else {
      setAppState('login');
    }
  };

  const handleLoginSuccess = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setAppState('diary');
  };

  const handleUserUpdate = (updatedUser: { name: string; email: string }) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    TokenStorage.clearTokens();
    localStorage.removeItem('user');
    setUser(null);
    setAppState('landing');
  };

  const handleBackToLanding = () => {
    setAppState('landing');
  };

  const handleGoToSignup = () => {
    setAppState('signup');
  };

  const handleGoToForgotPassword = () => {
    setAppState('forgot-password');
  };

  const handleBackToLogin = () => {
    setAppState('login');
  };

  // Landing page
  if (appState === 'landing') {
    return <LandingPage onOpenBook={handleOpenBook} />;
  }

  // Login page
  if (appState === 'login') {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        onBack={handleBackToLanding}
        onSignup={handleGoToSignup}
        onForgotPassword={handleGoToForgotPassword}
      />
    );
  }

  // Signup page
  if (appState === 'signup') {
    return (
      <SignupPage 
        onSignupSuccess={handleLoginSuccess} 
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  // Forgot Password page
  if (appState === 'forgot-password') {
    return (
      <ForgotPasswordPage 
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  // Diary page
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Wooden Desk Background */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1714973148365-6db2ef41d7c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBkZXNrJTIwdGV4dHVyZXxlbnwxfHx8fDE3NjM2MTI0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Wooden desk"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 to-stone-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full">
          <DiaryBook onUserUpdate={handleUserUpdate} onLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
}