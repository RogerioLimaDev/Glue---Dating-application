import React from 'react';

interface VaultModalProps {
  isOpen: boolean;
  vowBalance: number;
  onClose: () => void;
  onAddVows: (amount: number) => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({
  isOpen,
  vowBalance,
  onClose,
  onAddVows
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-surface-container rounded-2xl border border-secondary/40 shadow-[0_0_30px_rgba(0,255,204,0.25)] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#302840] pb-3">
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-lg">all_inclusive</span>
            <h3 className="font-headline font-bold text-sm uppercase tracking-wider">
              Vow Escrow Vault
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

        <div className="text-center py-2">
          <span className="text-3xl font-headline font-extrabold text-secondary neon-text-cyan tabular-nums">
            {vowBalance} VOWS
          </span>
          <span className="text-xs text-on-surface-variant block mt-0.5">
            Active intention tokens in your account
          </span>
        </div>

        <div className="space-y-2 text-xs font-body text-on-surface-variant leading-relaxed bg-surface-container-low p-3 rounded-xl border border-[#302840]">
          <p className="font-semibold text-on-surface">How Vows Work:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Staking a Vow commits you to an in-person date.</li>
            <li>Meeting and verifying codes returns all Vows to both of you.</li>
            <li>Unexcused flaking forfeits your stake to your date.</li>
          </ul>
        </div>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onAddVows(5);
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-primary text-white font-headline font-bold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(255,45,120,0.4)] hover:opacity-95 transition-all cursor-pointer"
          >
            Top Up 5 Vows (Simulation)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-white font-headline text-xs tracking-wider transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
