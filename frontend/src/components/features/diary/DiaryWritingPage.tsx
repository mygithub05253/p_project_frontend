/**
 * DiaryWritingPage.tsx
 * 
 * 유스케이스: UC-24 일기 작성, UC-25 일기 수정
 * 시퀀스: DiaryBook -> DiaryWritingPage -> 기존 일기 조회 -> 폼 입력 -> 저장 -> createDiary/updateDiary API 호출 -> 감정 분석 결과 표시 -> DiaryBook
 * 
 * 주요 기능:
 * - 일기 제목, 내용, 감정, 날씨, 활동 입력
 * - 기존 일기 조회 및 폼에 자동 채우기
 * - 일기 저장 시 신규 작성 또는 수정 처리
 * - 저장 후 감정 분석 결과 모달 표시
 */
import { useState, useEffect } from 'react';
import { X, Check, Image as ImageIcon, Smile } from 'lucide-react';
import { fetchDiaryDetails, createDiary, updateDiary } from '../../../services/diaryApi';
import type { CreateDiaryRequest, UpdateDiaryRequest, DiaryDetail } from '../../../services/diaryApi';
import { EmotionAnalysisModal } from '../analysis/EmotionAnalysisModal';

interface DiaryWritingPageProps {
  selectedDate: Date | null;
  onFinish: () => void;
  onCancel: () => void;
}

const EMOTION_OPTIONS = [
  { emoji: '😊', label: '행복', color: 'bg-yellow-100' },
  { emoji: '😄', label: '기쁨', color: 'bg-yellow-200' },
  { emoji: '🥰', label: '사랑', color: 'bg-pink-100' },
  { emoji: '💖', label: '감동', color: 'bg-pink-200' },
  { emoji: '😌', label: '평온', color: 'bg-blue-100' },
  { emoji: '🤗', label: '감사', color: 'bg-green-100' },
  { emoji: '✨', label: '설렘', color: 'bg-purple-100' },
  { emoji: '🎉', label: '신남', color: 'bg-red-100' },
  { emoji: '🌟', label: '영감', color: 'bg-amber-100' },
  { emoji: '🌈', label: '희망', color: 'bg-indigo-100' },
  { emoji: '😴', label: '피곤', color: 'bg-gray-100' },
  { emoji: '😢', label: '슬픔', color: 'bg-blue-200' },
];

const WEATHER_OPTIONS = ['☀️ 맑음', '⛅ 흐림', '🌧️ 비', '⛈️ 천둥', '🌨️ 눈', '🌫️ 안개'];

export function DiaryWritingPage({ selectedDate, onFinish, onCancel }: DiaryWritingPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [existingEntry, setExistingEntry] = useState<DiaryDetail | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [emotion, setEmotion] = useState('😊');
  const [mood, setMood] = useState('');
  const [weather, setWeather] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [activityInput, setActivityInput] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Emotion Analysis Modal state
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [emotionResult, setEmotionResult] = useState<{
    emotion: string | null;
    emotionCategory: string | null;
    aiComment: string | null;
    error: string | null;
  }>({
    emotion: null,
    emotionCategory: null,
    aiComment: null,
    error: null,
  });

  /**
   * 유스케이스: UC-23 일기 상세 조회 (작성 모드)
   * 시퀀스: DiaryWritingPage 마운트 -> selectedDate 변경 -> fetchDiaryDetails API 호출 -> 기존 일기 데이터 로드 -> 폼에 자동 채우기
   * 
   * 선택된 날짜에 기존 일기가 있는지 확인하고
   * 있으면 폼에 자동으로 채워서 수정 모드로 전환
   */
  useEffect(() => {
    if (selectedDate) {
      loadExistingDiary();
    }
  }, [selectedDate]);

  /**
   * 기존 일기 데이터 로드
   */
  const loadExistingDiary = async () => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      const data = await fetchDiaryDetails(dateKey);
      
      if (data) {
        setExistingEntry(data);
        setTitle(data.title);
        setNote(data.note);
        setEmotion(data.emotion);
        setMood(data.mood);
        setWeather(data.weather || '');
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Failed to load diary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 유스케이스: UC-24 일기 작성, UC-25 일기 수정
   * 시퀀스: 저장 버튼 클릭 -> 입력값 검증 -> createDiary/updateDiary API 호출 -> 감정 분석 결과 수신 -> 감정 분석 모달 표시 -> onFinish 콜백 호출
   * 
   * 사용자가 입력한 일기 내용을 저장하고
   * 기존 일기가 있으면 수정, 없으면 신규 작성으로 처리
   * 저장 후 감정 분석 결과를 모달로 표시
   */
  const handleSave = async () => {
    if (!selectedDate || !title.trim() || !note.trim()) return;

    setIsLoading(true);
    try {
      const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      
      let result: DiaryDetail;
      
      // 기존 일기가 있으면 수정, 없으면 신규 작성
      if (existingEntry) {
        const request: UpdateDiaryRequest = {
          title: title.trim(),
          note: note.trim(),
          emotion,
          mood: mood.trim(),
          weather: weather.trim() || undefined,
          activities: activities.length > 0 ? activities : undefined,
        };
        result = await updateDiary(existingEntry.id, dateKey, request);
      } else {
        const request: CreateDiaryRequest = {
          date: dateKey,
          title: title.trim(),
          note: note.trim(),
          emotion,
          mood: mood.trim(),
          weather: weather.trim() || undefined,
          activities: activities.length > 0 ? activities : undefined,
        };
        result = await createDiary(request);
      }
      
      // 감정 분석 결과 모달 표시
      setEmotionResult({
        emotion: result.emotion,
        emotionCategory: result.emotionCategory,
        aiComment: result.aiComment || null,
        error: result.aiComment ? null : 'AI_SERVICE_UNAVAILABLE',
      });
      setShowEmotionModal(true);
    } catch (error) {
      console.error('Failed to save diary:', error);
      // 에러 모달 표시
      setEmotionResult({
        emotion: null,
        emotionCategory: null,
        aiComment: null,
        error: 'SAVE_FAILED',
      });
      setShowEmotionModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmotionModalClose = () => {
    setShowEmotionModal(false);
    // Close modal and return to calendar
    onFinish();
  };

  const handleAddActivity = () => {
    if (activityInput.trim() && !activities.includes(activityInput.trim())) {
      setActivities([...activities, activityInput.trim()]);
      setActivityInput('');
    }
  };

  const handleRemoveActivity = (activity: string) => {
    setActivities(activities.filter(a => a !== activity));
  };

  const handleAddImage = () => {
    // Simulate image upload - in real app, this would open file picker
    const mockImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';
    setImages([...images, mockImage]);
  };

  if (!selectedDate) return null;

  const formattedDate = selectedDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <div className="flex h-full relative">
      {/* Emotion Analysis Modal */}
      <EmotionAnalysisModal
        isOpen={showEmotionModal}
        onClose={handleEmotionModalClose}
        emotion={emotionResult.emotion}
        emotionCategory={emotionResult.emotionCategory}
        aiComment={emotionResult.aiComment}
        error={emotionResult.error}
      />

      {/* Left Page */}
      <div className="flex-1 relative">
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none rounded-l-lg"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1719563015025-83946fb49e49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBwYXBlciUyMHRleHR1cmV8ZW58MXx8fHwxNzYzNTI2MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative p-8 h-full flex flex-col overflow-y-auto">
          {/* Date Header */}
          <div className="border-b border-stone-300/50 pb-3 mb-4">
            <div className="text-xs text-stone-500">
              {existingEntry ? '일기 수정' : '일기 작성'}
            </div>
            <div className="text-sm text-stone-700 mt-0.5">{formattedDate}</div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="text-xs text-stone-500 block mb-2">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="오늘의 제목을 입력하세요"
              className="w-full px-0 py-2 text-lg bg-transparent border-b-2 border-stone-300 focus:border-amber-600 outline-none text-stone-800 placeholder:text-stone-400"
            />
          </div>

          {/* Emotion Selector */}
          <div className="mb-4">
            <label className="text-xs text-stone-500 block mb-2">오늘의 감정</label>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/80 rounded-lg border border-stone-300 transition-colors"
            >
              <span className="text-3xl">{emotion}</span>
              <span className="text-sm text-stone-600">
                {EMOTION_OPTIONS.find(e => e.emoji === emotion)?.label || '감정 선택'}
              </span>
              <Smile className="w-4 h-4 ml-auto text-stone-500" />
            </button>

            {/* Emoji Picker - with scroll container */}
            {showEmojiPicker && (
              <div className="mt-2 p-3 bg-white rounded-lg shadow-lg border border-stone-200 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-4 gap-2">
                  {EMOTION_OPTIONS.map((option) => (
                    <button
                      key={option.emoji}
                      onClick={() => {
                        setEmotion(option.emoji);
                        setShowEmojiPicker(false);
                      }}
                      className={`${option.color} p-3 rounded-lg hover:scale-110 transition-all flex flex-col items-center gap-1`}
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-xs text-stone-600">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mood & Weather */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-stone-500 block mb-1">기분</label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="행복, 평온..."
                className="w-full px-2 py-1.5 text-sm bg-white/50 border border-stone-300 rounded focus:border-amber-600 outline-none text-stone-800"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 block mb-1">날씨</label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full px-2 py-1.5 text-sm bg-white/50 border border-stone-300 rounded focus:border-amber-600 outline-none text-stone-800"
              >
                <option value="">선택</option>
                {WEATHER_OPTIONS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Activities */}
          <div className="mb-4">
            <label className="text-xs text-stone-500 block mb-1">활동</label>
            <div className="flex gap-1 mb-2">
              <input
                type="text"
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
                placeholder="활동 추가..."
                className="flex-1 px-2 py-1 text-xs bg-white/50 border border-stone-300 rounded focus:border-amber-600 outline-none text-stone-800"
              />
              <button
                onClick={handleAddActivity}
                className="px-3 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
              >
                추가
              </button>
            </div>
            {activities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {activities.map((activity, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full flex items-center gap-1"
                  >
                    {activity}
                    <button
                      onClick={() => handleRemoveActivity(activity)}
                      className="hover:text-amber-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload Button */}
          <div className="mb-4">
            <button
              onClick={handleAddImage}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-white/50 border border-stone-300 rounded-lg hover:bg-white/80 transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              이미지 추가
            </button>
            {images.length > 0 && (
              <div className="mt-2 max-h-32 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="relative w-16 h-16 rounded overflow-hidden border border-stone-300 flex-shrink-0">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Binding */}
      <div className="w-1.5 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-800 relative">
        <div className="absolute inset-0 shadow-inner" style={{ boxShadow: 'inset 3px 0 6px rgba(0,0,0,0.4), inset -3px 0 6px rgba(0,0,0,0.4)' }} />
      </div>

      {/* Right Page */}
      <div className="flex-1 relative">
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none rounded-r-lg"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1719563015025-83946fb49e49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBwYXBlciUyMHRleHR1cmV8ZW58MXx8fHwxNzYzNTI2MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Lined paper effect */}
        <div className="absolute inset-0 flex flex-col justify-start pt-24">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="h-8 border-b border-blue-200/30" />
          ))}
        </div>
        <div className="absolute left-8 top-0 w-px h-full bg-red-300/40" />
        
        <div className="relative p-8 pt-24 h-full flex flex-col">
          {/* Note Input */}
          <div className="flex-1 mb-4">
            <label className="text-xs text-stone-500 block mb-2">오늘의 이야기</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="오늘 하루는 어땠나요? 자유롭게 작성해보세요..."
              className="w-full h-full px-0 py-2 text-sm bg-transparent border-none outline-none text-stone-800 placeholder:text-stone-400 resize-none leading-loose"
              style={{ fontFamily: 'inherit' }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-stone-200">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex items-center justify-center gap-1 text-sm text-stone-600 hover:text-stone-800 transition-colors px-4 py-2 bg-stone-100/50 rounded-lg hover:bg-stone-200 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || !note.trim() || isLoading}
              className="flex-1 flex items-center justify-center gap-2 text-sm text-white transition-colors px-4 py-2 bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Check className="w-4 h-4" />
              {isLoading ? '저장 중...' : existingEntry ? '수정 완료' : '작성 완료'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}