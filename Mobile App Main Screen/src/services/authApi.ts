// Mock Authentication API service

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface VerificationCodeRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    notificationEnabled?: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  notificationEnabled?: boolean;
}

export interface UpdateProfileRequest {
  name: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateNotificationRequest {
  notificationEnabled: boolean;
}

// Mock user database
const mockUsers = [
  {
    id: 'user1',
    email: 'test@example.com',
    password: 'password123',
    name: '홍길동',
    notificationEnabled: true,
  },
  {
    id: 'user2',
    email: 'user@diary.com',
    password: '1234',
    name: '김철수',
    notificationEnabled: true,
  },
];

// Mock verification codes storage
let verificationCodes: { [email: string]: { code: string; expiresAt: number } } = {};

// Current logged in user (mock)
let currentUserId: string | null = null;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock JWT token
const generateToken = (userId: string): string => {
  return `mock_jwt_token_${userId}_${Date.now()}`;
};

/**
 * POST /login
 * 사용자 로그인
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  await delay(800);
  
  const user = mockUsers.find(
    u => u.email === credentials.email && u.password === credentials.password
  );
  
  if (!user) {
    throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
  }
  
  currentUserId = user.id;
  
  const accessToken = generateToken(user.id);
  const refreshToken = generateToken(`${user.id}_refresh`);
  
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
 * POST /signup
 * 사용자 회원가입
 */
export async function signup(data: SignupRequest): Promise<LoginResponse> {
  await delay(1000);
  
  // Check if email already exists
  const existingUser = mockUsers.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('이미 가입된 이메일입니다.');
  }
  
  // Validate password
  if (data.password.length < 6) {
    throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
  }
  
  // Create new user
  const newUser = {
    id: `user${mockUsers.length + 1}`,
    email: data.email,
    password: data.password, // In real app, this would be hashed
    name: data.name,
    notificationEnabled: true,
  };
  
  mockUsers.push(newUser);
  currentUserId = newUser.id;
  
  const accessToken = generateToken(newUser.id);
  const refreshToken = generateToken(`${newUser.id}_refresh`);
  
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
 * POST /auth/send-verification-code
 * 인증 코드 발송
 */
export async function sendVerificationCode(data: VerificationCodeRequest): Promise<{ message: string }> {
  await delay(1000);
  
  // Check if email exists
  const user = mockUsers.find(u => u.email === data.email);
  if (!user) {
    throw new Error('가입되지 않은 이메일입니다. 다시 확인해주세요.');
  }
  
  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store code with 5 minute expiration
  verificationCodes[data.email] = {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  };
  
  // Simulate email sending
  console.log(`[Email Sent] To: ${data.email}, Code: ${code}`);
  
  return {
    message: '인증 코드가 이메일로 발송되었습니다.',
  };
}

/**
 * POST /auth/reset-password
 * 비밀번호 재설정
 */
export async function resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
  await delay(800);
  
  // Check if email exists
  const user = mockUsers.find(u => u.email === data.email);
  if (!user) {
    throw new Error('가입되지 않은 이메일입니다.');
  }
  
  // Verify code
  const storedCode = verificationCodes[data.email];
  if (!storedCode) {
    throw new Error('인증 코드를 먼저 발송해주세요.');
  }
  
  if (storedCode.expiresAt < Date.now()) {
    delete verificationCodes[data.email];
    throw new Error('인증 코드가 만료되었습니다. 다시 발송해주세요.');
  }
  
  if (storedCode.code !== data.code) {
    throw new Error('인증 코드가 올바르지 않습니다.');
  }
  
  // Validate new password
  if (data.newPassword.length < 6) {
    throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
  }
  
  // Update password (in real app, this would be hashed)
  user.password = data.newPassword;
  
  // Clear used verification code
  delete verificationCodes[data.email];
  
  return {
    message: '비밀번호가 성공적으로 변경되었습니다.',
  };
}

/**
 * POST /refresh
 * JWT 토큰 갱신
 */
export async function refreshToken(token: string): Promise<{ accessToken: string }> {
  await delay(300);
  
  // Mock token refresh
  const newToken = generateToken('refreshed');
  
  return {
    accessToken: newToken,
  };
}

/**
 * GET /user
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser(): Promise<User> {
  await delay(200);
  
  const token = localStorage.getItem('accessToken');
  
  if (!token || !currentUserId) {
    throw new Error('인증 정보가 없습니다.');
  }
  
  const user = mockUsers.find(u => u.id === currentUserId);
  
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    notificationEnabled: user.notificationEnabled,
  };
}

/**
 * PATCH /user/profile
 * 닉네임 변경
 */
export async function updateProfile(data: UpdateProfileRequest): Promise<User> {
  await delay(500);
  
  const token = localStorage.getItem('accessToken');
  
  if (!token || !currentUserId) {
    throw new Error('인증 정보가 없습니다.');
  }
  
  const user = mockUsers.find(u => u.id === currentUserId);
  
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  // Update name
  user.name = data.name;
  
  // Update localStorage
  const updatedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    notificationEnabled: user.notificationEnabled,
  };
  
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return updatedUser;
}

/**
 * PATCH /user/newPWd
 * 비밀번호 변경
 */
export async function changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
  await delay(500);
  
  const token = localStorage.getItem('accessToken');
  
  if (!token || !currentUserId) {
    throw new Error('인증 정보가 없습니다.');
  }
  
  const user = mockUsers.find(u => u.id === currentUserId);
  
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  // Verify current password
  if (user.password !== data.currentPassword) {
    throw new Error('현재 비밀번호가 일치하지 않습니다.');
  }
  
  // Validate new password
  if (data.newPassword.length < 6) {
    throw new Error('새 비밀번호는 최소 6자 이상이어야 합니다.');
  }
  
  // Update password
  user.password = data.newPassword;
  
  return {
    message: '비밀번호가 성공적으로 변경되었습니다.',
  };
}

/**
 * PATCH /user/Notification
 * 알림 설정 변경
 */
export async function updateNotification(data: UpdateNotificationRequest): Promise<User> {
  await delay(300);
  
  const token = localStorage.getItem('accessToken');
  
  if (!token || !currentUserId) {
    throw new Error('인증 정보가 없습니다.');
  }
  
  const user = mockUsers.find(u => u.id === currentUserId);
  
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  // Update notification setting
  user.notificationEnabled = data.notificationEnabled;
  
  // Update localStorage
  const updatedUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    notificationEnabled: user.notificationEnabled,
  };
  
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  return updatedUser;
}

/**
 * DELETE /user
 * 회원 탈퇴
 */
export async function deleteAccount(): Promise<{ message: string }> {
  await delay(500);
  
  const token = localStorage.getItem('accessToken');
  
  if (!token || !currentUserId) {
    throw new Error('인증 정보가 없습니다.');
  }
  
  const userIndex = mockUsers.findIndex(u => u.id === currentUserId);
  
  if (userIndex === -1) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  // Remove user from mock database
  mockUsers.splice(userIndex, 1);
  
  // Clear tokens and user data
  TokenStorage.clearTokens();
  localStorage.removeItem('user');
  currentUserId = null;
  
  return {
    message: '계정이 성공적으로 탈퇴되었습니다.',
  };
}

/**
 * Local storage helpers
 */
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