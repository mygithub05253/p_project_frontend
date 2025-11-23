// API 설정 및 기본 URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Mock 모드 활성화 여부 (백엔드 서버가 없을 때 사용)
// 개발 환경에서는 기본적으로 Mock 모드 사용 (환경 변수로 false로 설정 가능)
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

// 개발 모드 확인
if (import.meta.env.DEV) {
  console.log('🔧 개발 모드:', {
    USE_MOCK_API,
    API_BASE_URL,
    message: 'Mock 모드가 활성화되어 있습니다. 백엔드 서버 없이도 테스트할 수 있습니다.',
  });
}

// API 엔드포인트 경로
export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
    SEND_VERIFICATION_CODE: '/auth/send-verification-code',
    RESET_PASSWORD: '/auth/reset-password',
  },
  // 사용자 관련
  USER: {
    CURRENT: '/user',
    PROFILE: '/user/profile',
    PASSWORD: '/user/password',
    NOTIFICATION: '/user/notification',
    DELETE: '/user',
  },
  // 일기 관련
  DIARY: {
    LIST: '/diaries',
    DETAILS: '/diaries/details',
    CREATE: '/diaries',
    UPDATE: (id: number) => `/diaries/${id}`,
    DELETE: (id: number) => `/diaries/${id}`,
    HEATMAP: '/diaries/heatmap',
    SEARCH: '/diaries/search',
  },
  // 통계 관련
  STATS: {
    DAILY: '/stats/daily',
    CHART: '/stats/chart',
  },
  // 지원 리소스
  SUPPORT: {
    RESOURCES: '/support/resources',
  },
} as const;
