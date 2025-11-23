import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { fetchMonthlyEmotions, EmotionData } from '../services/diaryApi';

interface CalendarPageProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  refreshKey?: number;
  compact?: boolean;
  isRightPage?: boolean;
}

export function CalendarPage({ onDateSelect, selectedDate, currentMonth, onMonthChange, refreshKey, compact = false, isRightPage = false }: CalendarPageProps) {
  const [emotions, setEmotions] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Load monthly emotions when month changes
  useEffect(() => {
    loadMonthlyEmotions();
  }, [year, month, refreshKey]);

  const loadMonthlyEmotions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMonthlyEmotions(year, month);
      const emotionMap: { [key: string]: string } = {};
      data.forEach((item: EmotionData) => {
        emotionMap[item.date] = item.emotion;
      });
      setEmotions(emotionMap);
    } catch (error) {
      console.error('Failed to load emotions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = getDateKey(day);
      const emotion = emotions[dateKey];
      const selected = isSelected(day);
      const today = isToday(day);

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(new Date(year, month, day))}
          disabled={isLoading}
          className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all text-stone-700 hover:bg-amber-200/60 disabled:opacity-50 disabled:cursor-not-allowed
            ${selected ? 'bg-amber-300/80 ring-2 ring-amber-600 shadow-md' : today ? 'bg-amber-100/60 ring-1 ring-amber-400' : 'bg-white/30'}`}
        >
          <span className="text-sm">{day}</span>
          {emotion && (
            <span className="text-lg leading-none">{emotion}</span>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`space-y-4 ${compact ? 'space-y-2' : 'space-y-4'} pt-12`}>
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        {!isRightPage && (
          <button
            onClick={goToPreviousMonth}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-amber-200/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-stone-600`} />
          </button>
        )}
        {isRightPage && <div className="w-9" />}
        
        <div className="text-center flex items-center gap-2">
          <div>
            <div className={`text-stone-800 ${compact ? 'text-base' : 'text-lg'}`}>{monthNames[month]}</div>
            <div className={`text-stone-500 ${compact ? 'text-xs' : 'text-sm'}`}>{year}</div>
          </div>
          {isLoading && (
            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
          )}
        </div>

        {isRightPage && (
          <button
            onClick={goToNextMonth}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-amber-200/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-stone-600`} />
          </button>
        )}
        {!isRightPage && <div className="w-9" />}
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day, index) => (
          <div key={index} className={`text-center text-stone-500 ${compact ? 'text-xs' : 'text-sm'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {renderCalendarDays()}
      </div>
    </div>
  );
}