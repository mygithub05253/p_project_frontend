/**
 * MyPage.tsx
 * 
 * 유스케이스: UC-19 프로필 관리, UC-20 계정 삭제
 * 시퀀스: DiaryBook -> MyPage -> getCurrentUser API 호출 -> 사용자 정보 표시 -> 프로필 수정/비밀번호 변경/계정 삭제 처리
 * 
 * 주요 기능:
 * - 사용자 정보 조회 및 표시
 * - 닉네임 수정 (UC-19-1)
 * - 비밀번호 변경 (UC-19-2)
 * - 알림 설정 변경 (UC-19-3)
 * - 계정 삭제 (UC-20)
 * - 지원 리소스 페이지로 이동
 */
import { useState, useEffect } from 'react';
import { User, Mail, Lock, Bell, BellOff, Trash2, Save, Eye, EyeOff, AlertCircle, Check, Heart, Edit2, UserX, Loader2, X } from 'lucide-react';
import { getCurrentUser, updateProfile, changePassword, updateNotification, deleteAccount } from '../../../services/authApi';
import type { User as UserType } from '../../../services/authApi';

interface MyPageProps {
  onBack: () => void;
  onUserUpdate: (user: { name: string; email: string }) => void;
  onAccountDeleted: () => void;
  onGoToSupport?: () => void;
}

type EditMode = 'none' | 'nickname' | 'password';

export function MyPage({ onBack, onUserUpdate, onAccountDeleted, onGoToSupport }: MyPageProps) {
  // 현재 사용자 정보
  const [user, setUser] = useState<UserType | null>(null);
  // API 호출 중 여부
  const [isLoading, setIsLoading] = useState(true);
  // 편집 모드 (없음, 닉네임, 비밀번호)
  const [editMode, setEditMode] = useState<EditMode>('none');
  // 에러 메시지
  const [error, setError] = useState('');
  // 성공 메시지
  const [success, setSuccess] = useState('');
  // 계정 삭제 확인 모달 표시 여부
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // 닉네임 편집 입력값
  const [newNickname, setNewNickname] = useState('');
  
  // 비밀번호 변경 입력값
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  /**
   * 유스케이스: UC-19 사용자 정보 조회
   * 시퀀스: MyPage 마운트 -> getCurrentUser API 호출 -> 사용자 정보 수신 -> 화면에 표시
   * 
   * 컴포넌트 마운트 시 현재 로그인한 사용자의 정보를 조회하여 표시
   */
  useEffect(() => {
    loadUserInfo();
  }, []);

  /**
   * 사용자 정보 로드
   */
  const loadUserInfo = async () => {
    setIsLoading(true);
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setNewNickname(userData.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : '사용자 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 유스케이스: UC-19-1 닉네임 수정
   * 시퀀스: 닉네임 편집 모드 활성화 -> 새 닉네임 입력 -> updateProfile API 호출 -> 사용자 정보 업데이트 -> App에 변경사항 전달
   * 
   * 사용자가 입력한 새 닉네임으로 프로필을 업데이트하고
   * App 컴포넌트에 변경사항을 전달하여 전역 상태를 갱신
   */
  const handleUpdateNickname = async () => {
    if (!newNickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const updatedUser = await updateProfile({ name: newNickname });
      setUser(updatedUser);
      setEditMode('none');
      setSuccess('닉네임이 성공적으로 변경되었습니다.');
      // App 컴포넌트에 변경사항 전달
      onUserUpdate({ name: updatedUser.name, email: updatedUser.email });
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '닉네임 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 유스케이스: UC-19-2 비밀번호 변경
   * 시퀀스: 비밀번호 변경 모드 활성화 -> 현재 비밀번호/새 비밀번호 입력 -> changePassword API 호출 -> 비밀번호 변경 완료
   * 
   * 사용자가 입력한 현재 비밀번호를 검증하고
   * 새 비밀번호로 변경
   */
  const handleChangePassword = async () => {
    setError('');
    setSuccess('');
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('새 비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await changePassword({ currentPassword, newPassword });
      setSuccess(response.message);
      setEditMode('none');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotification = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const updatedUser = await updateNotification({ 
        alertPush: !user.notificationEnabled,
        alertEmail: !user.notificationEnabled,
      });
      setUser(updatedUser);
      setSuccess(
        updatedUser.notificationEnabled 
          ? '알림이 활성화되었습니다.' 
          : '알림이 비활성화되었습니다.'
      );
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알림 설정 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode('none');
    setError('');
    if (user) {
      setNewNickname(user.name);
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await deleteAccount();
      // Redirect to landing page
      onAccountDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : '계정 탈퇴에 실패했습니다.');
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-stone-600">사용자 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left Page */}
      <div className="flex-1 relative">
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none rounded-l-lg"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1719563015025-83946fb49e49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBwYXBlciUyMHRleHR1cmV8ZW58MXx8fHwxNzYzNTI2MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative p-8 h-full overflow-y-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 pb-4 border-b border-stone-300">
              <User className="w-12 h-12 mx-auto text-amber-700" />
              <h2 className="text-2xl text-stone-800">마이페이지</h2>
              <p className="text-sm text-stone-600">내 정보를 관리하세요</p>
            </div>

            {/* Messages */}
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

            {/* User ID */}
            <div>
              <label className="text-xs text-stone-500 block mb-2">아이디 (이메일)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Nickname */}
            <div>
              <label className="text-xs text-stone-500 block mb-2">닉네임</label>
              {editMode === 'nickname' ? (
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                      placeholder="새 닉네임"
                      disabled={isLoading}
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none text-stone-800 disabled:opacity-50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      취소
                    </button>
                    <button
                      onClick={handleUpdateNickname}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={user.name}
                      disabled
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-700"
                    />
                  </div>
                  <button
                    onClick={() => setEditMode('nickname')}
                    className="p-2.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Notification Settings */}
            <div>
              <label className="text-xs text-stone-500 block mb-2">알림 설정</label>
              <button
                onClick={handleToggleNotification}
                disabled={isLoading}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                  user.notificationEnabled
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-stone-50 border-stone-300 text-stone-600'
                } disabled:opacity-50`}
              >
                <div className="flex items-center gap-2">
                  {user.notificationEnabled ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                  <span className="text-sm">
                    {user.notificationEnabled ? '알림 활성화됨' : '알림 비활성화됨'}
                  </span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  user.notificationEnabled ? 'bg-amber-600' : 'bg-stone-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform mt-0.5 ${
                    user.notificationEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </div>
              </button>
            </div>

            {/* Support Resources Button */}
            {onGoToSupport && (
              <div className="mt-6 pt-6 border-t border-stone-300">
                <label className="text-xs text-stone-500 block mb-2">도움 받기</label>
                <button
                  onClick={onGoToSupport}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-700 border-2 border-rose-300 rounded-lg hover:bg-rose-100 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  도움말 & 리소스 보기
                </button>
                <p className="text-xs text-stone-500 mt-2 text-center">
                  감정 관리가 어려울 때 전문가의 도움을 받을 수 있습니다
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Binding */}
      <div className="w-1.5 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-800 relative">
        <div className="absolute inset-0 shadow-inner" style={{ boxShadow: 'inset 3px 0 6px rgba(0,0,0,0.4), inset -3px 0 6px rgba(0,0,0,0.4)' }} />
      </div>

      {/* Right Page */}
      <div className="flex-1 relative">
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none rounded-r-lg"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1719563015025-83946fb49e49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBwYXBlciUyMHRleHR1cmV8ZW58MXx8fHwxNzYzNTI2MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-start pt-20">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-8 border-b border-blue-200/30" />
          ))}
        </div>
        <div className="absolute left-8 top-0 w-px h-full bg-red-300/40" />
        
        <div className="relative p-8 h-full overflow-y-auto">
          <div className="space-y-6">
            {/* Password Change Section */}
            <div>
              <label className="text-xs text-stone-500 block mb-2">비밀번호 변경</label>
              
              {editMode === 'password' ? (
                <div className="space-y-3">
                  {/* Current Password */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="현재 비밀번호"
                      disabled={isLoading}
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none text-stone-800 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호 (최소 6자)"
                      disabled={isLoading}
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none text-stone-800 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Confirm New Password */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="새 비밀번호 확인"
                      disabled={isLoading}
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none text-stone-800 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      취소
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      변경 완료
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode('password')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  비밀번호 변경하기
                </button>
              )}
            </div>

            {/* Delete Account Section */}
            <div className="mt-8 pt-6 border-t border-stone-300">
              <label className="text-xs text-stone-500 block mb-2">위험 영역</label>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 text-rose-700 border border-rose-300 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50"
                >
                  <UserX className="w-4 h-4" />
                  계정 탈퇴
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-rose-100 border border-rose-300 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-rose-800">정말로 탈퇴하시겠습니까?</p>
                        <p className="text-xs text-rose-700 mt-1">
                          모든 일기와 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 disabled:opacity-50"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserX className="w-4 h-4" />
                      )}
                      탈퇴하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}