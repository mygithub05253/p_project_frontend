// 타입 어댑터 - 기존 코드와의 호환성을 위한 변환 함수
import type { User } from '../types/entities';
import type { DiaryDetail } from '../types/api';

/**
 * 백엔드 User 타입을 프론트엔드에서 사용하는 형식으로 변환
 */
export function adaptUser(user: User): {
  id: string;
  email: string;
  name: string;
  notificationEnabled?: boolean;
} {
  return {
    id: user.user_id.toString(),
    email: user.email,
    name: user.nickname,
    notificationEnabled: user.alert_push || user.alert_email,
  };
}

/**
 * primary_emotion을 이모지로 변환
 */
function emotionToEmoji(primaryEmotion: string, emotionScore: number): string {
  const emotion = primaryEmotion?.toLowerCase() || '';
  
  if (emotion.includes('happy') || emotionScore > 0.5) return '😊';
  if (emotion.includes('sad') || emotionScore < -0.5) return '😢';
  if (emotion.includes('angry')) return '😠';
  if (emotion.includes('anxious')) return '😰';
  if (emotion.includes('love')) return '🥰';
  if (emotion.includes('excited')) return '✨';
  if (emotion.includes('calm')) return '😌';
  if (emotion.includes('tired')) return '😴';
  if (emotion.includes('grateful')) return '🤗';
  if (emotion.includes('hopeful')) return '🌈';
  
  return '😊'; // 기본값
}

/**
 * primary_emotion을 emotionCategory로 변환
 */
function emotionToCategory(primaryEmotion: string, emotionScore: number): string {
  const emotion = primaryEmotion?.toLowerCase() || '';
  
  if (emotion.includes('happy') || emotionScore > 0.5) return 'happy';
  if (emotion.includes('sad') || emotionScore < -0.5) return 'sad';
  if (emotion.includes('angry')) return 'angry';
  if (emotion.includes('anxious')) return 'anxious';
  if (emotion.includes('love')) return 'love';
  if (emotion.includes('excited')) return 'excited';
  if (emotion.includes('calm')) return 'calm';
  if (emotion.includes('tired')) return 'tired';
  if (emotion.includes('grateful')) return 'grateful';
  if (emotion.includes('hopeful')) return 'hopeful';
  
  return 'neutral';
}

/**
 * DiaryDetail을 기존 형식으로 변환 (점진적 마이그레이션용)
 */
export function adaptDiaryDetail(diaryDetail: DiaryDetail): {
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
} {
  const emotionAnalysis = diaryDetail.emotionAnalysis;
  const diary = diaryDetail.diary;
  
  const emotionScore = emotionAnalysis?.emotion_score || 0;
  const primaryEmotion = emotionAnalysis?.primary_emotion || 'Neutral';
  
  const emotion = emotionToEmoji(primaryEmotion, emotionScore);
  const emotionCategory = emotionToCategory(primaryEmotion, emotionScore);
  
  // content에서 title과 note 추출 (간단한 파싱)
  // 실제로는 백엔드에서 title을 별도로 제공하거나, content의 첫 줄을 title로 사용
  const content = diary.content || '';
  const lines = content.split('\n');
  const title = lines[0] || '제목 없음';
  const note = lines.slice(1).join('\n') || content;
  
  return {
    id: diary.diary_id.toString(),
    date: diary.written_date,
    emotion,
    emotionCategory,
    mood: primaryEmotion,
    title,
    note,
    weather: diary.weather || undefined,
    activities: [], // ERD에 activities 필드가 없으므로 빈 배열
    aiComment: emotionAnalysis?.ai_comment || undefined,
  };
}

/**
 * CreateDiaryRequest를 백엔드 형식으로 변환
 */
export function adaptCreateDiaryRequest(data: {
  date: string;
  title: string;
  note: string;
  emotion: string;
  mood: string;
  weather?: string;
  activities?: string[];
}): {
  written_date: string;
  content: string;
  weather?: string;
} {
  // title과 note를 content로 합침
  const content = `${data.title}\n${data.note}`;
  
  return {
    written_date: data.date,
    content,
    weather: data.weather,
  };
}

/**
 * UpdateDiaryRequest를 백엔드 형식으로 변환
 */
export function adaptUpdateDiaryRequest(data: {
  title: string;
  note: string;
  emotion: string;
  mood: string;
  weather?: string;
  activities?: string[];
}): {
  content: string;
  weather?: string;
} {
  // title과 note를 content로 합침
  const content = `${data.title}\n${data.note}`;
  
  return {
    content,
    weather: data.weather,
  };
}

