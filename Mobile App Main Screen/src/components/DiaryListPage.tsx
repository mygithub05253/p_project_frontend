import { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Calendar, Loader2, X } from 'lucide-react';
import { searchDiaries, DiarySearchParams, DiarySearchResult, DiaryDetail } from '../services/diaryApi';

interface DiaryListPageProps {
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

const emotionLabels: { [key: string]: string } = {
  happy: '행복',
  love: '사랑',
  excited: '설렘',
  calm: '평온',
  grateful: '감사',
  hopeful: '희망',
  tired: '피곤',
  sad: '슬픔',
  angry: '화남',
  anxious: '불안',
  neutral: '평온',
};

export function DiaryListPage({ onDateClick }: DiaryListPageProps) {
  const [searchResult, setSearchResult] = useState<DiarySearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search params
  const [keyword, setKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [emotionCategory, setEmotionCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    performSearch();
  }, [currentPage, emotionCategory]);

  const performSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params: DiarySearchParams = {
        keyword,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        emotionCategory: emotionCategory || undefined,
        page: currentPage,
        limit: 8,
      };
      
      const result = await searchDiaries(params);
      setSearchResult(result);
    } catch (err) {
      setError('일기를 불러오는 데 실패했습니다.');
      console.error('Failed to search diaries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    performSearch();
  };

  const handleClearFilters = () => {
    setKeyword('');
    setStartDate('');
    setEndDate('');
    setEmotionCategory('');
    setCurrentPage(1);
  };

  const handleDiaryClick = (diary: DiaryDetail) => {
    if (onDateClick) {
      const date = new Date(diary.date);
      onDateClick(date);
    }
  };

  const hasActiveFilters = keyword || startDate || endDate || emotionCategory;

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
              <Search className="w-10 h-10 mx-auto text-amber-700" />
              <h2 className="text-2xl text-stone-800">일기 검색</h2>
              <p className="text-xs text-stone-600">과거의 기록을 찾아보세요</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="제목이나 내용으로 검색..."
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none text-stone-800 placeholder:text-stone-400"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-sm"
                >
                  검색
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                    showFilters
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  필터
                </button>
              </div>
            </form>

            {/* Filters */}
            {showFilters && (
              <div className="space-y-3 p-4 bg-white/50 rounded-lg border border-stone-300">
                {/* Date Range */}
                <div>
                  <label className="text-xs text-stone-600 block mb-2">기간</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none"
                    />
                    <span className="text-xs text-stone-500">~</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none"
                    />
                  </div>
                </div>

                {/* Emotion Filter */}
                <div>
                  <label className="text-xs text-stone-600 block mb-2">감정</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEmotionCategory('')}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        emotionCategory === ''
                          ? 'bg-amber-600 text-white'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                      }`}
                    >
                      전체
                    </button>
                    {Object.entries(emotionLabels).slice(0, 5).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setEmotionCategory(key)}
                        className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                          emotionCategory === key
                            ? `${emotionColors[key]} border-2 border-stone-600`
                            : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="w-full py-2 text-xs text-rose-600 hover:text-rose-700 flex items-center justify-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    필터 초기화
                  </button>
                )}
              </div>
            )}

            {/* Results Count */}
            {searchResult && !isLoading && (
              <div className="text-xs text-stone-600 text-center">
                총 {searchResult.total}개의 일기
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-100 border border-rose-300 rounded-lg">
                <p className="text-xs text-rose-700">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              </div>
            )}

            {/* Diary List */}
            {!isLoading && searchResult && (
              <div className="space-y-3">
                {searchResult.diaries.length === 0 ? (
                  <div className="text-center py-12 text-stone-500">
                    검색 결과가 없습니다.
                  </div>
                ) : (
                  searchResult.diaries.map((diary) => {
                    const date = new Date(diary.date);
                    return (
                      <button
                        key={diary.id}
                        onClick={() => handleDiaryClick(diary)}
                        className="w-full flex items-start gap-4 p-4 bg-white/50 hover:bg-white/80 rounded-lg border border-stone-300 transition-all hover:shadow-md text-left"
                      >
                        {/* Date & Emotion */}
                        <div className="flex flex-col items-center min-w-[70px]">
                          <span className="text-xs text-stone-500">
                            {date.toLocaleDateString('ko-KR', { month: 'short' })}
                          </span>
                          <span className="text-xl text-stone-800">
                            {date.getDate()}
                          </span>
                          <div className={`w-12 h-12 rounded-full ${emotionColors[diary.emotionCategory]} flex items-center justify-center text-2xl mt-1`}>
                            {diary.emotion}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm text-stone-800 mb-1 truncate">
                            {diary.title}
                          </h3>
                          <p className="text-xs text-stone-600 line-clamp-2 mb-2">
                            {diary.note}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-stone-500">
                            <Calendar className="w-3 h-3" />
                            <span>{date.toLocaleDateString('ko-KR', { weekday: 'short' })}</span>
                            {diary.weather && <span>• {diary.weather}</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && searchResult && searchResult.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-stone-600" />
                </button>
                
                <span className="text-sm text-stone-700 min-w-[80px] text-center">
                  {currentPage} / {searchResult.totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(searchResult.totalPages, prev + 1))}
                  disabled={currentPage === searchResult.totalPages}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-stone-600" />
                </button>
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
          <div className="space-y-4">
            <h3 className="text-sm text-stone-700 mb-3">검색 도움말</h3>
            
            <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <p>
                <strong className="text-stone-800">키워드 검색</strong><br />
                제목이나 내용에 포함된 단어로 일기를 찾을 수 있습니다.
              </p>
              
              <p>
                <strong className="text-stone-800">기간 검색</strong><br />
                특정 기간 동안 작성한 일기만 볼 수 있습니다.
              </p>
              
              <p>
                <strong className="text-stone-800">감정별 검색</strong><br />
                특정 감정으로 기록된 일기들을 모아볼 수 있습니다.
              </p>
              
              <div className="mt-6 pt-4 border-t border-stone-300">
                <p className="text-stone-700">
                  일기를 클릭하면 해당 날짜의 상세 내용을 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}