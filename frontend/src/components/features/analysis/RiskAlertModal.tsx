import { AlertTriangle, X, ExternalLink, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RiskAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewResources: () => void;
  riskLevel: 'low' | 'medium' | 'high';
  reasons: string[];
}

export function RiskAlertModal({ isOpen, onClose, onViewResources, riskLevel, reasons }: RiskAlertModalProps) {
  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-300',
          text: 'text-rose-800',
          icon: 'text-rose-600',
          button: 'bg-rose-600 hover:bg-rose-700',
        };
      case 'medium':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-300',
          text: 'text-orange-800',
          icon: 'text-orange-600',
          button: 'bg-orange-600 hover:bg-orange-700',
        };
      case 'low':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700',
        };
    }
  };

  const colors = getRiskColor();

  const getTitle = () => {
    switch (riskLevel) {
      case 'high':
        return '위험 신호가 감지되었습니다';
      case 'medium':
        return '감정 상태를 확인해주세요';
      case 'low':
        return '감정 돌아보기';
    }
  };

  const getMessage = () => {
    switch (riskLevel) {
      case 'high':
        return '최근 감정 패턴에서 심각한 위험 신호가 감지되었습니다. 전문가의 도움을 받는 것을 강력히 권장합니다.';
      case 'medium':
        return '최근 부정적인 감정이 지속되고 있습니다. 감정 상태를 돌아보고 필요시 전문가와 상담해보세요.';
      case 'low':
        return '최근 부정적인 감정이 반복되고 있습니다. 잠시 시간을 내어 자신을 돌아보세요.';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-md ${colors.bg} border-2 ${colors.border} rounded-2xl shadow-2xl overflow-hidden`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-lg hover:bg-white/50 transition-colors ${colors.text}`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 space-y-4">
              {/* Icon & Title */}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full bg-white/70 ${colors.icon}`}>
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl mb-2 ${colors.text}`}>{getTitle()}</h3>
                  <p className={`text-sm ${colors.text}`}>{getMessage()}</p>
                </div>
              </div>

              {/* Reasons */}
              {reasons.length > 0 && (
                <div className={`p-4 bg-white/50 rounded-lg border ${colors.border}`}>
                  <p className={`text-xs mb-2 ${colors.text}`}>감지된 패턴:</p>
                  <ul className={`space-y-1 text-xs ${colors.text}`}>
                    {reasons.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Emergency Contact for High Risk */}
              {riskLevel === 'high' && (
                <div className="p-4 bg-white border-2 border-rose-400 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <Heart className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-rose-900 mb-2">
                        <strong>즉시 도움이 필요하시면:</strong>
                      </p>
                      <div className="space-y-1 text-xs text-rose-800">
                        <p>• 자살예방 상담전화: <strong>1393</strong></p>
                        <p>• 정신건강 위기상담: <strong>1577-0199</strong></p>
                        <p className="text-rose-600 mt-2">※ 24시간 상담 가능</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={onViewResources}
                  className={`flex-1 py-3 rounded-lg text-white transition-colors text-sm flex items-center justify-center gap-2 ${colors.button}`}
                >
                  <ExternalLink className="w-4 h-4" />
                  도움말 & 리소스 보기
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white text-stone-700 rounded-lg hover:bg-stone-100 transition-colors text-sm border border-stone-300"
                >
                  닫기
                </button>
              </div>

              {/* Info Text */}
              <p className={`text-xs text-center ${colors.text} pt-2 border-t ${colors.border}`}>
                이 알림은 감정 패턴 분석을 바탕으로 제공됩니다.<br />
                전문적인 진단이 필요하면 전문가와 상담하세요.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
