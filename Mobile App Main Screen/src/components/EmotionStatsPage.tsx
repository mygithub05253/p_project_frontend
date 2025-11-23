import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BarChart3, Loader2, TrendingUp } from 'lucide-react';
import { fetchDailyStats, DailyStats } from '../services/diaryApi';
import { EmotionChartView } from './EmotionChartView';

interface EmotionStatsPageProps {
  onDateClick?: (date: Date) => void;
}

// Emotion category colors
const emotionColors: { [key: string]: string } = {
  happy: 'bg-yellow-300',
  love: 'bg-pink-300',
  excited: 'bg-purple-300',
  calm: 'bg-blue-300',
  grateful: 'bg-green-300',
  hopeful: 'bg-teal-300',
  tired: 'bg-gray-300',
  sad: 'bg-indigo-300',
  angry: 'bg-red-300',
  anxious: 'bg-orange-300',
  neutral: 'bg-stone-300',
};

export function EmotionStatsPage({ onDateClick }: EmotionStatsPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline' | 'chart'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    // Only load calendar/timeline data if not in chart mode
    if (viewMode !== 'chart') {
      loadMonthData();
    }
  }, [currentDate, viewMode]);

  const loadMonthData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const data = await fetchDailyStats(yearMonth);
      setDailyStats(data);
    } catch (err) {
      setError('과거 기록을 불러오는 데 실패했습니다.');
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const getStatsForDate = (date: Date): DailyStats | null => {
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return dailyStats.find(stat => stat.date === dateKey) || null;
  };

  const renderCalendarView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    const weeks = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const stats = getStatsForDate(date);
      const isToday = 
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          className={`aspect-square rounded-lg border transition-all relative group ${
            isToday ? 'ring-2 ring-amber-600' : ''
          } ${
            stats
              ? `${emotionColors[stats.emotionCategory]} border-stone-400 hover:scale-105 hover:shadow-lg`
              : 'bg-white/50 border-stone-300 hover:bg-white/80'
          }`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
            <span className={`text-xs ${isToday ? 'font-bold text-amber-800' : 'text-stone-700'}`}>
              {day}
            </span>
            {stats && (
              <span className="text-lg mt-0.5">{stats.emotion}</span>
            )}
          </div>
          
          {/* Tooltip on hover */}
          {stats && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-stone-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {stats.title}
            </div>
          )}
        </button>
      );
    }

    // Split into weeks
    while (days.length > 0) {
      weeks.push(days.splice(0, 7));
    }

    return (
      <div className="space-y-2">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
            <div
              key={day}
              className={`text-center text-xs ${
                i === 0 ? 'text-rose-600' : i === 6 ? 'text-blue-600' : 'text-stone-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week}
          </div>
        ))}
      </div>
    );
  };

  const renderTimelineView = () => {
    if (dailyStats.length === 0) {
      return (
        <div className="text-center py-12 text-stone-500">
          이번 달에 작성된 일기가 없습니다.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {dailyStats.map((stat) => {
          const date = new Date(stat.date);
          return (
            <button
              key={stat.date}
              onClick={() => handleDateClick(date)}
              className="w-full flex items-center gap-4 p-4 bg-white/50 hover:bg-white/80 rounded-lg border border-stone-300 transition-all hover:shadow-md text-left"
            >
              {/* Date */}
              <div className="flex flex-col items-center min-w-[60px]">
                <span className="text-xs text-stone-500">
                  {date.toLocaleDateString('ko-KR', { month: 'short' })}
                </span>
                <span className="text-2xl text-stone-800">
                  {date.getDate()}
                </span>
                <span className="text-xs text-stone-500">
                  {date.toLocaleDateString('ko-KR', { weekday: 'short' })}
                </span>
              </div>

              {/* Emotion */}
              <div className={`w-16 h-16 rounded-full ${emotionColors[stat.emotionCategory]} flex items-center justify-center text-3xl`}>
                {stat.emotion}
              </div>

              {/* Title */}
              <div className="flex-1">
                <p className="text-sm text-stone-800 truncate">{stat.title}</p>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderSelectedDateSummary = () => {
    if (!selectedDate) return null;

    const stats = getStatsForDate(selectedDate);
    const dateString = selectedDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });

    return (
      <div className="mt-6 p-4 bg-amber-50 border border-amber-300 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-stone-700">{dateString}</h3>
          <button
            onClick={() => setSelectedDate(null)}
            className="text-xs text-stone-500 hover:text-stone-700"
          >
            닫기
          </button>
        </div>
        
        {stats ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{stats.emotion}</span>
              <div>
                <p className="text-sm text-stone-800">{stats.title}</p>
                <button
                  onClick={() => onDateClick && onDateClick(selectedDate)}
                  className="text-xs text-amber-700 hover:text-amber-800 underline mt-1"
                >
                  상세보기
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-stone-600">이 날짜에 작성된 일기가 없습니다.</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full">
      {/* Left Page */}
      <div className="flex-1 relative">
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none rounded-l-lg"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1719563015025-83946fb49e49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBwYXBlciUyMHRleHR1cmV8ZW58MXx8fHwxNzYzNTI2MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="relative p-8 h-full overflow-y-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2 pb-4 border-b border-stone-300">
              <BarChart3 className="w-10 h-10 mx-auto text-amber-700" />
              <h2 className="text-2xl text-stone-800">감정 통계</h2>
              <p className="text-xs text-stone-600">과거의 감정 기록을 확인하세요</p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/50 text-stone-700 hover:bg-white/80'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm">캘린더</span>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'timeline'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/50 text-stone-700 hover:bg-white/80'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">타임라인</span>
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'chart'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/50 text-stone-700 hover:bg-white/80'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">차트</span>
              </button>
            </div>

            {/* Month Navigation - Only show for calendar/timeline */}
            {viewMode !== 'chart' && (
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevMonth}
                  disabled={isLoading}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5 text-stone-600" />
                </button>
                
                <h3 className="text-lg text-stone-800">
                  {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </h3>
                
                <button
                  onClick={handleNextMonth}
                  disabled={isLoading}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5 text-stone-600" />
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && viewMode !== 'chart' && (
              <div className="p-3 bg-rose-100 border border-rose-300 rounded-lg">
                <p className="text-xs text-rose-700">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && viewMode !== 'chart' && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              </div>
            )}

            {/* Content */}
            {!isLoading && !error && viewMode !== 'chart' && (
              <>
                {viewMode === 'calendar' ? renderCalendarView() : renderTimelineView()}
              </>
            )}

            {/* Chart View */}
            {viewMode === 'chart' && <EmotionChartView />}
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
            backgroundImage: 'url(https://images.unsplash.com/photo-1719563015025-83946fb49e49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBwYXBlciUyMHRleHR1cmV8ZW58MXx8fHwxNzYzNTI2MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Lined paper effect */}
        <div className="absolute inset-0 flex flex-col justify-start pt-20">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-8 border-b border-blue-200/30" />
          ))}
        </div>
        <div className="absolute left-8 top-0 w-px h-full bg-red-300/40" />
        
        <div className="relative p-8 h-full overflow-y-auto">
          {/* Chart view uses full space */}
          {viewMode === 'chart' ? (
            <div className="space-y-4">
              <h3 className="text-sm text-stone-700 mb-3">감정 변화 추이</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                일기장에 기록된 감정들의 변화를 그래프로 확인하세요.
                주간 또는 월간 단위로 감정의 흐름을 파악할 수 있습니다.
              </p>
            </div>
          ) : (
            /* Selected Date Summary or Legend */
            selectedDate ? (
              renderSelectedDateSummary()
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm text-stone-700 mb-3">감정 색상 범례</h3>
                <div className="space-y-2">
                  {[
                    { key: 'happy', label: '행복', emoji: '😊' },
                    { key: 'love', label: '사랑', emoji: '🥰' },
                    { key: 'excited', label: '설렘', emoji: '✨' },
                    { key: 'calm', label: '평온', emoji: '😌' },
                    { key: 'grateful', label: '감사', emoji: '🤗' },
                    { key: 'hopeful', label: '희망', emoji: '🌈' },
                    { key: 'tired', label: '피곤', emoji: '😴' },
                  ].map(({ key, label, emoji }) => (
                    <div key={key} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded ${emotionColors[key]}`} />
                      <span className="text-xl">{emoji}</span>
                      <span className="text-sm text-stone-700">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-stone-300">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    날짜를 클릭하면 해당 일의 일기 요약을 확인할 수 있습니다.
                    상세보기를 클릭하면 전체 일기 내용을 볼 수 있습니다.
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
