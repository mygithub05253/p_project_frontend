/**
 * DiaryBook.tsx
 * 
 * 유스케이스: UC-08 일기장 메인 화면 관리
 * 시퀀스: App -> DiaryBook -> CalendarPage/DaySummaryPage/DiaryWritingPage 등
 * 
 * 주요 기능:
 * - 일기장 뷰 모드 관리 (캘린더, 작성, 읽기, 마이페이지, 통계, 검색, 지원 리소스)
 * - 날짜 선택 및 월별 네비게이션
 * - 페이지 플립 애니메이션 처리
 * - 위험 신호 감지 및 알림 모달 표시
 * - 데이터 변경 시 자동 새로고침 (refreshKey)
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarPage } from './CalendarPage';
import { DaySummaryPage } from './DaySummaryPage';
import { DiaryWritingPage } from './DiaryWritingPage';
import { MyPage } from '../user/MyPage';
import { EmotionStatsPage } from '../analysis/EmotionStatsPage';
import { DiaryListPage } from './DiaryListPage';
import { SupportResourcesPage } from '../user/SupportResourcesPage';
import { RiskAlertModal } from '../analysis/RiskAlertModal';
import { Bookmarks } from '../../layout/Bookmarks';
import { analyzeRiskSignals, fetchRecentDiariesForRiskAnalysis } from '../../../services/riskDetection';
import type { RiskAnalysis } from '../../../services/riskDetection';

type ViewMode = 'calendar' | 'writing' | 'reading' | 'mypage' | 'stats' | 'list' | 'support';

interface DiaryBookProps {
  onUserUpdate?: (user: { name: string; email: string }) => void;
  onLogout?: () => void;
  onAccountDeleted?: () => void;
}

export function DiaryBook({ onUserUpdate, onLogout, onAccountDeleted }: DiaryBookProps) {
  // 선택된 날짜 (일기 조회/작성 시 사용)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // 현재 표시 중인 월 (캘린더 네비게이션)
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // 데이터 변경 시 새로고침을 위한 키 (일기 작성/수정/삭제 시 증가)
  const [refreshKey, setRefreshKey] = useState(0);
  // 현재 뷰 모드 (캘린더, 작성, 읽기, 마이페이지, 통계, 검색, 지원 리소스)
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  // 페이지 플립 애니메이션 진행 여부
  const [isFlipping, setIsFlipping] = useState(false);
  // 페이지 플립 방향 (왼쪽/오른쪽)
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');

  /**
   * 다음 달 계산 (오른쪽 페이지 표시용)
   */
  const getNextMonth = (date: Date) => {
    const next = new Date(date);
    next.setMonth(next.getMonth() + 1);
    return next;
  };

  /**
   * 유스케이스: UC-09 데이터 변경 처리
   * 시퀀스: 일기 작성/수정/삭제 -> DiaryBook -> refreshKey 증가 -> 하위 컴포넌트 재렌더링
   * 
   * 일기 데이터가 변경될 때 호출되어 refreshKey를 증가시켜
   * 캘린더, 통계 등 하위 컴포넌트의 데이터를 자동으로 새로고침
   */
  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  /**
   * 유스케이스: UC-10 월별 네비게이션
   * 시퀀스: CalendarPage -> DiaryBook -> 플립 방향 결정 -> 애니메이션 -> 월 변경
   * 
   * 캘린더에서 월 변경 시 호출되어
   * 방향에 맞는 플립 애니메이션을 실행하고 월을 변경
   */
  const handleMonthChange = (newMonth: Date) => {
    const isNext = newMonth > currentMonth;
    setFlipDirection(isNext ? 'right' : 'left');
    setIsFlipping(true);
    
    setTimeout(() => {
      setCurrentMonth(newMonth);
      setIsFlipping(false);
    }, 600);
  };

  /**
   * 유스케이스: UC-11 날짜 선택 및 일기 조회
   * 시퀀스: CalendarPage -> DiaryBook -> 날짜 저장 -> 읽기 모드 전환 -> DaySummaryPage
   * 
   * 캘린더에서 날짜 선택 시 호출되어
   * 선택된 날짜를 저장하고 읽기 모드로 전환하여 일기 상세 내용을 표시
   */
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setViewMode('reading');
  };

  /**
   * 유스케이스: UC-12 일기 작성 시작
   * 시퀀스: CalendarPage/DaySummaryPage -> DiaryBook -> 날짜 저장 -> 작성 모드 전환 -> DiaryWritingPage
   * 
   * 일기 작성 시작 시 호출되어
   * 선택된 날짜를 저장하고 작성 모드로 전환
   */
  const handleStartWriting = (date: Date) => {
    setSelectedDate(date);
    setIsFlipping(true);
    setTimeout(() => {
      setViewMode('writing');
      setIsFlipping(false);
    }, 300);
  };

  /**
   * 유스케이스: UC-13 일기 작성 완료
   * 시퀀스: DiaryWritingPage -> createDiary/updateDiary API 호출 -> DiaryBook -> 데이터 변경 처리 -> 캘린더 모드 전환
   * 
   * 일기 작성 또는 수정 완료 시 호출되어
   * 데이터 변경을 처리하고 캘린더 화면으로 돌아감
   */
  const handleFinishWriting = () => {
    setIsFlipping(true);
    handleDataChange();
    setTimeout(() => {
      setViewMode('calendar');
      setSelectedDate(null);
      setIsFlipping(false);
    }, 300);
  };

  const handleBackToCalendar = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setViewMode('calendar');
      setSelectedDate(null);
      setIsFlipping(false);
    }, 300);
  };

  const handleEdit = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setViewMode('writing');
      setIsFlipping(false);
    }, 300);
  };

  const handleMyPage = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setViewMode('mypage');
      setIsFlipping(false);
    }, 300);
  };

  const handleGoToMyPage = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setViewMode('mypage');
      setIsFlipping(false);
    }, 300);
  };

  const handleGoToStats = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setViewMode('stats');
      setIsFlipping(false);
    }, 300);
  };

  const handleGoToList = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setViewMode('list');
      setIsFlipping(false);
    }, 300);
  };

  const handleGoHome = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setViewMode('calendar');
      setSelectedDate(null);
      setIsFlipping(false);
    }, 300);
  };

  const handleUserUpdate = (user: { name: string; email: string }) => {
    if (onUserUpdate) {
      onUserUpdate(user);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleAccountDeleted = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // 위험 신호 분석 결과
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  // 위험 알림 모달 표시 여부
  const [showRiskAlert, setShowRiskAlert] = useState(false);

  /**
   * 유스케이스: UC-14 위험 신호 감지 및 알림
   * 시퀀스: DiaryBook 마운트/데이터 변경 -> 최근 일기 조회 -> 위험 신호 분석 -> 위험도 평가 -> 알림 모달 표시
   * 
   * 컴포넌트 마운트 시 또는 일기 데이터 변경 시 실행되어
   * 최근 14일간의 일기 데이터를 분석하여 부정 감정 패턴을 감지하고
   * 위험 신호가 감지되면 사용자에게 알림 모달을 표시
   */
  useEffect(() => {
    const analyzeRisk = async () => {
      try {
        // 최근 14일간 일기 데이터 조회
        const recentDiaries = await fetchRecentDiariesForRiskAnalysis(14);
        // 위험 신호 분석 수행
        const analysis = await analyzeRiskSignals(recentDiaries);
        setRiskAnalysis(analysis);
        
        // 위험 신호가 감지된 경우 (low, medium, high) 알림 모달 표시
        if (analysis.isAtRisk && analysis.riskLevel !== 'none') {
          setShowRiskAlert(true);
        } else {
          setShowRiskAlert(false);
        }
      } catch (error) {
        console.error('Failed to analyze risk signals:', error);
        // 오류 발생 시 기본값 설정
        setRiskAnalysis({
          isAtRisk: false,
          riskLevel: 'none',
          reasons: [],
          recentNegativeCount: 0,
          consecutiveNegativeDays: 0,
        });
        setShowRiskAlert(false);
      }
    };

    analyzeRisk();
  }, [refreshKey]);

  const handleGoToSupport = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setViewMode('support');
      setIsFlipping(false);
    }, 300);
  };

  const handleViewResources = () => {
    setShowRiskAlert(false);
    handleGoToSupport();
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Book Shadow */}
      <div className="absolute inset-0 bg-black/40 blur-3xl translate-y-6 rounded-2xl" />
      
      {/* Book Container */}
      <div className="relative bg-gradient-to-br from-amber-800 via-amber-900 to-stone-900 rounded-2xl p-4 shadow-2xl">
        {/* Leather Texture Overlay */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-20 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1716295177956-420a647c83ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYnJvd24lMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzYxMjQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Bookmarks - positioned at top right */}
        <Bookmarks 
          onHomeClick={handleGoHome} 
          onStatsClick={handleGoToStats}
          onSearchClick={handleGoToList}
          onProfileClick={handleGoToMyPage}
          onLogoutClick={handleLogout}
        />
        
        {/* Book Pages with flip animation */}
        <div 
          className={`relative bg-amber-50 rounded-lg shadow-inner transition-transform duration-300 ${
            isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
          }`}
          style={{ minHeight: '600px', height: '75vh', maxHeight: '800px' }}
        >
          {/* Calendar View (두 페이지) */}
          {viewMode === 'calendar' && (
            <div className="flex h-full relative">
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
                <div className="relative p-8 h-full overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`left-${currentMonth.toISOString()}`}
                      initial={{ 
                        opacity: 0,
                        rotateY: flipDirection === 'left' ? -90 : 90,
                        transformOrigin: flipDirection === 'left' ? 'right center' : 'left center'
                      }}
                      animate={{ 
                        opacity: 1,
                        rotateY: 0,
                        transition: { 
                          duration: 0.6,
                          ease: [0.4, 0.0, 0.2, 1]
                        }
                      }}
                      exit={{ 
                        opacity: 0,
                        rotateY: flipDirection === 'left' ? 90 : -90,
                        transformOrigin: flipDirection === 'left' ? 'right center' : 'left center',
                        transition: { 
                          duration: 0.6,
                          ease: [0.4, 0.0, 0.2, 1]
                        }
                      }}
                      style={{ 
                        perspective: '1200px',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <CalendarPage 
                        onDateSelect={handleDateSelect} 
                        selectedDate={selectedDate}
                        currentMonth={currentMonth}
                        onMonthChange={handleMonthChange}
                        refreshKey={refreshKey}
                        isRightPage={false}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Center Binding */}
              <div className="w-1.5 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-800 relative z-10">
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
                <div className="relative p-8 h-full overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`right-${getNextMonth(currentMonth).toISOString()}`}
                      initial={{ 
                        opacity: 0,
                        rotateY: flipDirection === 'left' ? -90 : 90,
                        transformOrigin: flipDirection === 'left' ? 'right center' : 'left center'
                      }}
                      animate={{ 
                        opacity: 1,
                        rotateY: 0,
                        transition: { 
                          duration: 0.6,
                          ease: [0.4, 0.0, 0.2, 1]
                        }
                      }}
                      exit={{ 
                        opacity: 0,
                        rotateY: flipDirection === 'left' ? 90 : -90,
                        transformOrigin: flipDirection === 'left' ? 'right center' : 'left center',
                        transition: { 
                          duration: 0.6,
                          ease: [0.4, 0.0, 0.2, 1]
                        }
                      }}
                      style={{ 
                        perspective: '1200px',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <CalendarPage 
                        onDateSelect={handleDateSelect} 
                        selectedDate={selectedDate}
                        currentMonth={getNextMonth(currentMonth)}
                        onMonthChange={handleMonthChange}
                        refreshKey={refreshKey}
                        isRightPage={true}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {/* Writing View (양페이지 사용) */}
          {viewMode === 'writing' && (
            <motion.div 
              className="h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <DiaryWritingPage 
                selectedDate={selectedDate}
                onFinish={handleFinishWriting}
                onCancel={handleBackToCalendar}
              />
            </motion.div>
          )}

          {/* Reading View (두 페이지) */}
          {viewMode === 'reading' && (
            <div className="flex h-full">
              {/* Left Page - Calendar */}
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
                  <CalendarPage 
                    onDateSelect={handleDateSelect} 
                    selectedDate={selectedDate}
                    currentMonth={currentMonth}
                    onMonthChange={handleMonthChange}
                    refreshKey={refreshKey}
                  />
                </div>
              </div>

              {/* Center Binding */}
              <div className="w-1.5 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-800 relative">
                <div className="absolute inset-0 shadow-inner" style={{ boxShadow: 'inset 3px 0 6px rgba(0,0,0,0.4), inset -3px 0 6px rgba(0,0,0,0.4)' }} />
              </div>

              {/* Right Page - Diary content */}
              <div className="flex-1 relative">
                <div 
                  className="absolute inset-0 opacity-30 rounded-r-lg"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1719563015025-83946fb49e49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBwYXBlciUyMHRleHR1cmV8ZW58MXx8fHwxNzYzNTI2MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-start pt-20">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="h-8 border-b border-blue-200/30" />
                  ))}
                </div>
                <div className="absolute left-8 top-0 w-px h-full bg-red-300/40" />
                
                <div className="relative p-8 h-full overflow-y-auto">
                  <DaySummaryPage 
                    selectedDate={selectedDate}
                    onDataChange={handleDataChange}
                    onEdit={handleEdit}
                    onStartWriting={() => handleStartWriting(selectedDate!)}
                    onBackToCalendar={handleBackToCalendar}
                  />
                </div>
              </div>
            </div>
          )}

          {/* My Page View (두 페이지) */}
          {viewMode === 'mypage' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <MyPage 
                onBack={handleBackToCalendar} 
                onUserUpdate={handleUserUpdate}
                onAccountDeleted={handleAccountDeleted}
                onGoToSupport={handleGoToSupport}
              />
            </motion.div>
          )}

          {/* Emotion Stats View (두 페이지) */}
          {viewMode === 'stats' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <EmotionStatsPage 
                onDateClick={handleDateSelect}
                refreshKey={refreshKey}
              />
            </motion.div>
          )}

          {/* Diary List View (두 페이지) */}
          {viewMode === 'list' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <DiaryListPage 
                onDateClick={handleDateSelect}
              />
            </motion.div>
          )}

          {/* Support Resources View (두 페이지) */}
          {viewMode === 'support' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <SupportResourcesPage 
                onBack={handleBackToCalendar}
              />
            </motion.div>
          )}
        </div>

        {/* Book Corner Details */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-amber-700/50 rounded-tl" />
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-amber-700/50 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-amber-700/50 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-amber-700/50 rounded-br" />
      </div>

      {/* Risk Alert Modal */}
      {showRiskAlert && riskAnalysis && riskAnalysis.isAtRisk && (
        <RiskAlertModal 
          isOpen={showRiskAlert}
          onClose={() => setShowRiskAlert(false)}
          onViewResources={handleViewResources}
          riskLevel={riskAnalysis.riskLevel as 'low' | 'medium' | 'high'}
          reasons={riskAnalysis.reasons}
        />
      )}
    </div>
  );
}