/**
 * authApi.ts
 * 
 * 유스케이스: UC-15 인증 및 사용자 관리
 * 시퀀스: LoginPage/SignupPage/MyPage -> authApi -> Mock API -> 응답 반환
 * 
 * 주요 기능:
 * - 로그인 (UC-16): 사용자 인증 및 토큰 발급
 * - 회원가입 (UC-17): 신규 사용자 등록 및 자동 로그인
 * - 비밀번호 재설정 (UC-18): 이메일 인증 코드 발송 및 비밀번호 변경
 * - 프로필 관리 (UC-19): 사용자 정보 조회, 수정, 비밀번호 변경, 알림 설정
 * - 계정 삭제 (UC-20): 사용자 계정 영구 삭제
 * - 토큰 관리: Access Token, Refresh Token 저장 및 관리
 */
// Authentication API Service - Mock API 직접 사용

export interface User {
  id: string;
  email: string;
  name: string;
  notificationEnabled?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface UpdateProfileRequest {
  nickname: string;
  birthDate: string;
  alertPush: boolean;
  alertEmail: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateNotificationRequest {
  alertPush: boolean;
  alertEmail: boolean;
}

export interface VerificationCodeRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// Local storage helpers
export const TokenStorage = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },
  
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  
  hasValidToken: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },
};

// Mock 데이터베이스
const mockUsers: Array<{
  id: string;
  email: string;
  password: string;
  name: string;
  notificationEnabled: boolean;
}> = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    name: '테스트 사용자',
    notificationEnabled: true,
  },
];

let verificationCodes: { [email: string]: { code: string; expiresAt: number } } = {};

// API 지연 시뮬레이션
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 토큰 생성
const generateToken = (userId: string): string => {
  return `mock_jwt_token_${userId}_${Date.now()}`;
};

/**
 * 유스케이스: UC-16 로그인
 * 시퀀스: LoginPage -> login API 호출 -> 사용자 인증 -> 토큰 생성 -> 토큰 저장 -> 응답 반환
 * 
 * 사용자 이메일과 비밀번호를 검증하여 인증 토큰을 발급하고
 * Access Token과 Refresh Token을 로컬 스토리지에 저장
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  await delay(800);
  
  const user = mockUsers.find(
    u => (u.email === credentials.username || u.email === credentials.username)
      && u.password === credentials.password
  );
  
  if (!user) {
    throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
  }
  
  const accessToken = generateToken(user.id);
  const refreshToken = generateToken(user.id);
  
  TokenStorage.setTokens(accessToken, refreshToken);
  
  // 사용자 정보 저장
  localStorage.setItem('user', JSON.stringify(user));
  
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      notificationEnabled: user.notificationEnabled,
    },
  };
}

/**
 * 유스케이스: UC-17 회원가입
 * 시퀀스: SignupPage -> signup API 호출 -> 이메일 중복 검사 -> 사용자 생성 -> 토큰 생성 -> 토큰 저장 -> 응답 반환
 * 
 * 신규 사용자 정보를 등록하고 자동으로 로그인 처리하여
 * 인증 토큰을 발급하고 저장
 */
export async function signup(data: SignupRequest): Promise<LoginResponse> {
  await delay(1000);
  
  const existingUser = mockUsers.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('이미 가입된 이메일입니다.');
  }
  
  if (data.password.length < 6) {
    throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
  }
  
  const newUser = {
    id: String(mockUsers.length + 1),
    email: data.email,
    password: data.password,
    name: data.name,
    notificationEnabled: true,
  };
  
  mockUsers.push(newUser);
  
  const accessToken = generateToken(newUser.id);
  const refreshToken = generateToken(newUser.id);
  
  TokenStorage.setTokens(accessToken, refreshToken);
  localStorage.setItem('user', JSON.stringify(newUser));
  
  return {
    accessToken,
    refreshToken,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      notificationEnabled: newUser.notificationEnabled,
    },
  };
}

/**
 * 인증 코드 발송
 */
export async function sendVerificationCode(
  data: VerificationCodeRequest
): Promise<{ message: string }> {
  await delay(1000);
  
  const user = mockUsers.find(u => u.email === data.email);
  if (!user) {
    throw new Error('가입되지 않은 이메일입니다.');
  }
  
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes[data.email] = {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };
  
  console.log(`[Mock Email] To: ${data.email}, Code: ${code}`);
  
  return { message: '인증 코드가 이메일로 발송되었습니다.' };
}

/**
 * 비밀번호 재설정
 */
export async function resetPassword(
  data: ResetPasswordRequest
): Promise<{ message: string }> {
  await delay(800);
  
  const user = mockUsers.find(u => u.email === data.email);
  if (!user) {
    throw new Error('가입되지 않은 이메일입니다.');
  }
  
  const storedCode = verificationCodes[data.email];
  if (!storedCode || storedCode.expiresAt < Date.now()) {
    throw new Error('인증 코드가 만료되었거나 올바르지 않습니다.');
  }
  
  if (storedCode.code !== data.code) {
    throw new Error('인증 코드가 올바르지 않습니다.');
  }
  
  user.password = data.newPassword;
  delete verificationCodes[data.email];
  
  return { message: '비밀번호가 성공적으로 변경되었습니다.' };
}

/**
 * JWT 토큰 갱신
 */
export async function refreshToken(
  token: string
): Promise<RefreshTokenResponse> {
  await delay(300);
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('인증 정보가 없습니다.');
  }
  const user = JSON.parse(userStr);
  return { accessToken: generateToken(user.id) };
}

/**
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser(): Promise<User> {
  await delay(200);
  const token = TokenStorage.getAccessToken();
  if (!token) {
    throw new Error('인증 정보가 없습니다.');
  }
  
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('사용자 정보를 찾을 수 없습니다.');
  }
  
  return JSON.parse(userStr);
}

/**
 * 프로필 정보 변경
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<User> {
  await delay(500);
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('사용자 정보를 찾을 수 없습니다.');
  }
  
  const user = JSON.parse(userStr);
  const mockUser = mockUsers.find(u => u.id === user.id);
  if (mockUser) {
    mockUser.name = data.nickname;
  }
  
  const updatedUser = {
    ...user,
    name: data.nickname,
  };
  
  localStorage.setItem('user', JSON.stringify(updatedUser));
  return updatedUser;
}

/**
 * 비밀번호 변경
 */
export async function changePassword(
  data: ChangePasswordRequest
): Promise<{ message: string }> {
  await delay(500);
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('사용자 정보를 찾을 수 없습니다.');
  }
  
  const user = JSON.parse(userStr);
  const mockUser = mockUsers.find(u => u.id === user.id);
  if (!mockUser || mockUser.password !== data.currentPassword) {
    throw new Error('현재 비밀번호가 일치하지 않습니다.');
  }
  
  mockUser.password = data.newPassword;
  return { message: '비밀번호가 성공적으로 변경되었습니다.' };
}

/**
 * 알림 설정 변경
 */
export async function updateNotification(
  data: UpdateNotificationRequest
): Promise<User> {
  await delay(300);
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('사용자 정보를 찾을 수 없습니다.');
  }
  
  const user = JSON.parse(userStr);
  const mockUser = mockUsers.find(u => u.id === user.id);
  if (mockUser) {
    mockUser.notificationEnabled = data.alertPush || data.alertEmail;
  }
  
  const updatedUser = {
    ...user,
    notificationEnabled: data.alertPush || data.alertEmail,
  };
  
  localStorage.setItem('user', JSON.stringify(updatedUser));
  return updatedUser;
}

/**
 * 회원 탈퇴
 */
export async function deleteAccount(): Promise<{ message: string }> {
  await delay(500);
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('사용자 정보를 찾을 수 없습니다.');
  }
  
  const user = JSON.parse(userStr);
  const index = mockUsers.findIndex(u => u.id === user.id);
  if (index >= 0) {
    mockUsers.splice(index, 1);
  }
  
  TokenStorage.clearTokens();
  localStorage.removeItem('user');
  
  return { message: '계정이 성공적으로 탈퇴되었습니다.' };
}

// 타입 export
export type { User };
