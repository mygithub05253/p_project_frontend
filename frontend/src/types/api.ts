// API 요청/응답 타입 정의
import type { User, Diary, EmotionAnalysis } from './entities';

/**
 * 로그인 요청
 */
export interface LoginRequest {
  username: string; // 또는 email
  password: string;
}

/**
 * 회원가입 요청
 */
export interface SignupRequest {
  username: string;
  password: string;
  email: string;
  nickname: string;
  birth_date: string; // YYYY-MM-DD
}

/**
 * 로그인 응답
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    user_id: number;
    username: string;
    email: string;
    nickname: string;
  };
}

/**
 * 일기 생성 요청
 */
export interface CreateDiaryRequest {
  written_date: string; // YYYY-MM-DD
  content: string; // 일기 본문 (프론트엔드에서 암호화하지 않음, 백엔드에서 처리)
  weather?: string;
}

/**
 * 일기 수정 요청
 */
export interface UpdateDiaryRequest {
  content: string;
  weather?: string;
}

/**
 * 일기 상세 정보 (일기 + 감정 분석 결과)
 */
export interface DiaryDetail {
  diary: Diary;
  emotionAnalysis?: EmotionAnalysis | null;
}

/**
 * 월별 감정 데이터 (히트맵용)
 */
export interface EmotionData {
  date: string; // YYYY-MM-DD
  primary_emotion: string; // Happy, Sad, Angry 등
  emotion_score: number; // -1.0 ~ 1.0
  emotion_category: string; // happy, sad, angry 등 (소문자)
}

/**
 * 일기 검색 파라미터
 */
export interface DiarySearchParams {
  keyword?: string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  emotion_category?: string;
  page?: number;
  limit?: number;
}

/**
 * 일기 검색 결과
 */
export interface DiarySearchResult {
  diaries: DiaryDetail[];
  total: number;
  page: number;
  total_pages: number;
}

/**
 * 일별 통계
 */
export interface DailyStats {
  date: string; // YYYY-MM-DD
  primary_emotion: string;
  emotion_category: string;
  title?: string;
}

/**
 * 차트 데이터 포인트
 */
export interface ChartDataPoint {
  date: string;
  display_label: string;
  happy: number;
  love: number;
  excited: number;
  calm: number;
  grateful: number;
  hopeful: number;
  tired: number;
  sad: number;
  angry: number;
  anxious: number;
  neutral: number;
  total: number;
}

/**
 * 프로필 업데이트 요청
 */
export interface UpdateProfileRequest {
  nickname: string;
}

/**
 * 비밀번호 변경 요청
 */
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

/**
 * 알림 설정 변경 요청
 */
export interface UpdateNotificationRequest {
  alert_push: boolean;
  alert_email: boolean;
}

/**
 * 인증 코드 발송 요청
 */
export interface VerificationCodeRequest {
  email: string;
}

/**
 * 비밀번호 재설정 요청
 */
export interface ResetPasswordRequest {
  email: string;
  code: string;
  new_password: string;
}

/**
 * 토큰 갱신 요청
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * 토큰 갱신 응답
 */
export interface RefreshTokenResponse {
  accessToken: string;
}

