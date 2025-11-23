// Risk detection logic for mental health alerts

import { DiaryDetail, fetchDiaryDetails } from './diaryApi';

export interface RiskAnalysis {
  isAtRisk: boolean;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  reasons: string[];
  recentNegativeCount: number;
  consecutiveNegativeDays: number;
}

const NEGATIVE_EMOTIONS = ['sad', 'angry', 'anxious', 'tired'];
const HIGH_RISK_EMOTIONS = ['sad', 'angry', 'anxious'];

/**
 * Analyze user's recent diary entries for risk signals
 * Returns risk analysis based on emotion patterns
 */
export async function analyzeRiskSignals(daysToCheck: number = 14): Promise<RiskAnalysis> {
  const today = new Date();
  const reasons: string[] = [];
  let recentNegativeCount = 0;
  let consecutiveNegativeDays = 0;
  let maxConsecutive = 0;
  let highRiskCount = 0;

  // Check recent days
  const recentDiaries: (DiaryDetail | null)[] = [];
  for (let i = 0; i < daysToCheck; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    
    const dateKey = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    
    try {
      const diary = await fetchDiaryDetails(dateKey);
      recentDiaries.push(diary);
      
      if (diary && NEGATIVE_EMOTIONS.includes(diary.emotionCategory)) {
        recentNegativeCount++;
        consecutiveNegativeDays++;
        
        if (HIGH_RISK_EMOTIONS.includes(diary.emotionCategory)) {
          highRiskCount++;
        }
      } else {
        if (consecutiveNegativeDays > maxConsecutive) {
          maxConsecutive = consecutiveNegativeDays;
        }
        consecutiveNegativeDays = 0;
      }
    } catch {
      recentDiaries.push(null);
      if (consecutiveNegativeDays > maxConsecutive) {
        maxConsecutive = consecutiveNegativeDays;
      }
      consecutiveNegativeDays = 0;
    }
  }

  // Final check for consecutive days
  if (consecutiveNegativeDays > maxConsecutive) {
    maxConsecutive = consecutiveNegativeDays;
  }

  // Determine risk level and reasons
  let riskLevel: 'none' | 'low' | 'medium' | 'high' = 'none';
  let isAtRisk = false;

  // High risk: 5+ consecutive negative days OR 8+ high-risk emotions in 14 days
  if (maxConsecutive >= 5 || highRiskCount >= 8) {
    riskLevel = 'high';
    isAtRisk = true;
    if (maxConsecutive >= 5) {
      reasons.push(`최근 ${maxConsecutive}일 연속으로 부정적인 감정이 기록되었습니다.`);
    }
    if (highRiskCount >= 8) {
      reasons.push(`최근 14일 중 ${highRiskCount}일에 우울, 분노, 불안 등의 감정이 기록되었습니다.`);
    }
  }
  // Medium risk: 3-4 consecutive negative days OR 5-7 negative emotions
  else if (maxConsecutive >= 3 || recentNegativeCount >= 5) {
    riskLevel = 'medium';
    isAtRisk = true;
    if (maxConsecutive >= 3) {
      reasons.push(`최근 ${maxConsecutive}일 연속으로 부정적인 감정이 기록되었습니다.`);
    }
    if (recentNegativeCount >= 5) {
      reasons.push(`최근 14일 중 ${recentNegativeCount}일에 부정적인 감정이 기록되었습니다.`);
    }
  }
  // Low risk: 2 consecutive negative days OR 3-4 negative emotions
  else if (maxConsecutive >= 2 || recentNegativeCount >= 3) {
    riskLevel = 'low';
    reasons.push('최근 부정적인 감정이 반복되고 있습니다.');
  }

  return {
    isAtRisk,
    riskLevel,
    reasons,
    recentNegativeCount,
    consecutiveNegativeDays: maxConsecutive,
  };
}

/**
 * Get notification message based on risk level
 */
export function getRiskNotificationMessage(riskLevel: 'low' | 'medium' | 'high'): string {
  switch (riskLevel) {
    case 'high':
      return '최근 감정 패턴에서 심각한 위험 신호가 감지되었습니다. 전문가의 도움을 받는 것을 권장합니다.';
    case 'medium':
      return '최근 부정적인 감정이 지속되고 있습니다. 감정 상태를 돌아보고 필요시 전문가와 상담해보세요.';
    case 'low':
      return '최근 부정적인 감정이 반복되고 있습니다. 잠시 시간을 내어 자신을 돌아보세요.';
    default:
      return '';
  }
}
