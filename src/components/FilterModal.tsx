import React, { useState } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { radius: number; minVows: number; highCommitmentOnly: boolean }) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply
}) => {
  const [radius, setRadius] = useState(10);
  const [minVows, setMinVows] = useState(2);
  const [highCommitmentOnly, setHighCommitmentOnly] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onApply({ radius, minVows, highCommitmentOnly });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-surface-container rounded-t-3xl sm:rounded-2xl border border-[#302840] shadow-2xl p-5 space-y-5 animate-slide-up">
        {/* Modal Handle */}
        <div className="w-12 h-1 bg-outline-variant rounded-full mx-auto sm:hidden" />

        <div className="flex items-center justify-between border-b border-[#302840] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">tune</span>
            <h3 className="font-headline font-bold text-base text-on-surface">
              Discovery Parameters
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-white"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Max Distance Radius */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-label">
            <span className="text-on-surface-variant uppercase">Maximum Distance</span>
            <span className="text-secondary font-bold">{radius} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-secondary bg-surface-container-lowest h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Minimum Staked Vow Requirement */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-label">
            <span className="text-on-surface-variant uppercase">Minimum Vow Requirement</span>
            <span className="text-primary font-bold">{minVows} Vows</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setMinVows(val)}
                className={`py-2 rounded-lg text-xs font-label font-bold border transition-all ${
                  minVows === val
                    ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(255,45,120,0.4)]'
                    : 'bg-surface-container-high text-on-surface-variant border-[#302840] hover:text-white'
                }`}
              >
                {val} {val === 1 ? 'Vow' : 'Vows'}
              </button>
            ))}
          </div>
        </div>

        {/* High Commitment Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-[#302840]">
          <div>
            <span className="text-xs font-headline font-bold text-on-surface block">
              High Vows Only (95%+)
            </span>
            <span className="text-[11px] font-body text-on-surface-variant">
              Only candidates with near-perfect attendance
            </span>
          </div>
          <button
            type="button"
            onClick={() => setHighCommitmentOnly(!highCommitmentOnly)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              highCommitmentOnly ? 'bg-secondary' : 'bg-[#302840]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-surface-container-lowest transition-transform ${
                highCommitmentOnly ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Apply CTA */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-headline font-bold text-xs uppercase tracking-wider shadow-[0_0_18px_rgba(255,45,120,0.4)] hover:opacity-95 transition-all cursor-pointer"
        >
          Apply Parameters
        </button>
      </div>
    </div>
  );
};
