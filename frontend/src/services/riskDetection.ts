/**
 * riskDetection.ts
 * 
 * 유스케이스: UC-14 위험 신호 감지 및 알림
 * 시퀀스: DiaryBook -> fetchRecentDiariesForRiskAnalysis -> 최근 일기 조회 -> analyzeRiskSignals -> 위험도 평가 -> RiskAnalysis 반환 -> 알림 모달 표시
 * 
 * 주요 기능:
 * - 최근 14일간 일기 데이터 조회
 * - 부정 감정 패턴 분석 (부정 감정 비율, 연속 부정 감정 일수, 고위험 감정 패턴)
 * - 위험도 평가 (none, low, medium, high)
 * - 위험 신호 감지 시 알림 모달 표시
 */
// Risk Detection Service
import { fetchDiaryDetails } from './diaryApi';
import type { DiaryDetail } from './diaryApi';

export interface RiskAnalysis {
  isAtRisk: boolean;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  reasons: string[];
  recentNegativeCount: number;
  consecutiveNegativeDays: number;
}

// 부정 감정 카테고리 목록
const NEGATIVE_EMOTIONS = ['sad', 'angry', 'anxious', 'tired'];
// 고위험 감정 카테고리 목록
const HIGH_RISK_EMOTIONS = ['sad', 'angry', 'anxious'];

/**
 * 유스케이스: UC-14 위험 신호 분석
 * 시퀀스: 최근 일기 데이터 수신 -> 부정 감정 카운트 -> 연속 부정 감정 일수 계산 -> 위험도 평가 -> RiskAnalysis 반환
 * 
 * 최근 14일간의 일기 데이터를 분석하여 부정 감정 패턴을 감지하고
 * 위험도를 평가하여 사용자에게 알림을 제공할지 결정
 */
export async function analyzeRiskSignals(
  recentDiaries: DiaryDetail[]
): Promise<RiskAnalysis> {
  // 안전성 체크: recentDiaries가 없거나 배열이 아닌 경우
  if (!recentDiaries || !Array.isArray(recentDiaries) || recentDiaries.length === 0) {
    return {
      isAtRisk: false,
      riskLevel: 'none',
      reasons: [],
      recentNegativeCount: 0,
      consecutiveNegativeDays: 0,
    };
  }

  // 최근 14일 데이터 분석
  const recent14Days = recentDiaries.slice(0, 14);
  
  // 부정 감정 카운트
  const negativeCount = recent14Days.filter(diary => {
    // 안전성 체크
    if (!diary) return false;
    const emotionCategory = diary.emotionCategory?.toLowerCase() || '';
    return NEGATIVE_EMOTIONS.some(neg => emotionCategory.includes(neg));
  }).length;

  // 연속 부정 감정 일수 계산
  let consecutiveNegativeDays = 0;
  for (const diary of recent14Days) {
    // 안전성 체크
    if (!diary) break;
    const emotionCategory = diary.emotionCategory?.toLowerCase() || '';
    const isNegative = NEGATIVE_EMOTIONS.some(neg => emotionCategory.includes(neg));
    
    if (isNegative) {
      consecutiveNegativeDays++;
    } else {
      break;
    }
  }

  // 위험도 평가
  const reasons: string[] = [];
  let riskLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
  let isAtRisk = false;

  // 일기가 적을 때도 위험 신호 감지 (최소 1개 이상)
  if (recent14Days.length > 0) {
    const negativeRatio = negativeCount / recent14Days.length;
    
    // 위험 신호 판단
    if (negativeRatio >= 0.8) {
      isAtRisk = true;
      riskLevel = 'high';
      reasons.push('최근 2주간 부정 감정이 80% 이상입니다.');
    } else if (negativeRatio >= 0.6) {
      isAtRisk = true;
      riskLevel = 'medium';
      reasons.push('최근 2주간 부정 감정이 60% 이상입니다.');
    } else if (negativeRatio >= 0.4) {
      riskLevel = 'low';
      reasons.push('최근 2주간 부정 감정이 40% 이상입니다.');
    }
    
    // 일기가 적을 때 (1-3개) 부정 감정이 있으면 경고
    if (recent14Days.length <= 3 && negativeCount > 0) {
      isAtRisk = true;
      if (riskLevel === 'none') riskLevel = 'low';
      reasons.push('최근 작성한 일기에서 부정 감정이 감지되었습니다.');
    }
  }

  if (consecutiveNegativeDays >= 7) {
    isAtRisk = true;
    if (riskLevel === 'low') riskLevel = 'medium';
    if (riskLevel === 'medium') riskLevel = 'high';
    reasons.push(`${consecutiveNegativeDays}일 연속 부정 감정이 기록되었습니다.`);
  }

  // 고위험 감정 패턴 확인
  const highRiskCount = recent14Days.filter(diary => {
    // 안전성 체크
    if (!diary) return false;
    const emotionCategory = diary.emotionCategory?.toLowerCase() || '';
    return HIGH_RISK_EMOTIONS.some(risk => emotionCategory.includes(risk));
  }).length;

  if (highRiskCount >= 5) {
    isAtRisk = true;
    if (riskLevel === 'low') riskLevel = 'medium';
    if (riskLevel === 'medium') riskLevel = 'high';
    reasons.push('고위험 감정 패턴이 감지되었습니다.');
  }

  return {
    isAtRisk,
    riskLevel,
    reasons,
    recentNegativeCount: negativeCount,
    consecutiveNegativeDays,
  };
}

/**
 * 유스케이스: UC-14 위험 신호 감지를 위한 최근 일기 조회
 * 시퀀스: DiaryBook -> fetchRecentDiariesForRiskAnalysis -> 최근 N일간 일기 조회 -> DiaryDetail 배열 반환
 * 
 * 위험 신호 분석을 위해 최근 N일간의 일기 데이터를 조회하여
 * analyzeRiskSignals 함수에 전달
 */
export async function fetchRecentDiariesForRiskAnalysis(
  days: number = 14
): Promise<DiaryDetail[]> {
  const today = new Date();
  const diaries: DiaryDetail[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    try {
      const diary = await fetchDiaryDetails(dateStr);
      if (diary) {
        // fetchDiaryDetails는 DiaryDetail | null을 반환하지만,
        // 백엔드 형식이므로 그대로 사용 (analyzeRiskSignals에서 처리)
        diaries.push(diary);
      }
    } catch (error) {
      // 일기가 없거나 오류가 발생한 경우 무시
      console.warn(`Failed to fetch diary for ${dateStr}:`, error);
    }
  }

  return diaries;
}
