/**
 * SupportResourcesPage.tsx
 * 
 * 유스케이스: UC-21 도움말 및 리소스 조회
 * 시퀀스: DiaryBook/MyPage/RiskAlertModal -> SupportResourcesPage -> supportResources 데이터 로드 -> 지원 리소스 목록 표시
 * 
 * 주요 기능:
 * - 정신 건강 지원 리소스 목록 표시
 * - 위기 상담 전화번호, 이메일, 웹사이트 링크 제공
 * - 카테고리별 필터링 (긴급, 상담, 전화상담, 커뮤니티)
 * - 위험 신호 감지 시 경고 메시지 표시
 */
import { useState } from 'react';
import { Phone, ExternalLink, Clock, Heart, AlertTriangle, MessageCircle, Building, Filter, X } from 'lucide-react';
import { supportResources, categoryLabels, categoryColors } from '../../../services/supportResources';
import type { SupportResource } from '../../../services/supportResources';

interface SupportResourcesPageProps {
  showRiskWarning?: boolean; // 위험 경고 표시 여부
  riskLevel?: 'low' | 'medium' | 'high'; // 위험 수준
  riskReasons?: string[]; // 위험 감지 이유 목록
  onBack?: () => void; // 뒤로 가기 버튼 클릭 시 호출될 콜백 함수
}

export function SupportResourcesPage({ showRiskWarning, riskLevel, riskReasons, onBack }: SupportResourcesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredResources = selectedCategory === 'all'
    ? supportResources
    : supportResources.filter(r => r.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency':
        return <AlertTriangle className="w-4 h-4" />;
      case 'counseling':
        return <MessageCircle className="w-4 h-4" />;
      case 'hotline':
        return <Phone className="w-4 h-4" />;
      case 'community':
        return <Building className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  const getRiskColor = (level?: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return 'bg-rose-50 border-rose-300 text-rose-800';
      case 'medium':
        return 'bg-orange-50 border-orange-300 text-orange-800';
      case 'low':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-300 text-blue-800';
    }
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
              <Heart className="w-10 h-10 mx-auto text-rose-600" />
              <h2 className="text-2xl text-stone-800">도움말 & 리소스</h2>
              <p className="text-xs text-stone-600">언제든 도움을 요청할 수 있습니다</p>
            </div>

            {/* Risk Warning */}
            {showRiskWarning && riskLevel && (
              <div className={`p-4 rounded-lg border-2 ${getRiskColor(riskLevel)}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm">
                      {riskLevel === 'high' && '최근 감정 패턴에서 심각한 위험 신호가 감지되었습니다.'}
                      {riskLevel === 'medium' && '최근 부정적인 감정이 지속되고 있습니다.'}
                      {riskLevel === 'low' && '최근 부정적인 감정이 반복되고 있습니다.'}
                    </p>
                    {riskReasons && riskReasons.length > 0 && (
                      <ul className="text-xs space-y-1">
                        {riskReasons.map((reason, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-1">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="text-xs mt-3 border-t pt-3">
                      {riskLevel === 'high' && '전문가의 도움을 받는 것을 강력히 권장합니다. 아래 긴급 상담 전화를 이용해주세요.'}
                      {riskLevel === 'medium' && '감정 상태를 돌아보고 필요시 전문가와 상담해보세요.'}
                      {riskLevel === 'low' && '잠시 시간을 내어 자신을 돌아보고 필요시 전문가와 상담해보세요.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Category Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Filter className="w-3 h-3" />
                <span>카테고리</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                  }`}
                >
                  전체
                </button>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      selectedCategory === key
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                    }`}
                  >
                    {getCategoryIcon(key)}
                    {label}
                  </button>
                ))}
              </div>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="w-full py-2 text-xs text-stone-600 hover:text-stone-800 flex items-center justify-center gap-1"
                >
                  <X className="w-3 h-3" />
                  필터 해제
                </button>
              )}
            </div>

            {/* Resources List */}
            <div className="space-y-3">
              <p className="text-xs text-stone-600">
                총 {filteredResources.length}개의 기관
              </p>
              
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="p-4 bg-white/70 rounded-lg border border-stone-300 space-y-3 hover:bg-white/90 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-sm text-stone-800 mb-1">{resource.name}</h3>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${categoryColors[resource.category]}`}>
                        {getCategoryIcon(resource.category)}
                        {categoryLabels[resource.category]}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {resource.description}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    {resource.phone && (
                      <a
                        href={`tel:${resource.phone}`}
                        className="flex items-center gap-2 text-xs text-blue-700 hover:text-blue-800 hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{resource.phone}</span>
                      </a>
                    )}
                    
                    {resource.hours && (
                      <div className="flex items-center gap-2 text-xs text-stone-600">
                        <Clock className="w-3 h-3" />
                        <span>{resource.hours}</span>
                      </div>
                    )}
                    
                    {resource.website && (
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-purple-700 hover:text-purple-800 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>웹사이트 방문</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
            <h3 className="text-sm text-stone-700 mb-3">도움을 요청하는 것은 용기입니다</h3>
            
            <div className="space-y-4 text-xs text-stone-600 leading-relaxed">
              <p>
                혼자서 감정을 감당하기 어려울 때, 전문가의 도움을 받는 것은 매우 현명한 선택입니다. 
                당신의 감정과 고민은 소중하며, 언제든 도움을 요청할 수 있습니다.
              </p>
              
              <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-lg">
                <p className="text-rose-800">
                  <strong>긴급한 경우</strong><br />
                  자살 충동이나 자해 생각이 든다면 즉시 1393(자살예방 상담전화) 또는 
                  1577-0199(정신건강 위기상담)로 연락해주세요. 24시간 상담 가능합니다.
                </p>
              </div>
              
              <p>
                <strong className="text-stone-800">상담이 도움이 되는 경우:</strong>
              </p>
              <ul className="space-y-1 ml-4">
                <li>• 지속적인 우울감이나 불안감</li>
                <li>• 일상생활에 지장을 주는 감정 변화</li>
                <li>• 수면 문제나 식욕 변화</li>
                <li>• 대인관계의 어려움</li>
                <li>• 스트레스 관리의 어려움</li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-stone-300">
                <p className="text-stone-700">
                  <strong>개인정보 보호</strong><br />
                  모든 상담은 비밀이 보장되며, 상담 기관은 전문적이고 안전한 환경을 제공합니다.
                </p>
              </div>

              <div className="mt-4 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-xs">
                  💡 <strong>알림 설정</strong><br />
                  마이페이지에서 '감정 알림'을 켜두면 위험 신호가 감지될 때 
                  알림을 받을 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}