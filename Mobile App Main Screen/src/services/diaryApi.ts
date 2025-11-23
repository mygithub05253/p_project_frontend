// Mock API service simulating backend calls

export interface EmotionData {
  date: string;
  emotion: string;
  emotionCategory: string;
}

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

// Mock database
let mockEmotionData: EmotionData[] = [
  { date: '2025-11-03', emotion: '🌟', emotionCategory: 'happy' },
  { date: '2025-11-05', emotion: '😊', emotionCategory: 'happy' },
  { date: '2025-11-08', emotion: '🥰', emotionCategory: 'love' },
  { date: '2025-11-10', emotion: '✨', emotionCategory: 'excited' },
  { date: '2025-11-12', emotion: '😌', emotionCategory: 'calm' },
  { date: '2025-11-13', emotion: '😢', emotionCategory: 'sad' },
  { date: '2025-11-14', emotion: '😰', emotionCategory: 'anxious' },
  { date: '2025-11-15', emotion: '😞', emotionCategory: 'sad' },
  { date: '2025-11-16', emotion: '😔', emotionCategory: 'sad' },
  { date: '2025-11-17', emotion: '😟', emotionCategory: 'anxious' },
  { date: '2025-11-18', emotion: '😢', emotionCategory: 'sad' },
  { date: '2025-11-19', emotion: '😰', emotionCategory: 'anxious' },
  { date: '2025-11-20', emotion: '😞', emotionCategory: 'sad' },
  { date: '2025-11-22', emotion: '🌈', emotionCategory: 'hopeful' },
  { date: '2025-11-25', emotion: '😴', emotionCategory: 'tired' },
];

let mockDiaryDetails: { [key: string]: DiaryDetail } = {
  '2025-11-03': {
    id: 'd1',
    date: '2025-11-03',
    emotion: '🌟',
    emotionCategory: 'happy',
    mood: 'Inspired',
    title: '새로운 시작',
    note: 'Started a new project today. Feeling motivated and ready for new challenges!',
    weather: '맑음',
    activities: ['운동', '독서'],
    aiComment: '긍정적인 에너지가 느껴지는 하루네요! 새로운 도전을 시작하는 모습이 멋져요.',
  },
  '2025-11-05': {
    id: 'd2',
    date: '2025-11-05',
    emotion: '😊',
    emotionCategory: 'happy',
    mood: 'Content',
    title: '평화로운 아침',
    note: 'Had a peaceful morning walk. The fresh air really cleared my mind.',
    weather: '맑음',
    activities: ['산책'],
    aiComment: '자연과 함께하는 시간은 마음을 편안하게 해주죠. 좋은 하루 보내셨네요!',
  },
  '2025-11-08': {
    id: 'd3',
    date: '2025-11-08',
    emotion: '🥰',
    emotionCategory: 'love',
    mood: 'Loving',
    title: '소중한 시간',
    note: 'Spent quality time with loved ones. These moments are precious.',
    weather: '흐림',
    activities: ['가족 시간'],
    aiComment: '가족과 함께하는 시간은 정말 소중해요. 따뜻한 하루였겠어요.',
  },
  '2025-11-10': {
    id: 'd4',
    date: '2025-11-10',
    emotion: '✨',
    emotionCategory: 'excited',
    mood: 'Magical',
    title: '놀라운 발견',
    note: 'Discovered something amazing today. Life is full of surprises!',
    weather: '맑음',
    activities: ['공부', '취미'],
    aiComment: '새로운 발견은 항상 설레게 하죠! 호기심을 잃지 않는 모습이 좋아요.',
  },
  '2025-11-12': {
    id: 'd5',
    date: '2025-11-12',
    emotion: '😌',
    emotionCategory: 'calm',
    mood: 'Peaceful',
    title: '조용한 하루',
    note: 'Just a quiet, restful day. Sometimes that\'s exactly what we need.',
    weather: '맑음',
    activities: ['휴식'],
    aiComment: '때로는 아무것도 하지 않는 시간이 가장 필요해요. 잘 쉬셨길 바래요.',
  },
  '2025-11-13': {
    id: 'd12',
    date: '2025-11-13',
    emotion: '😢',
    emotionCategory: 'sad',
    mood: 'Sad',
    title: '슬픈 날',
    note: 'Had a tough day. Feeling down but trying to stay positive.',
    weather: '흐림',
    activities: ['독서'],
    aiComment: '어려운 날이지만, 긍정적인 마음가짐을 유지하는 것이 중요해요.',
  },
  '2025-11-14': {
    id: 'd13',
    date: '2025-11-14',
    emotion: '😰',
    emotionCategory: 'anxious',
    mood: 'Anxious',
    title: '불안한 순간',
    note: 'Feeling anxious about upcoming events. Need to find a way to relax.',
    weather: '흐림',
    activities: ['명상'],
    aiComment: '불안감을 느낄 때는 명상이나 휴식이 도움이 될 수 있어요.',
  },
  '2025-11-15': {
    id: 'd6',
    date: '2025-11-15',
    emotion: '😄',
    emotionCategory: 'happy',
    mood: 'Joyful',
    title: '새로운 배움',
    note: 'Started learning something new. The journey ahead looks promising and fun.',
    weather: '맑음',
    activities: ['공부', '운동'],
    aiComment: '배움은 언제나 즐거워요! 앞으로의 여정이 기대되네요.',
  },
  '2025-11-16': {
    id: 'd14',
    date: '2025-11-16',
    emotion: '😔',
    emotionCategory: 'sad',
    mood: 'Sad',
    title: '슬픈 생각',
    note: 'Thinking about past events that made me sad. Trying to move on.',
    weather: '흐림',
    activities: ['산책'],
    aiComment: '과거의 슬픔을 기억하면서도 앞으로 나아가는 것이 중요해요.',
  },
  '2025-11-17': {
    id: 'd7',
    date: '2025-11-17',
    emotion: '🎉',
    emotionCategory: 'excited',
    mood: 'Excited',
    title: '좋은 소식',
    note: 'Got some amazing news today! Can\'t wait to share with everyone.',
    weather: '맑음',
    activities: ['모임'],
    aiComment: '축하해요! 좋은 소식이 있다니 정말 기쁘겠어요.',
  },
  '2025-11-18': {
    id: 'd8',
    date: '2025-11-18',
    emotion: '😢',
    emotionCategory: 'sad',
    mood: 'Sad',
    title: '프로젝트 완료',
    note: 'Completed my project on time. Celebrated with friends at our favorite cafe!',
    weather: '맑음',
    activities: ['작업', '친구 만남'],
    aiComment: '목표를 달성하셨네요! 친구들과의 축하는 더욱 의미있었을 거예요.',
  },
  '2025-11-19': {
    id: 'd15',
    date: '2025-11-19',
    emotion: '😰',
    emotionCategory: 'anxious',
    mood: 'Anxious',
    title: '불안한 하루',
    note: 'Feeling anxious about the future. Need to find a way to relax.',
    weather: '흐림',
    activities: ['명상'],
    aiComment: '불안감을 느낄 때는 명상이나 휴식이 도움이 될 수 있어요.',
  },
  '2025-11-20': {
    id: 'd9',
    date: '2025-11-20',
    emotion: '😞',
    emotionCategory: 'sad',
    mood: 'Sad',
    title: '감사한 하루',
    note: 'Had a wonderful day with family. Feeling blessed and content. The weather was perfect.',
    weather: '맑음',
    activities: ['가족 시간', '외식'],
    aiComment: '감사하는 마음을 가진 하루는 특별해요. 좋은 시간 보내셨네요!',
  },
  '2025-11-22': {
    id: 'd10',
    date: '2025-11-22',
    emotion: '🌈',
    emotionCategory: 'hopeful',
    mood: 'Hopeful',
    title: '희망찬 미래',
    note: 'Looking forward to the future. So many possibilities ahead!',
    weather: '비',
    activities: ['계획 세우기'],
    aiComment: '미래에 대한 기대감이 느껴져요. 긍정적인 마음가짐이 좋아요!',
  },
  '2025-11-25': {
    id: 'd11',
    date: '2025-11-25',
    emotion: '😴',
    emotionCategory: 'tired',
    mood: 'Tired',
    title: '긴 하루',
    note: 'Long day but productive. Need to get some rest tonight.',
    weather: '흐림',
    activities: ['작업'],
    aiComment: '오늘 하루도 수고 많으셨어요. 푹 쉬시고 내일을 준비하세요!',
  },
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate AI comment based on mood and note
const generateAIComment = (mood: string, note: string): string => {
  const comments = [
    '오늘 하루도 수고하셨어요! 당신의 감정을 소중히 기록해주셔서 감사합니다.',
    '멋진 하루네요! 이런 순간들을 기억하는 것이 중요해요.',
    '당신의 이야기를 들을 수 있어서 좋아요. 항상 응원하고 있어요!',
    '감정을 표현하는 것은 정말 중요해요. 잘하고 계세요!',
    '오늘의 경험이 내일의 성장으로 이어질 거예요. 파이팅!',
  ];
  return comments[Math.floor(Math.random() * comments.length)];
};

/**
 * GET /diaries/heatMap
 * 해당 사용자, 해당 연월 날짜별 감정 조회
 */
export async function fetchMonthlyEmotions(year: number, month: number): Promise<EmotionData[]> {
  await delay(300);
  
  const yearMonth = `${year}-${String(month + 1).padStart(2, '0')}`;
  
  return mockEmotionData.filter(data => data.date.startsWith(yearMonth));
}

/**
 * GET /diaries/details
 * 선택 날짜, 감정 분류별, 감정별 조회
 */
export async function fetchDiaryDetails(date: string): Promise<DiaryDetail | null> {
  await delay(200);
  
  return mockDiaryDetails[date] || null;
}

/**
 * POST /diaries
 * 일기 작성
 */
export async function createDiary(data: CreateDiaryRequest): Promise<DiaryDetail> {
  await delay(500);
  
  const aiComment = generateAIComment(data.mood, data.note);
  
  const newDiary: DiaryDetail = {
    id: `d${Date.now()}`,
    ...data,
    emotionCategory: data.emotion === '😊' || data.emotion === '😄' || data.emotion === '🌟' ? 'happy' :
                     data.emotion === '🥰' || data.emotion === '💖' ? 'love' :
                     data.emotion === '😌' ? 'calm' :
                     data.emotion === '🎉' || data.emotion === '✨' ? 'excited' :
                     data.emotion === '🤗' ? 'grateful' :
                     data.emotion === '😴' ? 'tired' : 'neutral',
    aiComment,
  };
  
  mockDiaryDetails[data.date] = newDiary;
  
  // Update heatmap data
  const existingIndex = mockEmotionData.findIndex(e => e.date === data.date);
  if (existingIndex >= 0) {
    mockEmotionData[existingIndex] = {
      date: data.date,
      emotion: data.emotion,
      emotionCategory: newDiary.emotionCategory,
    };
  } else {
    mockEmotionData.push({
      date: data.date,
      emotion: data.emotion,
      emotionCategory: newDiary.emotionCategory,
    });
  }
  
  return newDiary;
}

/**
 * PATCH /diaries/{id}
 * 일기 수정
 */
export async function updateDiary(id: string, date: string, data: UpdateDiaryRequest): Promise<DiaryDetail> {
  await delay(400);
  
  const existing = mockDiaryDetails[date];
  if (!existing) {
    throw new Error('Diary not found');
  }
  
  const aiComment = generateAIComment(data.mood, data.note);
  
  const updatedDiary: DiaryDetail = {
    ...existing,
    ...data,
    emotionCategory: data.emotion === '😊' || data.emotion === '😄' || data.emotion === '🌟' ? 'happy' :
                     data.emotion === '🥰' || data.emotion === '💖' ? 'love' :
                     data.emotion === '😌' ? 'calm' :
                     data.emotion === '🎉' || data.emotion === '✨' ? 'excited' :
                     data.emotion === '🤗' ? 'grateful' :
                     data.emotion === '😴' ? 'tired' : 'neutral',
    aiComment,
  };
  
  mockDiaryDetails[date] = updatedDiary;
  
  // Update heatmap data
  const existingIndex = mockEmotionData.findIndex(e => e.date === date);
  if (existingIndex >= 0) {
    mockEmotionData[existingIndex] = {
      date: date,
      emotion: data.emotion,
      emotionCategory: updatedDiary.emotionCategory,
    };
  }
  
  return updatedDiary;
}

/**
 * DELETE /diaries/{id}
 * 일기 삭제
 */
export async function deleteDiary(id: string, date: string): Promise<void> {
  await delay(300);
  
  delete mockDiaryDetails[date];
  
  // Remove from heatmap
  mockEmotionData = mockEmotionData.filter(e => e.date !== date);
}

/**
 * GET /stats/daily?month={YYYY-MM}
 * 해당 월의 일별 감정 통계 조회
 */
export interface DailyStats {
  date: string;
  emotion: string;
  emotionCategory: string;
  title: string;
}

export async function fetchDailyStats(yearMonth: string): Promise<DailyStats[]> {
  await delay(300);
  
  // Filter diaries by yearMonth
  const stats: DailyStats[] = [];
  
  Object.values(mockDiaryDetails)
    .filter(diary => diary.date.startsWith(yearMonth))
    .forEach(diary => {
      stats.push({
        date: diary.date,
        emotion: diary.emotion,
        emotionCategory: diary.emotionCategory,
        title: diary.title,
      });
    });
  
  return stats;
}

/**
 * GET /stats/chart?start={YYYY-MM-DD}&end={YYYY-MM-DD}&type={weekly|monthly}
 * 기간별 감정 변화 추이 데이터 조회 (Aggregation)
 */
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

export async function fetchChartStats(
  startDate: string,
  endDate: string,
  type: 'weekly' | 'monthly'
): Promise<ChartDataPoint[]> {
  await delay(400);
  
  // Get all diaries in date range
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const filteredDiaries = Object.values(mockDiaryDetails).filter(diary => {
    const diaryDate = new Date(diary.date);
    return diaryDate >= start && diaryDate <= end;
  });
  
  // Aggregate by date
  const aggregated: { [key: string]: ChartDataPoint } = {};
  
  filteredDiaries.forEach(diary => {
    const date = diary.date;
    
    if (!aggregated[date]) {
      aggregated[date] = {
        date,
        displayLabel: formatDateLabel(date, type),
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
    
    // Increment emotion category count
    const category = diary.emotionCategory as keyof Omit<ChartDataPoint, 'date' | 'displayLabel' | 'total'>;
    if (category in aggregated[date]) {
      aggregated[date][category]++;
      aggregated[date].total++;
    }
  });
  
  // Convert to array and sort by date
  return Object.values(aggregated).sort((a, b) => a.date.localeCompare(b.date));
}

function formatDateLabel(dateStr: string, type: 'weekly' | 'monthly'): string {
  const date = new Date(dateStr);
  if (type === 'weekly') {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  } else {
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
}

/**
 * GET /diaries/search?keyword={keyword}&page={page}&limit={limit}
 * 일기 검색 및 목록 조회 (페이지네이션)
 */
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

export async function searchDiaries(params: DiarySearchParams): Promise<DiarySearchResult> {
  await delay(300);
  
  const {
    keyword = '',
    startDate,
    endDate,
    emotionCategory,
    page = 1,
    limit = 10,
  } = params;
  
  // Filter diaries
  let filtered = Object.values(mockDiaryDetails);
  
  // Keyword search (title or note)
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = filtered.filter(diary => 
      diary.title.toLowerCase().includes(lowerKeyword) ||
      diary.note.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // Date range filter
  if (startDate) {
    filtered = filtered.filter(diary => diary.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter(diary => diary.date <= endDate);
  }
  
  // Emotion category filter
  if (emotionCategory) {
    filtered = filtered.filter(diary => diary.emotionCategory === emotionCategory);
  }
  
  // Sort by date (newest first)
  filtered.sort((a, b) => b.date.localeCompare(a.date));
  
  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const diaries = filtered.slice(startIndex, endIndex);
  
  return {
    diaries,
    total,
    page,
    totalPages,
  };
}