import { useState } from 'react';
import { BookOpen, Mail, Lock, Loader2, Eye, EyeOff, Key } from 'lucide-react';
import { sendVerificationCode, resetPassword } from '../services/authApi';

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await sendVerificationCode({ email });
      setSuccess(response.message);
      setCodeSent(true);
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증 코드 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!verificationCode.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await resetPassword({
        email,
        code: verificationCode,
        newPassword,
      });
      
      setSuccess(response.message);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '비밀번호 재설정에 실패했습니다.');
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
        {/* Card */}
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
                  <h2 className="text-2xl text-stone-800">비밀번호 찾기</h2>
                  <p className="text-sm text-stone-600">
                    {step === 'email' 
                      ? '가입 시 사용한 이메일을 입력하세요'
                      : '인증 코드와 새 비밀번호를 입력하세요'}
                  </p>
                </div>

                {/* Step 1: Email Input */}
                {step === 'email' && (
                  <form onSubmit={handleSendCode} className="space-y-4">
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

                    {/* Error/Success Message */}
                    {error && (
                      <div className="p-3 bg-rose-100 border border-rose-300 rounded-lg">
                        <p className="text-xs text-rose-700">{error}</p>
                      </div>
                    )}
                    {success && (
                      <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
                        <p className="text-xs text-green-700">{success}</p>
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
                          발송 중...
                        </>
                      ) : (
                        '인증 코드 발송'
                      )}
                    </button>
                  </form>
                )}

                {/* Step 2: Verification & Password Reset */}
                {step === 'verify' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {/* Email (read-only) */}
                    <div>
                      <label className="text-xs text-stone-600 block mb-1.5">
                        이메일
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-stone-100 border border-stone-300 rounded-lg text-stone-600 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Verification Code */}
                    <div>
                      <label className="text-xs text-stone-600 block mb-1.5">
                        인증 코드
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="이메일로 받은 6자리 코드"
                          disabled={isLoading}
                          maxLength={6}
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none text-stone-800 placeholder:text-stone-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="text-xs text-stone-600 block mb-1.5">
                        새 비밀번호
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="최소 6자 이상"
                          disabled={isLoading}
                          className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none text-stone-800 placeholder:text-stone-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="text-xs text-stone-600 block mb-1.5">
                        새 비밀번호 확인
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

                    {/* Error/Success Message */}
                    {error && (
                      <div className="p-3 bg-rose-100 border border-rose-300 rounded-lg">
                        <p className="text-xs text-rose-700">{error}</p>
                      </div>
                    )}
                    {success && (
                      <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
                        <p className="text-xs text-green-700">{success}</p>
                        <p className="text-xs text-green-600 mt-1">로그인 페이지로 이동합니다...</p>
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-800">
                        💡 인증 코드는 5분간 유효합니다.<br />
                        이메일을 확인해주세요. (콘솔 로그 확인)
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
                          변경 중...
                        </>
                      ) : (
                        '비밀번호 변경'
                      )}
                    </button>

                    {/* Resend Code */}
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={isLoading}
                      className="w-full text-sm text-stone-600 hover:text-stone-800 transition-colors disabled:opacity-50"
                    >
                      인증 코드 재발송
                    </button>
                  </form>
                )}

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
