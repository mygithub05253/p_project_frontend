import { BookOpen } from 'lucide-react';
import './LandingPage.css';

interface LandingPageProps {
  onOpenBook: () => void;
}

export function LandingPage({ onOpenBook }: LandingPageProps) {
  return (
    <div className="diary-landing-page">
      {/* Wooden desk background */}
      <div 
        className="diary-landing-background"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1551622541-af8e8e10c87e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="diary-landing-content">
        {/* Closed Diary Book */}
        <div className="diary-book-container" onClick={onOpenBook}>
          {/* Book shadow */}
          <div className="diary-book-shadow" />
          
          {/* Book */}
          <div className="diary-book-cover">
            {/* Leather texture */}
            <div 
              className="diary-book-texture"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1716295177956-420a647c83ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYnJvd24lMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzYxMjQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080)',
                backgroundSize: 'cover',
              }}
            />
            
            {/* Book cover */}
            <div className="diary-book-inner">
              <div className="diary-book-content">
                <BookOpen className="diary-book-icon" />
                <h1 className="diary-book-title">
                  My Diary
                </h1>
                <p className="diary-book-subtitle">
                  나의 감정을 기록하는 특별한 공간
                </p>
                <div className="diary-book-button-container">
                  <div className="diary-book-button">
                    일기장 열기
                  </div>
                </div>
              </div>
              
              {/* Decorative corner details */}
              <div className="diary-book-corner diary-book-corner-top-left" />
              <div className="diary-book-corner diary-book-corner-top-right" />
              <div className="diary-book-corner diary-book-corner-bottom-left" />
              <div className="diary-book-corner diary-book-corner-bottom-right" />
            </div>
            
            {/* Book spine detail */}
            <div className="diary-book-spine" />
            <div className="diary-book-spine-line" />
          </div>
        </div>
        
        {/* Welcome text */}
        <div className="diary-welcome-section">
          <h2 className="diary-welcome-title">환영합니다</h2>
          <p className="diary-welcome-text">
            오늘 하루의 감정을 기록하고<br />
            소중한 순간들을 간직하세요
          </p>
        </div>
      </div>
    </div>
  );
}
