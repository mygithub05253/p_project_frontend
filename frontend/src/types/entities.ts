// ERD 기반 엔티티 타입 정의

/**
 * 사용자 정보 (USERS 테이블)
 */
export interface User {
  user_id: number;
  username: string;
  email: string;
  nickname: string;
  birth_date: string; // DATE 형식: YYYY-MM-DD
  role: string; // 'ROLE_USER'
  alert_push: boolean;
  alert_email: boolean;
  created_at: string; // TIMESTAMP
  updated_at: string; // TIMESTAMP
}

/**
 * 일기 정보 (DIARIES 테이블)
 */
export interface Diary {
  diary_id: number;
  user_id: number;
  written_date: string; // DATE 형식: YYYY-MM-DD
  content: string; // 암호화된 일기 본문
  weather?: string | null; // VARCHAR(20)
  status: 'PENDING' | 'COMPLETE'; // 분석 상태
  created_at: string; // TIMESTAMP
  updated_at: string; // TIMESTAMP
}

/**
 * 감정 분석 결과 (EMOTION_ANALYSIS 테이블)
 */
export interface EmotionAnalysis {
  analysis_id: number;
  diary_id: number;
  primary_emotion: string; // VARCHAR(20): Happy, Sad, Angry, Depressed 등
  emotion_score: number; // FLOAT: -1.0 ~ 1.0
  ai_comment?: string | null; // TEXT
  analysis_data?: Record<string, unknown> | null; // JSON: 세부 감정 분포 데이터
  analyzed_at: string; // TIMESTAMP
}

/**
 * 위험 신호 로그 (RISK_LOGS 테이블)
 */
export interface RiskLog {
  log_id: number;
  user_id: number;
  risk_level: 'HIGH' | 'MEDIUM';
  trigger_reason: string; // VARCHAR(100)
  detected_at: string; // TIMESTAMP
  is_notified: boolean;
}

/**
 * 지원 리소스 (SUPPORT_RESOURCES 테이블)
 */
export interface SupportResource {
  resource_id: number;
  name: string; // VARCHAR(50)
  phone?: string | null; // VARCHAR(20)
  link?: string | null; // VARCHAR(255)
}

/**
 * 공지사항 (NOTICES 테이블)
 */
export interface Notice {
  notice_id: number;
  title: string; // VARCHAR(100)
  content: string; // TEXT
  created_at: string; // TIMESTAMP
}

