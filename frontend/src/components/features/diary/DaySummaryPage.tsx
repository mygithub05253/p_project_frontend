/**
 * DaySummaryPage.tsx
 * 
 * 유스케이스: UC-23 일기 상세 조회, UC-26 일기 삭제
 * 시퀀스: DiaryBook -> DaySummaryPage -> fetchDiaryDetails API 호출 -> 일기 상세 정보 표시 -> 수정/삭제 버튼 클릭 -> 수정/삭제 처리
 * 
 * 주요 기능:
 * - 선택된 날짜의 일기 상세 정보 조회 및 표시
 * - 일기 수정 버튼 클릭 시 작성 페이지로 전환
 * - 일기 삭제 버튼 클릭 시 확인 모달 표시 및 삭제 처리
 * - 일기가 없는 경우 작성 유도 메시지 표시
 */
import { useState, useEffect } from 'react';
import { Calendar, Loader2, Edit2, Trash2 } from 'lucide-react';
import { fetchDiaryDetails, deleteDiary } from '../../../services/diaryApi';
import type { DiaryDetail } from '../../../services/diaryApi';

interface DaySummaryPageProps {
  selectedDate: Date | null;
  onDataChange?: () => void;
  onEdit?: () => void;
  onStartWriting?: () => void;
  onBackToCalendar?: () => void;
}

export function DaySummaryPage({ selectedDate, onDataChange, onEdit, onStartWriting, onBackToCalendar }: DaySummaryPageProps) {
  // 현재 조회 중인 일기 상세 정보
  const [entry, setEntry] = useState<DiaryDetail | null>(null);
  // API 호출 중 여부
  const [isLoading, setIsLoading] = useState(false);
  // 삭제 확인 모달 표시 여부
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * 유스케이스: UC-23 일기 상세 조회
   * 시퀀스: selectedDate 변경 -> DaySummaryPage -> fetchDiaryDetails API 호출 -> 일기 데이터 로드 -> 화면에 표시
   * 
   * 선택된 날짜가 변경될 때마다 해당 날짜의 일기 상세 정보를 조회하여 표시
   */
  useEffect(() => {
    if (selectedDate) {
      loadDiaryDetails();
    } else {
      setEntry(null);
    }
  }, [selectedDate]);

  /**
   * 일기 상세 정보 로드
   */
  const loadDiaryDetails = async () => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      const data = await fetchDiaryDetails(dateKey);
      setEntry(data);
    } catch (error) {
      console.error('Failed to load diary details:', error);
      setEntry(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 유스케이스: UC-26 일기 삭제
   * 시퀀스: 삭제 버튼 클릭 -> 확인 모달 표시 -> 확인 클릭 -> deleteDiary API 호출 -> 일기 삭제 -> 데이터 변경 처리 -> 캘린더로 이동
   * 
   * 사용자가 확인을 누르면 해당 일기를 영구 삭제하고
   * 데이터 변경을 알려 캘린더를 새로고침한 후 캘린더 화면으로 이동
   */
  const handleDelete = async () => {
    if (!entry || !selectedDate) return;

    setIsLoading(true);
    try {
      const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      await deleteDiary(entry.id, dateKey);
      setEntry(null);
      setShowDeleteConfirm(false);
      // 데이터 변경 알림 (캘린더 새로고침)
      if (onDataChange) {
        onDataChange();
      }
      // 삭제 후 캘린더로 돌아가기
      if (onBackToCalendar) {
        onBackToCalendar();
      }
    } catch (error) {
      console.error('Failed to delete diary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedDate) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-2 py-12">
        <Calendar className="w-8 h-8" />
        <p className="text-xs text-center">날짜를 선택하면<br />일기를 확인할 수 있어요</p>
      </div>
    );
  }

  const formattedDate = selectedDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-3 py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        <p className="text-xs">불러오는 중...</p>
      </div>
    );
  }

  // View Mode - Entry exists
  if (entry) {
    return (
      <div className="space-y-4 h-full flex flex-col">
        {/* Date Header */}
        <div className="border-b border-stone-300/50 pb-2">
          <div className="text-xs text-stone-500">오늘의 일기</div>
          <div className="text-sm text-stone-700 mt-0.5">{formattedDate}</div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {/* Title */}
          <div>
            <h3 className="text-stone-800">{entry.title}</h3>
          </div>

          {/* Emotion & Info */}
          <div className="flex items-start gap-3">
            <span className="text-4xl">{entry.emotion}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div>
                  <div className="text-xs text-stone-500">기분</div>
                  <div className="text-stone-700">{entry.mood}</div>
                </div>
                {entry.weather && (
                  <div className="ml-auto">
                    <div className="text-xs text-stone-500">날씨</div>
                    <div className="text-sm text-stone-700">{entry.weather}</div>
                  </div>
                )}
              </div>
              
              {entry.activities && entry.activities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {entry.activities.map((activity, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          <div>
            <div className="text-xs text-stone-500 mb-2">메모</div>
            <p className="text-sm text-stone-700 leading-loose whitespace-pre-wrap">
              {entry.note}
            </p>
          </div>

          {/* AI Comment */}
          {entry.aiComment && (
            <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200/50">
              <div className="text-xs text-amber-700 mb-1 flex items-center gap-1">
                <span>✨</span>
                <span>AI 코멘트</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                {entry.aiComment}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-stone-200">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 text-xs text-amber-700 hover:text-amber-800 transition-colors px-3 py-2 bg-amber-100/50 rounded-lg hover:bg-amber-100"
          >
            <Edit2 className="w-3.5 h-3.5" />
            수정하기
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-1 text-xs text-rose-700 hover:text-rose-800 transition-colors px-3 py-2 bg-rose-100/50 rounded-lg hover:bg-rose-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            삭제
          </button>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center p-4 rounded-r-lg">
            <div className="bg-white rounded-xl p-4 shadow-xl max-w-xs">
              <h4 className="text-stone-800 mb-2">일기 삭제</h4>
              <p className="text-sm text-stone-600 mb-4">
                정말 이 일기를 삭제하시겠어요?<br />
                삭제하면 복구할 수 없어요.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 text-sm px-3 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 text-sm px-3 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // No entry - show create prompt
  return (
    <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-3 py-12">
      <Calendar className="w-8 h-8" />
      <div className="text-center">
        <div className="text-sm text-stone-600 mb-3">
          아직 작성된 일기가 없어요
        </div>
        <button 
          onClick={onStartWriting}
          className="text-xs text-amber-700 hover:text-amber-800 transition-colors px-4 py-2 bg-amber-100/50 rounded-lg hover:bg-amber-100"
        >
          일기 작성하기
        </button>
      </div>
    </div>
  );
}