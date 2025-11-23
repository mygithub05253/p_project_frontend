/**
 * SignupPage.tsx
 * 
 * 유스케이스: UC-2 회원가입
 * 시퀀스: LandingPage/LoginPage -> SignupPage -> 회원가입 폼 입력 -> 약관 동의 확인 -> signup API 호출 -> 자동 로그인 -> 일기장 페이지로 이동
 * 
 * 주요 기능:
 * - 이메일, 비밀번호, 닉네임 입력
 * - 비밀번호 확인
 * - 약관 동의 (필수/선택)
 * - 회원가입 완료 후 자동 로그인
 */
import { useState } from 'react';
import { BookOpen, Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff } from 'lucide-react';
import { signup, TokenStorage } from '../../../services/authApi';
import { TermsAgreement } from './TermsAgreement';
import { termsData } from '../../../services/termsData';

interface SignupPageProps {
  onSignupSuccess: () => void; // 회원가입 성공 시 호출될 콜백 함수
  onBackToLogin: () => void; // 로그인 페이지로 돌아가기 버튼 클릭 시 호출될 콜백 함수
}

export function SignupPage({ onSignupSuccess, onBackToLogin }: SignupPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreements, setAgreements] = useState<{ [key: string]: boolean }>({});

  /**
   * 유스케이스: UC-2 회원가입
   * 시퀀스: 회원가입 폼 제출 -> 입력값 유효성 검사 -> 약관 동의 확인 -> signup API 호출 -> 자동 로그인 처리 -> 일기장 페이지로 이동
   * 
   * 사용자가 입력한 회원가입 정보를 검증하고
   * 회원가입 API를 호출하여 계정을 생성한 후
   * 자동으로 로그인 처리하여 일기장 페이지로 이동
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 입력 필드 유효성 검사
    if (!email.trim() || !password.trim() || !name.trim()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    
    // 비밀번호 일치 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    // 비밀번호 길이 확인
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    
    // 필수 약관 동의 확인
    const requiredTerms = termsData.filter(t => t.required);
    const allRequiredAgreed = requiredTerms.every(term => agreements[term.id]);
    
    if (!allRequiredAgreed) {
      setError('필수 약관에 모두 동의해주세요.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 회원가입 API 호출 (이메일을 username으로 사용)
      await signup({
        email,
        password,
        name,
      });
      
      // 회원가입 성공 시 자동 로그인 처리 (signup 함수 내부에서 토큰 저장)
      onSignupSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.');
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
        {/* Signup Card (Diary style) */}
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
                  <h2 className="text-2xl text-stone-800">회원가입</h2>
                  <p className="text-sm text-stone-600">
                    나만의 감정 일기를 시작하세요
                  </p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-xs text-stone-600 block mb-1.5">
                      이름
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="홍길동"
                        disabled={isLoading}
                        className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none text-stone-800 placeholder:text-stone-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

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
                        placeholder="최소 6자 이상"
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

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs text-stone-600 block mb-1.5">
                      비밀번호 확인
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호를 다시 입력하세요"
                        disabled={isLoading}
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none text-stone-800 placeholder:text-stone-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-stone-300 pt-4">
                    <p className="text-xs text-stone-600 mb-3">약관 동의</p>
                    <TermsAgreement 
                      agreements={agreements}
                      onAgreementChange={setAgreements}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-rose-100 border border-rose-300 rounded-lg">
                      <p className="text-xs text-rose-700">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        회원가입 중...
                      </>
                    ) : (
                      '회원가입'
                    )}
                  </button>
                </form>

                {/* Back to Login */}
                <button
                  onClick={onBackToLogin}
                  disabled={isLoading}
                  className="w-full py-2 text-sm text-stone-600 hover:text-stone-800 transition-colors disabled:opacity-50"
                >
                  ← 로그인으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}