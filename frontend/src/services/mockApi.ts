// Mock API - 백엔드 서버가 없을 때 사용하는 모의 API
// 개발 및 테스트용

import type {
  LoginRequest,
  SignupRequest,
  LoginResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UpdateNotificationRequest,
  VerificationCodeRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  CreateDiaryRequest,
  UpdateDiaryRequest,
  DiaryDetail,
  EmotionData,
  DiarySearchParams,
  DiarySearchResult,
  DailyStats,
  ChartDataPoint,
} from '../types/api';
import type { User, SupportResource } from '../types/entities';
import { TokenStorage } from './authApi';

// Mock 데이터베이스
const mockUsers: Array<{
  user_id: number;
  username: string;
  email: string;
  password: string;
  nickname: string;
  birth_date: string;
  alert_push: boolean;
  alert_email: boolean;
}> = [
  {
    user_id: 1,
    username: 'test@example.com',
    email: 'test@example.com',
    password: 'password123',
    nickname: '테스트 사용자',
    birth_date: '1990-01-01',
    alert_push: true,
    alert_email: false,
  },
];

const mockDiaries: Map<string, DiaryDetail> = new Map();
const mockEmotionData: EmotionData[] = [];
let verificationCodes: { [email: string]: { code: string; expiresAt: number } } = {};

// API 지연 시뮬레이션
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 토큰 생성
const generateToken = (userId: number): string => {
  return `mock_jwt_token_${userId}_${Date.now()}`;
};

// ========== 인증 API ==========

export async function mockLogin(credentials: LoginRequest): Promise<LoginResponse> {
  await delay(800);
  
  const user = mockUsers.find(
    u => (u.username === credentials.username || u.email === credentials.username) 
      && u.password === credentials.password
  );
  
  if (!user) {
    throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
  }
  
  const accessToken = generateToken(user.user_id);
  const refreshToken = generateToken(user.user_id);
  
  TokenStorage.setTokens(accessToken, refreshToken);
  
  return {
    accessToken,
    refreshToken,
    user: {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
    },
  };
}

export async function mockSignup(data: SignupRequest): Promise<LoginResponse> {
  await delay(1000);
  
  const existingUser = mockUsers.find(u => u.email === data.email || u.username === data.username);
  if (existingUser) {
    throw new Error('이미 가입된 이메일 또는 아이디입니다.');
  }
  
  if (data.password.length < 6) {
    throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
  }
  
  const newUser = {
    user_id: mockUsers.length + 1,
    username: data.username,
    email: data.email,
    password: data.password,
    nickname: data.nickname,
    birth_date: data.birth_date,
    alert_push: true,
    alert_email: false,
  };
  
  mockUsers.push(newUser);
  
  const accessToken = generateToken(newUser.user_id);
  const refreshToken = generateToken(newUser.user_id);
  
  TokenStorage.setTokens(accessToken, refreshToken);
  
  return {
    accessToken,
    refreshToken,
    user: {
      user_id: newUser.user_id,
      username: newUser.username,
      email: newUser.email,
      nickname: newUser.nickname,
    },
  };
}

export async function mockSendVerificationCode(
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

export async function mockResetPassword(
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
  
  user.password = data.new_password;
  delete verificationCodes[data.email];
  
  return { message: '비밀번호가 성공적으로 변경되었습니다.' };
}

export async function mockRefreshToken(
  token: string
): Promise<RefreshTokenResponse> {
  await delay(300);
  return { accessToken: generateToken(1) };
}

export async function mockGetCurrentUser(): Promise<User> {
  await delay(200);
  const token = TokenStorage.getAccessToken();
  if (!token) {
    throw new Error('인증 정보가 없습니다.');
  }
  
  // 토큰에서 user_id 추출 (간단한 파싱)
  const match = token.match(/mock_jwt_token_(\d+)_/);
  const userId = match ? parseInt(match[1]) : 1;
  
  const user = mockUsers.find(u => u.user_id === userId);
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  return {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    nickname: user.nickname,
    birth_date: user.birth_date,
    role: 'ROLE_USER',
    alert_push: user.alert_push,
    alert_email: user.alert_email,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function mockUpdateProfile(
  data: UpdateProfileRequest
): Promise<User> {
  await delay(500);
  const user = await mockGetCurrentUser();
  const mockUser = mockUsers.find(u => u.user_id === user.user_id);
  if (mockUser) {
    mockUser.nickname = data.nickname;
  }
  return { ...user, nickname: data.nickname };
}

export async function mockChangePassword(
  data: ChangePasswordRequest
): Promise<{ message: string }> {
  await delay(500);
  const user = await mockGetCurrentUser();
  const mockUser = mockUsers.find(u => u.user_id === user.user_id);
  if (!mockUser || mockUser.password !== data.current_password) {
    throw new Error('현재 비밀번호가 일치하지 않습니다.');
  }
  mockUser.password = data.new_password;
  return { message: '비밀번호가 성공적으로 변경되었습니다.' };
}

export async function mockUpdateNotification(
  data: UpdateNotificationRequest
): Promise<User> {
  await delay(300);
  const user = await mockGetCurrentUser();
  const mockUser = mockUsers.find(u => u.user_id === user.user_id);
  if (mockUser) {
    mockUser.alert_push = data.alert_push;
    mockUser.alert_email = data.alert_email;
  }
  return { ...user, alert_push: data.alert_push, alert_email: data.alert_email };
}

export async function mockDeleteAccount(): Promise<{ message: string }> {
  await delay(500);
  const user = await mockGetCurrentUser();
  const index = mockUsers.findIndex(u => u.user_id === user.user_id);
  if (index >= 0) {
    mockUsers.splice(index, 1);
  }
  TokenStorage.clearTokens();
  return { message: '계정이 성공적으로 탈퇴되었습니다.' };
}

// ========== 일기 API ==========

export async function mockFetchMonthlyEmotions(
  year: number,
  month: number
): Promise<EmotionData[]> {
  await delay(300);
  const yearMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
  const filtered = mockEmotionData.filter(data => data.date.startsWith(yearMonth));
  
  // EmotionData 형식에 맞게 변환
  return filtered.map(data => ({
    date: data.date,
    primary_emotion: data.primary_emotion,
    emotion_score: data.emotion_score,
    emotion_category: data.emotion_category,
  }));
}

export async function mockFetchDiaryDetails(
  date: string
): Promise<DiaryDetail | null> {
  await delay(200);
  return mockDiaries.get(date) || null;
}

export async function mockCreateDiary(
  data: CreateDiaryRequest
): Promise<DiaryDetail> {
  await delay(500);
  const user = await mockGetCurrentUser();
  
  const diaryId = mockDiaries.size + 1;
  const emotionScore = Math.random() * 2 - 1; // -1.0 ~ 1.0
  
  const diaryDetail: DiaryDetail = {
    diary: {
      diary_id: diaryId,
      user_id: user.user_id,
      written_date: data.written_date,
      content: data.content,
      weather: data.weather || null,
      status: 'COMPLETE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    emotionAnalysis: {
      analysis_id: diaryId,
      diary_id: diaryId,
      primary_emotion: emotionScore > 0.5 ? 'Happy' : emotionScore < -0.5 ? 'Sad' : 'Neutral',
      emotion_score: emotionScore,
      ai_comment: '오늘 하루도 수고하셨어요! 당신의 감정을 소중히 기록해주셔서 감사합니다.',
      analysis_data: null,
      analyzed_at: new Date().toISOString(),
    },
  };
  
  mockDiaries.set(data.written_date, diaryDetail);
  
  // 히트맵 데이터 업데이트
  const emotionCategory = emotionScore > 0.5 ? 'happy' : emotionScore < -0.5 ? 'sad' : 'neutral';
  mockEmotionData.push({
    date: data.written_date,
    primary_emotion: diaryDetail.emotionAnalysis.primary_emotion,
    emotion_score: emotionScore,
    emotion_category: emotionCategory,
  });
  
  return diaryDetail;
}

export async function mockUpdateDiary(
  id: number,
  data: UpdateDiaryRequest
): Promise<DiaryDetail> {
  await delay(400);
  const existing = Array.from(mockDiaries.values()).find(d => d.diary.diary_id === id);
  if (!existing) {
    throw new Error('일기를 찾을 수 없습니다.');
  }
  
  existing.diary.content = data.content;
  existing.diary.weather = data.weather || null;
  existing.diary.updated_at = new Date().toISOString();
  
  return existing;
}

export async function mockDeleteDiary(id: number): Promise<void> {
  await delay(300);
  const date = Array.from(mockDiaries.entries()).find(([_, d]) => d.diary.diary_id === id)?.[0];
  if (date) {
    mockDiaries.delete(date);
    const index = mockEmotionData.findIndex(e => e.date === date);
    if (index >= 0) {
      mockEmotionData.splice(index, 1);
    }
  }
}

export async function mockFetchDailyStats(yearMonth: string): Promise<DailyStats[]> {
  await delay(300);
  return Array.from(mockDiaries.values())
    .filter(d => d.diary.written_date.startsWith(yearMonth))
    .map(d => ({
      date: d.diary.written_date,
      primary_emotion: d.emotionAnalysis?.primary_emotion || 'Neutral',
      emotion_category: d.emotionAnalysis?.emotion_score || 0 > 0.5 ? 'happy' : 'sad',
      title: d.diary.content.split('\n')[0] || '',
    }));
}

export async function mockFetchChartStats(
  startDate: string,
  endDate: string,
  type: 'weekly' | 'monthly'
): Promise<ChartDataPoint[]> {
  await delay(400);
  // 간단한 Mock 데이터 반환
  return [];
}

export async function mockSearchDiaries(
  params: DiarySearchParams
): Promise<DiarySearchResult> {
  await delay(300);
  let filtered = Array.from(mockDiaries.values());
  
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    filtered = filtered.filter(d => 
      d.diary.content.toLowerCase().includes(keyword)
    );
  }
  
  if (params.start_date) {
    filtered = filtered.filter(d => d.diary.written_date >= params.start_date!);
  }
  
  if (params.end_date) {
    filtered = filtered.filter(d => d.diary.written_date <= params.end_date!);
  }
  
  if (params.emotion_category) {
    filtered = filtered.filter(d => 
      d.emotionAnalysis?.primary_emotion?.toLowerCase().includes(params.emotion_category!)
    );
  }
  
  const page = params.page || 1;
  const limit = params.limit || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const diaries = filtered.slice(startIndex, startIndex + limit);
  
  return {
    diaries,
    total,
    page,
    total_pages: totalPages,
  };
}

// ========== 지원 리소스 API ==========

export async function mockFetchSupportResources(): Promise<SupportResource[]> {
  await delay(200);
  return [
    {
      resource_id: 1,
      name: '자살예방 상담전화',
      phone: '1393',
      link: 'https://www.kfsp.or.kr',
    },
    {
      resource_id: 2,
      name: '정신건강 위기상담 전화',
      phone: '1577-0199',
      link: 'https://www.mentalhealth.go.kr',
    },
    {
      resource_id: 3,
      name: '청소년 상담전화',
      phone: '1388',
      link: 'https://www.cyber1388.kr',
    },
  ];
}

