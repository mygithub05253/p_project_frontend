/**
 * diaryApi.ts
 * 
 * 유스케이스: UC-21 일기 관리
 * 시퀀스: DiaryWritingPage/CalendarPage/DaySummaryPage -> diaryApi -> Mock API -> 응답 반환
 * 
 * 주요 기능:
 * - 월별 감정 조회 (UC-22): 특정 월의 감정 데이터 조회
 * - 일기 상세 조회 (UC-23): 특정 날짜의 일기 상세 정보 조회
 * - 일기 작성 (UC-24): 신규 일기 작성 및 감정 카테고리 자동 분류
 * - 일기 수정 (UC-25): 기존 일기 내용 수정
 * - 일기 삭제 (UC-26): 일기 영구 삭제
 * - 일기 검색 (UC-27): 키워드, 기간, 감정 카테고리로 일기 검색
 * - 일별 통계 조회 (UC-28): 특정 월의 일별 감정 통계 조회
 * - 차트 통계 조회 (UC-29): 기간별 감정 변화 차트 데이터 조회
 */
// Diary API Service - Mock API 직접 사용

export interface DiaryDetail {
  id: string;
  date: string;
  emotion: string;
  emotionCategory: string;
  mood: string;
  title: string;
  note: string;
  weather?: string;
  activities?: string[];
  aiComment?: string;
}

export interface EmotionData {
  date: string;
  emotion: string;
  emotionCategory: string;
}

export interface CreateDiaryRequest {
  date: string;
  title: string;
  note: string;
  emotion: string;
  mood: string;
  weather?: string;
  activities?: string[];
}

export interface UpdateDiaryRequest {
  title: string;
  note: string;
  emotion: string;
  mood: string;
  weather?: string;
  activities?: string[];
}

export interface DailyStats {
  date: string;
  emotion: string;
  emotionCategory: string;
  title: string;
}

export interface ChartDataPoint {
  date: string;
  displayLabel: string;
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

export interface DiarySearchParams {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  emotionCategory?: string;
  page?: number;
  limit?: number;
}

export interface DiarySearchResult {
  diaries: DiaryDetail[];
  total: number;
  page: number;
  totalPages: number;
}

// Mock 데이터베이스
const mockDiaries: Map<string, DiaryDetail> = new Map();
const mockEmotionData: EmotionData[] = [];

// API 지연 시뮬레이션
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 유스케이스: UC-22 월별 감정 조회
 * 시퀀스: CalendarPage -> fetchMonthlyEmotions API 호출 -> 해당 월의 감정 데이터 필터링 -> 응답 반환
 * 
 * 특정 연도와 월의 감정 데이터를 조회하여
 * 캘린더에 감정 이모지를 표시하는 데 사용
 */
export async function fetchMonthlyEmotions(
  year: number,
  month: number
): Promise<EmotionData[]> {
  await delay(300);
  const yearMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
  return mockEmotionData.filter(data => data.date.startsWith(yearMonth));
}

/**
 * 유스케이스: UC-23 일기 상세 조회
 * 시퀀스: DaySummaryPage/DiaryWritingPage -> fetchDiaryDetails API 호출 -> 해당 날짜의 일기 조회 -> 응답 반환
 * 
 * 특정 날짜의 일기 상세 정보를 조회하여
 * 일기 내용, 감정, 날씨, 활동 등을 표시
 */
export async function fetchDiaryDetails(
  date: string
): Promise<DiaryDetail | null> {
  await delay(200);
  return mockDiaries.get(date) || null;
}

/**
 * 유스케이스: UC-24 일기 작성
 * 시퀀스: DiaryWritingPage -> createDiary API 호출 -> 감정 카테고리 분류 -> 일기 저장 -> 히트맵 데이터 업데이트 -> 응답 반환
 * 
 * 사용자가 입력한 일기 내용을 저장하고
 * 선택한 감정 이모지를 기반으로 감정 카테고리를 자동 분류하여
 * 감정 히트맵 데이터에 추가
 */
export async function createDiary(
  data: CreateDiaryRequest
): Promise<DiaryDetail> {
  await delay(500);
  
  const diaryId = mockDiaries.size + 1;
  const emotionScore = Math.random() * 2 - 1; // -1.0 ~ 1.0
  
  // 감정 이모지 결정 (사용자가 선택한 감정 사용, 없으면 랜덤)
  let emotion = data.emotion || '😊';
  let emotionCategory = 'happy';
  
  // 사용자가 선택한 감정을 기반으로 카테고리 결정
  if (emotion.includes('😢') || emotion.includes('슬픔')) {
    emotionCategory = 'sad';
  } else if (emotion.includes('😠') || emotion.includes('화남')) {
    emotionCategory = 'angry';
  } else if (emotion.includes('😰') || emotion.includes('불안')) {
    emotionCategory = 'anxious';
  } else if (emotion.includes('😴') || emotion.includes('피곤')) {
    emotionCategory = 'tired';
  } else if (emotion.includes('🥰') || emotion.includes('사랑')) {
    emotionCategory = 'love';
  } else if (emotion.includes('✨') || emotion.includes('설렘')) {
    emotionCategory = 'excited';
  } else if (emotion.includes('😌') || emotion.includes('평온')) {
    emotionCategory = 'calm';
  } else if (emotion.includes('🤗') || emotion.includes('감사')) {
    emotionCategory = 'grateful';
  } else if (emotion.includes('🌈') || emotion.includes('희망')) {
    emotionCategory = 'hopeful';
  } else {
    // 기본값: 랜덤으로 결정
    if (emotionScore < -0.5) {
      emotion = '😢';
      emotionCategory = 'sad';
    } else if (emotionScore < 0) {
      emotion = '😴';
      emotionCategory = 'tired';
    } else {
      emotion = '😊';
      emotionCategory = 'happy';
    }
  }
  
  const diaryDetail: DiaryDetail = {
    id: String(diaryId),
    date: data.date,
    emotion,
    emotionCategory,
    mood: data.mood || emotionCategory,
    title: data.title,
    note: data.note,
    weather: data.weather,
    activities: data.activities || [],
    aiComment: '오늘 하루도 수고하셨어요! 당신의 감정을 소중히 기록해주셔서 감사합니다.',
  };
  
  mockDiaries.set(data.date, diaryDetail);
  
  // 히트맵 데이터 업데이트
  mockEmotionData.push({
    date: data.date,
    emotion,
    emotionCategory,
  });
  
  return diaryDetail;
}

/**
 * 유스케이스: UC-25 일기 수정
 * 시퀀스: DiaryWritingPage -> updateDiary API 호출 -> 기존 일기 조회 -> 내용 업데이트 -> 감정 카테고리 재분류 -> 일기 저장 -> 응답 반환
 * 
 * 기존 일기의 내용을 수정하고
 * 변경된 감정을 기반으로 감정 카테고리를 재분류하여 저장
 */
export async function updateDiary(
  _id: string, // 일기 ID (현재 Mock에서는 사용되지 않지만 향후 확장을 위해 유지)
  date: string,
  data: UpdateDiaryRequest
): Promise<DiaryDetail> {
  await delay(400);
  const existing = mockDiaries.get(date);
  if (!existing) {
    throw new Error('일기를 찾을 수 없습니다.');
  }
  
  const updated: DiaryDetail = {
    ...existing,
    title: data.title,
    note: data.note,
    emotion: data.emotion,
    mood: data.mood,
    weather: data.weather,
    activities: data.activities || [],
  };
  
  mockDiaries.set(date, updated);
  return updated;
}

/**
 * 유스케이스: UC-26 일기 삭제
 * 시퀀스: DaySummaryPage -> deleteDiary API 호출 -> 일기 삭제 -> 히트맵 데이터에서 제거 -> 응답 반환
 * 
 * 특정 날짜의 일기를 영구 삭제하고
 * 감정 히트맵 데이터에서도 해당 날짜의 데이터를 제거
 */
export async function deleteDiary(_id: string, date: string): Promise<void> {
  await delay(300);
  mockDiaries.delete(date);
  const index = mockEmotionData.findIndex(e => e.date === date);
  if (index >= 0) {
    mockEmotionData.splice(index, 1);
  }
}

/**
 * 유스케이스: UC-28 일별 통계 조회
 * 시퀀스: EmotionStatsPage -> fetchDailyStats API 호출 -> 해당 월의 일기 필터링 -> 일별 통계 데이터 생성 -> 응답 반환
 * 
 * 특정 월의 일별 통계 데이터를 조회하여
 * 감정 통계 페이지의 캘린더 또는 타임라인 뷰에 표시
 */
export async function fetchDailyStats(yearMonth: string): Promise<DailyStats[]> {
  await delay(300);
  const stats = Array.from(mockDiaries.values())
    .filter(d => d.date.startsWith(yearMonth))
    .map(d => ({
      date: d.date,
      emotion: d.emotion,
      emotionCategory: d.emotionCategory,
      title: d.title,
    }));
  
  // 날짜순으로 정렬 (최신순)
  return stats.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * 유스케이스: UC-29 감정 변화 추이 차트 조회
 * 시퀀스: EmotionChartView -> fetchChartStats API 호출 -> 기간별 일기 필터링 -> 감정 카테고리별 집계 -> 차트 데이터 생성 -> 응답 반환
 * 
 * 특정 기간의 일기 데이터를 주간 또는 월간으로 그룹화하여
 * 감정 카테고리별 통계를 계산하고 차트 데이터로 변환
 */
export async function fetchChartStats(
  startDate: string,
  endDate: string,
  type: 'weekly' | 'monthly'
): Promise<ChartDataPoint[]> {
  await delay(400);
  
  // 해당 기간의 일기 데이터 가져오기
  const diaries = Array.from(mockDiaries.values())
    .filter(d => d.date >= startDate && d.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date));
  
  if (diaries.length === 0) {
    return [];
  }
  
  // 주간/월간으로 그룹화
  const grouped: { [key: string]: ChartDataPoint } = {};
  
  diaries.forEach(diary => {
    let groupKey: string;
    let displayLabel: string;
    
    if (type === 'weekly') {
      // 주간: 해당 주의 시작일을 키로 사용
      const date = new Date(diary.date);
      const dayOfWeek = date.getDay();
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - dayOfWeek);
      groupKey = formatDateString(startOfWeek);
      displayLabel = `${startOfWeek.getMonth() + 1}/${startOfWeek.getDate()}주`;
    } else {
      // 월간: YYYY-MM 형식
      groupKey = diary.date.substring(0, 7);
      displayLabel = groupKey;
    }
    
    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        date: groupKey,
        displayLabel,
        happy: 0,
        love: 0,
        excited: 0,
        calm: 0,
        grateful: 0,
        hopeful: 0,
        tired: 0,
        sad: 0,
        angry: 0,
        anxious: 0,
        neutral: 0,
        total: 0,
      };
    }
    
    const point = grouped[groupKey];
    const category = diary.emotionCategory;
    
    // 감정 카테고리별 카운트
    if (category === 'happy') point.happy++;
    else if (category === 'love') point.love++;
    else if (category === 'excited') point.excited++;
    else if (category === 'calm') point.calm++;
    else if (category === 'grateful') point.grateful++;
    else if (category === 'hopeful') point.hopeful++;
    else if (category === 'tired') point.tired++;
    else if (category === 'sad') point.sad++;
    else if (category === 'angry') point.angry++;
    else if (category === 'anxious') point.anxious++;
    else point.neutral++;
    
    point.total++;
  });
  
  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
}

// 날짜 포맷 헬퍼 함수
function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 일기 검색
 */
export async function searchDiaries(
  params: DiarySearchParams
): Promise<DiarySearchResult> {
  await delay(300);
  let filtered = Array.from(mockDiaries.values());
  
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    filtered = filtered.filter(d => 
      d.title.toLowerCase().includes(keyword) ||
      d.note.toLowerCase().includes(keyword)
    );
  }
  
  if (params.startDate) {
    filtered = filtered.filter(d => d.date >= params.startDate!);
  }
  
  if (params.endDate) {
    filtered = filtered.filter(d => d.date <= params.endDate!);
  }
  
  if (params.emotionCategory) {
    filtered = filtered.filter(d => d.emotionCategory === params.emotionCategory);
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
    totalPages,
  };
}
