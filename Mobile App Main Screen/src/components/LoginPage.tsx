import { useState } from 'react';
import { BookOpen, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { login, TokenStorage } from '../services/authApi';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
  onSignup: () => void;
  onForgotPassword: () => void;
}

export function LoginPage({ onLoginSuccess, onBack, onSignup, onForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await login({ email, password });
      
      // Store tokens in localStorage
      TokenStorage.setTokens(response.accessToken, response.refreshToken);
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Success
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 flex items-center justify-center p-4">
      {/* Wooden desk background */}
      <div 
        className="fixed inset-0 opacity-40"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1551622541-af8e8e10c87e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Login Card (Diary style) */}
        <div className="relative">
          {/* Card shadow */}
          <div className="absolute inset-0 bg-black/40 blur-3xl translate-y-6 rounded-2xl" />
          
          {/* Card */}
          <div className="relative bg-gradient-to-br from-amber-800 via-amber-900 to-stone-900 rounded-2xl p-1 shadow-2xl">
            {/* Leather texture */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1716295177956-420a647c83ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYnJvd24lMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzYxMjQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080)',
                backgroundSize: 'cover',
              }}
            />
            
            <div className="relative bg-amber-50 rounded-xl p-8">
              {/* Paper texture */}
              <div 
                className="absolute inset-0 opacity-30 rounded-xl pointer-events-none"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1719563015025-83946fb49e49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBwYXBlciUyMHRleHR1cmV8ZW58MXx8fHwxNzYzNTI2MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080)',
                  backgroundSize: 'cover',
                }}
              />
              
              <div className="relative space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <BookOpen className="w-12 h-12 mx-auto text-amber-700" />
                  <h2 className="text-2xl text-stone-800">로그인</h2>
                  <p className="text-sm text-stone-600">
                    일기장을 열기 위해 로그인하세요
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="text-xs text-stone-600 block mb-1.5">
                      이메일
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        disabled={isLoading}
                        className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none text-stone-800 placeholder:text-stone-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs text-stone-600 block mb-1.5">
                      비밀번호
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        disabled={isLoading}
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none text-stone-800 placeholder:text-stone-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-rose-100 border border-rose-300 rounded-lg">
                      <p className="text-xs text-rose-700">{error}</p>
                    </div>
                  )}

                  {/* Demo Info */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-800">
                      <strong>테스트 계정:</strong><br />
                      이메일: test@example.com<br />
                      비밀번호: password123
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        로그인 중...
                      </>
                    ) : (
                      '로그인'
                    )}
                  </button>
                </form>

                {/* Forgot Password Link */}
                <div className="text-center">
                  <button
                    onClick={onForgotPassword}
                    disabled={isLoading}
                    className="text-sm text-amber-700 hover:text-amber-800 transition-colors disabled:opacity-50"
                  >
                    비밀번호를 잊으셨나요?
                  </button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-300" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-amber-50 px-2 text-stone-500">또는</span>
                  </div>
                </div>

                {/* Signup Link */}
                <button
                  onClick={onSignup}
                  disabled={isLoading}
                  className="w-full py-3 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed text-stone-700 rounded-lg transition-colors"
                >
                  회원가입
                </button>

                {/* Back Button */}
                <button
                  onClick={onBack}
                  disabled={isLoading}
                  className="w-full py-2 text-sm text-stone-600 hover:text-stone-800 transition-colors disabled:opacity-50"
                >
                  ← 뒤로 가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}