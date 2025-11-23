import { Home, User, LogOut, BarChart3, Search } from 'lucide-react';

interface BookmarksProps {
  onHomeClick?: () => void;
  onStatsClick?: () => void;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

export function Bookmarks({ onHomeClick, onStatsClick, onSearchClick, onProfileClick, onLogoutClick }: BookmarksProps) {
  return (
    <div className="absolute top-0 right-12 flex gap-1 z-20">
      {/* Home Bookmark */}
      <button
        onClick={onHomeClick}
        className="relative group"
        title="홈으로"
      >
        <div className="w-12 h-20 bg-gradient-to-b from-rose-400 via-rose-500 to-rose-600 rounded-b-lg shadow-lg transform -translate-y-2 transition-all group-hover:translate-y-0">
          <div className="absolute inset-0 bg-white/20 rounded-b-lg" />
          <div className="relative flex items-start justify-center pt-3">
            <Home className="w-5 h-5 text-white drop-shadow" />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-rose-700/50 blur-sm rounded-full" />
      </button>

      {/* Stats Bookmark */}
      <button
        onClick={onStatsClick}
        className="relative group"
        title="감정 통계"
      >
        <div className="w-12 h-20 bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600 rounded-b-lg shadow-lg transform -translate-y-2 transition-all group-hover:translate-y-0">
          <div className="absolute inset-0 bg-white/20 rounded-b-lg" />
          <div className="relative flex items-start justify-center pt-3">
            <BarChart3 className="w-5 h-5 text-white drop-shadow" />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-purple-700/50 blur-sm rounded-full" />
      </button>

      {/* Search Bookmark */}
      <button
        onClick={onSearchClick}
        className="relative group"
        title="일기 검색"
      >
        <div className="w-12 h-20 bg-gradient-to-b from-teal-400 via-teal-500 to-teal-600 rounded-b-lg shadow-lg transform -translate-y-2 transition-all group-hover:translate-y-0">
          <div className="absolute inset-0 bg-white/20 rounded-b-lg" />
          <div className="relative flex items-start justify-center pt-3">
            <Search className="w-5 h-5 text-white drop-shadow" />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-teal-700/50 blur-sm rounded-full" />
      </button>

      {/* Profile Bookmark */}
      <button
        onClick={onProfileClick}
        className="relative group"
        title="마이페이지"
      >
        <div className="w-12 h-20 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-b-lg shadow-lg transform -translate-y-2 transition-all group-hover:translate-y-0">
          <div className="absolute inset-0 bg-white/20 rounded-b-lg" />
          <div className="relative flex items-start justify-center pt-3">
            <User className="w-5 h-5 text-white drop-shadow" />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-blue-700/50 blur-sm rounded-full" />
      </button>

      {/* Logout Bookmark */}
      <button
        onClick={onLogoutClick}
        className="relative group"
        title="로그아웃"
      >
        <div className="w-12 h-20 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-b-lg shadow-lg transform -translate-y-2 transition-all group-hover:translate-y-0">
          <div className="absolute inset-0 bg-white/20 rounded-b-lg" />
          <div className="relative flex items-start justify-center pt-3">
            <LogOut className="w-5 h-5 text-white drop-shadow" />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-amber-700/50 blur-sm rounded-full" />
      </button>
    </div>
  );
}