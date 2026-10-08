import React from 'react';

interface IcebreakerModalProps {
  isOpen: boolean;
  partnerName: string;
  onClose: () => void;
}

export const IcebreakerModal: React.FC<IcebreakerModalProps> = ({
  isOpen,
  partnerName,
  onClose
}) => {
  if (!isOpen) return null;

  const icebreakers = [
    "“What's the best vinyl record or hidden gem you've stumbled on this year?”",
    "“If you could teleport us to any café or bar in the world right now, where are we heading?”",
    "“What project or craft are you working on that completely makes you lose track of time?”",
    "“What's your most controversial opinion about architecture, coffee, or design?”"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-surface-container rounded-2xl border border-secondary/50 shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#302840] pb-3">
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined">forum</span>
            <h3 className="font-headline font-bold text-sm uppercase tracking-wider">
              Date Icebreakers with {partnerName.split(' ')[0]}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <p className="text-xs font-body text-on-surface-variant">
          Your date is verified and your vows are safely returned! Here are a few intentional topics to skip the small talk:
        </p>

        <div className="space-y-2.5">
          {icebreakers.map((prompt, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-surface-container-low border border-[#302840] hover:border-secondary/50 transition-colors text-xs font-body text-on-surface italic leading-relaxed"
            >
              {prompt}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-secondary text-on-secondary font-headline font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,204,0.4)] hover:opacity-95 transition-all cursor-pointer"
        >
          Close &amp; Enjoy Your Date
        </button>
      </div>
    </div>
  );
};
