import { BookOpen } from 'lucide-react';

interface LandingPageProps {
  onOpenBook: () => void;
}

export function LandingPage({ onOpenBook }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 flex items-center justify-center p-4">
      {/* Wooden desk background */}
      <div 
        className="fixed inset-0 opacity-40"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1551622541-af8e8e10c87e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        {/* Closed Diary Book */}
        <div className="relative group cursor-pointer" onClick={onOpenBook}>
          {/* Book shadow */}
          <div className="absolute inset-0 bg-black/40 blur-3xl translate-y-8 rounded-2xl" />
          
          {/* Book */}
          <div className="relative bg-gradient-to-br from-amber-800 via-amber-900 to-stone-900 rounded-2xl p-6 shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            {/* Leather texture */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-20 mix-blend-overlay"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1716295177956-420a647c83ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYnJvd24lMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzYxMjQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080)',
                backgroundSize: 'cover',
              }}
            />
            
            {/* Book cover */}
            <div className="relative bg-amber-50/10 backdrop-blur-sm rounded-lg p-12 md:p-20 border-2 border-amber-700/30">
              <div className="text-center space-y-4">
                <BookOpen className="w-16 h-16 md:w-20 md:h-20 mx-auto text-amber-100 group-hover:text-amber-50 transition-colors" />
                <h1 className="text-3xl md:text-5xl text-amber-50 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                  My Diary
                </h1>
                <p className="text-amber-200/80 text-sm md:text-base">
                  나의 감정을 기록하는 특별한 공간
                </p>
                <div className="pt-6">
                  <div className="inline-block px-6 py-3 bg-amber-600/50 border border-amber-400/50 rounded-lg text-amber-100 text-sm group-hover:bg-amber-600 group-hover:border-amber-400 transition-all">
                    일기장 열기
                  </div>
                </div>
              </div>
              
              {/* Decorative corner details */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-700/50" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-700/50" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-amber-700/50" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-700/50" />
            </div>
            
            {/* Book spine detail */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-amber-950 to-transparent rounded-l-2xl" />
            <div className="absolute left-1 top-8 bottom-8 w-px bg-amber-700/50" />
          </div>
        </div>
        
        {/* Welcome text */}
        <div className="space-y-2 text-stone-700">
          <h2 className="text-2xl md:text-3xl">환영합니다</h2>
          <p className="text-sm md:text-base text-stone-600">
            오늘 하루의 감정을 기록하고<br />
            소중한 순간들을 간직하세요
          </p>
        </div>
      </div>
    </div>
  );
}
