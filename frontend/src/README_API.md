# API 연동 가이드

## 개요

프론트엔드는 백엔드 ERD와 엔드포인트 스펙에 맞춰 수정되었습니다.

## 주요 변경 사항

### 1. 타입 정의 (src/types/)
- `entities.ts`: ERD 기반 엔티티 타입 정의
- `api.ts`: API 요청/응답 타입 정의

### 2. API 클라이언트 (src/lib/)
- `apiClient.ts`: 공통 HTTP 요청 처리
  - 자동 토큰 갱신
  - 에러 처리
  - 인증 헤더 자동 추가

### 3. 서비스 파일 (src/services/)
- `authApi.ts`: 인증 관련 API
- `diaryApi.ts`: 일기 관련 API
- `supportResources.ts`: 지원 리소스 API
- `riskDetection.ts`: 위험 신호 분석

### 4. 설정 파일 (src/config/)
- `api.ts`: API 엔드포인트 경로 정의

## 환경 변수 설정

`.env` 파일을 생성하고 다음을 설정하세요:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/send-verification-code` - 인증 코드 발송
- `POST /api/auth/reset-password` - 비밀번호 재설정

### 사용자
- `GET /api/user` - 현재 사용자 정보
- `PATCH /api/user/profile` - 프로필 수정
- `PATCH /api/user/password` - 비밀번호 변경
- `PATCH /api/user/notification` - 알림 설정 변경
- `DELETE /api/user` - 회원 탈퇴

### 일기
- `GET /api/diaries/heatmap?year={year}&month={month}` - 월별 감정 조회
- `GET /api/diaries/details?date={date}` - 일기 상세 조회
- `POST /api/diaries` - 일기 작성
- `PATCH /api/diaries/{id}` - 일기 수정
- `DELETE /api/diaries/{id}` - 일기 삭제
- `GET /api/diaries/search` - 일기 검색

### 통계
- `GET /api/stats/daily?month={YYYY-MM}` - 일별 통계
- `GET /api/stats/chart?start={YYYY-MM-DD}&end={YYYY-MM-DD}&type={weekly|monthly}` - 차트 데이터

### 지원 리소스
- `GET /api/support/resources` - 상담 기관 목록

## 타입 매핑

### User 타입
- 백엔드: `user_id` (number), `nickname` (string)
- 프론트엔드: `id` (string), `name` (string)
- 어댑터 함수 `adaptUser()` 사용

### Diary 타입
- 백엔드: `diary_id` (number), `content` (암호화된 텍스트)
- 프론트엔드: `id` (string), `title`, `note` (분리)
- 어댑터 함수 `adaptDiaryDetail()` 사용

## 주의 사항

1. **일기 내용 암호화**: 백엔드에서 일기 본문(`content`)을 암호화하여 저장합니다.
2. **생년월일 필수**: 회원가입 시 `birth_date`가 필수입니다. 현재는 임시값을 사용하므로, 실제로는 입력 필드 추가가 필요합니다.
3. **토큰 갱신**: 액세스 토큰 만료 시 자동으로 리프레시 토큰을 사용하여 갱신합니다.

## 마이그레이션 가이드

기존 컴포넌트에서 새로운 API를 사용하려면:

1. 타입 import 변경:
```typescript
// 기존
import { User } from '../services/authApi';

// 변경
import type { User } from '../types/entities';
import { adaptUser } from '../lib/adapters';
```

2. API 호출 후 어댑터 사용:
```typescript
const user = await getCurrentUser();
const adaptedUser = adaptUser(user);
```

