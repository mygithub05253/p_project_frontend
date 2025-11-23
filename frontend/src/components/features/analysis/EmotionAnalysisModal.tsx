import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmotionAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  emotion: string | null;
  emotionCategory: string | null;
  aiComment: string | null;
  error?: string | null;
}

// 감정 카테고리별 한글 이름
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

// 감정 카테고리별 색상
const emotionColors: { [key: string]: { bg: string; border: string; text: string } } = {
  happy: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800' },
  love: { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800' },
  excited: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800' },
  calm: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800' },
  grateful: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800' },
  hopeful: { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-800' },
  tired: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-800' },
  sad: { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-800' },
  angry: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800' },
  anxious: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' },
  neutral: { bg: 'bg-stone-100', border: 'border-stone-300', text: 'text-stone-800' },
};

export function EmotionAnalysisModal({
  isOpen,
  onClose,
  emotion,
  emotionCategory,
  aiComment,
  error,
}: EmotionAnalysisModalProps) {
  if (!isOpen) return null;

  const colors = emotionColors[emotionCategory || 'neutral'];
  const emotionLabel = emotionLabels[emotionCategory || 'neutral'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative bg-gradient-to-br from-amber-800 via-amber-900 to-stone-900 rounded-2xl p-1 shadow-2xl max-w-md w-full pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Leather texture */}
              <div
                className="absolute inset-0 rounded-2xl opacity-20 mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1716295177956-420a647c83ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYnJvd24lMjB0ZXh0dXJlfGVufDF8fHx8MTc2MzYxMjQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080)',
                  backgroundSize: 'cover',
                }}
              />

              <div className="relative bg-amber-50 rounded-xl p-6">
                {/* Paper texture */}
                <div
                  className="absolute inset-0 opacity-30 rounded-xl pointer-events-none"
                  style={{
                    backgroundImage:
                      'url(https://images.unsplash.com/photo-1719563015025-83946fb49e49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBwYXBlciUyMHRleHR1cmV8ZW58MXx8fHwxNzYzNTI2MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080)',
                    backgroundSize: 'cover',
                  }}
                />

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-stone-200 hover:bg-stone-300 transition-colors"
                >
                  <X className="w-4 h-4 text-stone-700" />
                </button>

                <div className="relative space-y-6">
                  {/* Title */}
                  <div className="text-center">
                    <h2 className="text-xl text-stone-800">감정 분석 결과</h2>
                  </div>

                  {/* Error State */}
                  {error && (
                    <div className="space-y-3 text-center">
                      <div className="text-5xl">⚠️</div>
                      <div className="space-y-2">
                        <p className="text-sm text-stone-700">일기 저장은 완료되었으나,</p>
                        <p className="text-sm text-stone-700">감정 분석에 실패했습니다.</p>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={onClose}
                          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          확인
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Success State */}
                  {!error && emotion && emotionCategory && (
                    <div className="space-y-6">
                      {/* Emotion Display */}
                      <div className="flex flex-col items-center space-y-4">
                        {/* Emotion Icon */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', delay: 0.2 }}
                          className="text-7xl"
                        >
                          {emotion}
                        </motion.div>

                        {/* Emotion Label */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className={`px-6 py-2 rounded-full border-2 ${colors.bg} ${colors.border}`}
                        >
                          <span className={`text-sm ${colors.text}`}>{emotionLabel}</span>
                        </motion.div>
                      </div>

                      {/* AI Comment */}
                      {aiComment && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2 justify-center">
                            <div className="text-amber-700">✨</div>
                            <p className="text-xs text-stone-600">AI의 공감 한마디</p>
                          </div>
                          <div className="bg-white/80 border border-stone-300 rounded-lg p-4">
                            <p className="text-sm text-stone-700 leading-relaxed text-center">
                              {aiComment}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {/* Close Button */}
                      <div className="pt-2 flex justify-center">
                        <button
                          onClick={onClose}
                          className="px-8 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md"
                        >
                          닫기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
