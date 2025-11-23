import { useState, useEffect } from 'react';
import { Calendar, Loader2, Edit2, Trash2 } from 'lucide-react';
import { fetchDiaryDetails, DiaryDetail, deleteDiary } from '../services/diaryApi';

interface DaySummaryPageProps {
  selectedDate: Date | null;
  onDataChange?: () => void;
  onEdit?: () => void;
  onStartWriting?: () => void;
  onBackToCalendar?: () => void;
}

export function DaySummaryPage({ selectedDate, onDataChange, onEdit, onStartWriting, onBackToCalendar }: DaySummaryPageProps) {
  const [entry, setEntry] = useState<DiaryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      loadDiaryDetails();
    } else {
      setEntry(null);
    }
  }, [selectedDate]);

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

  const handleDelete = async () => {
    if (!entry || !selectedDate) return;

    setIsLoading(true);
    try {
      const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      await deleteDiary(entry.id, dateKey);
      setEntry(null);
      setShowDeleteConfirm(false);
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