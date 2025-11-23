/**
 * App.tsx
 * 
 * 유스케이스: UC-01 애플리케이션 초기화 및 라우팅
 * 시퀀스: 사용자 -> App -> LandingPage/LoginPage/DiaryBook
 * 
 * 주요 기능:
 * - 애플리케이션 전역 상태 관리 (appState, user)
 * - 페이지 라우팅 및 상태 전환 (랜딩, 로그인, 회원가입, 비밀번호 찾기, 일기장)
 * - 인증 토큰 검증 및 자동 로그인 처리
 * - 사용자 정보 관리 및 전달
 */
import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './components/features/auth/LoginPage';
import { SignupPage } from './components/features/auth/SignupPage';
import { ForgotPasswordPage } from './components/features/auth/ForgotPasswordPage';
import { DiaryBook } from './components/features/diary/DiaryBook';
import { ImageWithFallback } from './components/shared/ImageWithFallback';
import { TokenStorage } from './services/authApi';
import { LogOut, User } from 'lucide-react';
import './App.css';

type AppState = 'landing' | 'login' | 'signup' | 'forgot-password' | 'diary';

export default function App() {
  // 애플리케이션 현재 상태 (랜딩, 로그인, 회원가입, 비밀번호 찾기, 일기장)
  const [appState, setAppState] = useState<AppState>('landing');
  // 현재 로그인한 사용자 정보
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  /**
   * 유스케이스: UC-02 자동 로그인 처리
   * 시퀀스: App 마운트 -> TokenStorage 검증 -> 사용자 정보 로드 -> 일기장 화면 전환
   * 
   * 컴포넌트 마운트 시 실행되어 저장된 인증 토큰을 확인하고
   * 유효한 토큰이 있으면 사용자 정보를 로드하여 일기장 화면으로 이동
   */
  useEffect(() => {
    if (TokenStorage.hasValidToken()) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
        setAppState('diary');
      }
    }
  }, []);

  /**
   * 유스케이스: UC-03 일기장 열기
   * 시퀀스: 사용자 클릭 -> App -> 토큰 검증 -> 일기장/로그인 화면 전환
   * 
   * 랜딩 페이지에서 일기장 열기 버튼 클릭 시
   * 인증 토큰 유무에 따라 일기장 또는 로그인 화면으로 이동
   */
  const handleOpenBook = () => {
    if (TokenStorage.hasValidToken()) {
      setAppState('diary');
    } else {
      setAppState('login');
    }
  };

  /**
   * 유스케이스: UC-04 로그인 성공 처리
   * 시퀀스: LoginPage -> login API 호출 -> 토큰 저장 -> App -> 사용자 정보 로드 -> 일기장 화면 전환
   * 
   * 로그인 또는 회원가입 성공 시 호출되어
   * 사용자 정보를 로드하고 일기장 화면으로 전환
   */
  const handleLoginSuccess = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setAppState('diary');
  };

  /**
   * 유스케이스: UC-05 사용자 정보 업데이트
   * 시퀀스: MyPage -> updateProfile API 호출 -> App -> 사용자 정보 갱신
   * 
   * 프로필 수정 시 호출되어 App의 사용자 정보 상태를 업데이트
   */
  const handleUserUpdate = (updatedUser: { name: string; email: string }) => {
    setUser(updatedUser);
  };

  /**
   * 유스케이스: UC-06 로그아웃
   * 시퀀스: DiaryBook -> App -> 토큰 삭제 -> 사용자 정보 삭제 -> 랜딩 화면 전환
   * 
   * 로그아웃 시 저장된 인증 토큰과 사용자 정보를 삭제하고
   * 랜딩 페이지로 이동
   */
  const handleLogout = () => {
    TokenStorage.clearTokens();
    localStorage.removeItem('user');
    setUser(null);
    setAppState('landing');
  };

  /**
   * 유스케이스: UC-07 계정 삭제 처리
   * 시퀀스: MyPage -> deleteAccount API 호출 -> App -> 토큰 삭제 -> 사용자 정보 삭제 -> 랜딩 화면 전환
   * 
   * 계정 삭제 시 호출되어 모든 인증 정보를 삭제하고
   * 랜딩 페이지로 이동
   */
  const handleAccountDeleted = () => {
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
    <div className="diary-app-container">
      {/* Wooden Desk Background */}
      <div className="diary-app-background">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1714973148365-6db2ef41d7c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBkZXNrJTIwdGV4dHVyZXxlbnwxfHx8fDE3NjM2MTI0NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Wooden desk"
          className="diary-app-background-image"
        />
        <div className="diary-app-background-overlay" />
      </div>

      {/* Content */}
      <div className="diary-app-content">
        <div className="diary-app-content-inner">
          <DiaryBook 
            onUserUpdate={handleUserUpdate} 
            onLogout={handleLogout}
            onAccountDeleted={handleAccountDeleted}
          />
        </div>
      </div>
    </div>
  );
}