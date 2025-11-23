import { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { termsData } from '../../../services/termsData';
import type { TermItem } from '../../../services/termsData';
import { TermsModal } from './TermsModal';

interface TermsAgreementProps {
  onAgreementChange: (agreements: { [key: string]: boolean }) => void;
  agreements: { [key: string]: boolean };
}

export function TermsAgreement({ onAgreementChange, agreements }: TermsAgreementProps) {
  const [selectedTerm, setSelectedTerm] = useState<TermItem | null>(null);

  const handleTermClick = (term: TermItem) => {
    setSelectedTerm(term);
  };

  const handleCloseModal = () => {
    setSelectedTerm(null);
  };

  const handleCheckboxChange = (termId: string, checked: boolean) => {
    const newAgreements = { ...agreements, [termId]: checked };
    onAgreementChange(newAgreements);
  };

  const handleAllAgree = () => {
    const allChecked = termsData.every(term => agreements[term.id]);
    const newAgreements: { [key: string]: boolean } = {};
    termsData.forEach(term => {
      newAgreements[term.id] = !allChecked;
    });
    onAgreementChange(newAgreements);
  };

  const allAgreed = termsData.every(term => agreements[term.id]);
  const requiredAgreed = termsData.filter(t => t.required).every(term => agreements[term.id]);

  return (
    <div className="space-y-4">
      {/* All Agree */}
      <button
        onClick={handleAllAgree}
        className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
          allAgreed
            ? 'bg-amber-50 border-amber-600'
            : 'bg-white border-stone-300 hover:border-stone-400'
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            allAgreed
              ? 'bg-amber-600 border-amber-600'
              : 'bg-white border-stone-300'
          }`}
        >
          {allAgreed && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </div>
        <span className="flex-1 text-left text-stone-800">
          전체 약관에 동의합니다
        </span>
      </button>

      {/* Divider */}
      <div className="border-t border-stone-200" />

      {/* Individual Terms */}
      <div className="space-y-3">
        {termsData.map((term) => (
          <div
            key={term.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-white border border-stone-200"
          >
            {/* Checkbox */}
            <button
              onClick={() => handleCheckboxChange(term.id, !agreements[term.id])}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                agreements[term.id]
                  ? 'bg-amber-600 border-amber-600'
                  : 'bg-white border-stone-300'
              }`}
            >
              {agreements[term.id] && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </button>

            {/* Label */}
            <button
              onClick={() => handleTermClick(term)}
              className="flex-1 text-left text-sm text-stone-700 hover:text-stone-900 transition-colors"
            >
              {term.title}
              {term.required && (
                <span className="text-rose-600 ml-1">(필수)</span>
              )}
            </button>

            {/* View Detail Button */}
            <button
              onClick={() => handleTermClick(term)}
              className="p-1 text-stone-400 hover:text-stone-600 transition-colors flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Status Message */}
      {!requiredAgreed && (
        <p className="text-xs text-rose-600 text-center">
          필수 약관에 모두 동의해주세요
        </p>
      )}

      {/* Terms Modal */}
      {selectedTerm && (
        <TermsModal term={selectedTerm} onClose={handleCloseModal} />
      )}
    </div>
  );
}
