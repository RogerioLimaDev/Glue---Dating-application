import React, { useState } from 'react';
import { USER_AVATAR } from '../data/mockData';

interface ProfileScreenProps {
  vowBalance: number;
  onAddVows: (amount: number) => void;
  onOpenCeremony: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  vowBalance,
  onAddVows,
  onOpenCeremony
}) => {
  const [claimedBonus, setClaimedBonus] = useState(false);

  const handleClaim = () => {
    if (claimedBonus) return;
    onAddVows(3);
    setClaimedBonus(true);
  };

  return (
    <div className="relative flex-1 flex flex-col w-full min-h-screen bg-background text-on-surface pt-16 pb-24 selection:bg-primary selection:text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20 cyber-grid z-0" />

      <div className="relative z-10 flex flex-col w-full max-w-md mx-auto px-4 pb-8 space-y-4">
        {/* Profile Card */}
        <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/60 shadow-xl flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/60 shadow-[0_0_20px_rgba(255,45,120,0.5)]">
              <img
                src={USER_AVATAR}
                alt="Elena Vasquez"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-secondary border-2 border-surface-container shadow-[0_0_8px_#00ffcc]" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5">
              <h2 className="text-xl font-headline font-extrabold text-on-surface">
                Elena Vasquez
              </h2>
              <span className="material-symbols-outlined text-sm text-secondary">verified</span>
            </div>
            <p className="text-xs font-body text-on-surface-variant">
              Urban Planner &amp; Photographer • Vila Madalena
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-secondary/40 text-secondary text-[11px] font-label font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            <span>Protocol Tier 1 • Anti-Ghost Verified</span>
          </div>
        </div>

        {/* Vow Balance & Vault Controls */}
        <div className="p-4 rounded-xl bg-surface-container-high/80 border border-secondary/30 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-lg">all_inclusive</span>
              <span className="font-label text-xs uppercase font-bold text-secondary tracking-wider">
                Vow Protocol Balance
              </span>
            </div>
            <span className="text-2xl font-headline font-extrabold text-secondary neon-text-cyan tabular-nums">
              {vowBalance} VOWS
            </span>
          </div>

          <p className="text-xs font-body text-on-surface-variant">
            Each Vow is a proof of intention. Tokens are never lost if both parties show up for their dates.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleClaim}
              disabled={claimedBonus}
              className={`py-2 px-3 rounded-lg font-headline text-xs font-bold uppercase tracking-wider transition-all ${
                claimedBonus
                  ? 'bg-surface-container border border-[#302840] text-on-surface-variant opacity-60'
                  : 'bg-secondary text-on-secondary shadow-[0_0_12px_rgba(0,255,204,0.4)] hover:opacity-95 cursor-pointer'
              }`}
            >
              {claimedBonus ? 'Bonus Claimed (+3)' : 'Claim Weekly Vows (+3)'}
            </button>

            <button
              type="button"
              onClick={() => onAddVows(5)}
              className="py-2 px-3 rounded-lg bg-surface-container border border-primary/40 text-primary font-headline text-xs font-bold uppercase tracking-wider hover:bg-primary/20 shadow-[0_0_10px_rgba(255,45,120,0.3)] transition-all cursor-pointer"
            >
              Get 5 Vows ($4.99)
            </button>
          </div>
        </div>

        {/* Commitment Reputation Metrics */}
        <div className="p-4 rounded-xl bg-surface-container border border-[#302840] space-y-3">
          <h3 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Commitment Ledger
          </h3>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-[#302840]">
              <span className="text-lg font-headline font-bold text-secondary">99%</span>
              <span className="text-[10px] font-label text-on-surface-variant block uppercase">
                Attendance
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-[#302840]">
              <span className="text-lg font-headline font-bold text-primary">12</span>
              <span className="text-[10px] font-label text-on-surface-variant block uppercase">
                Dates Met
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-[#302840]">
              <span className="text-lg font-headline font-bold text-tertiary">0%</span>
              <span className="text-[10px] font-label text-on-surface-variant block uppercase">
                Flake Rate
              </span>
            </div>
          </div>
        </div>

        {/* Quick Date Ceremony shortcut */}
        <button
          type="button"
          onClick={onOpenCeremony}
          className="w-full py-3 rounded-xl bg-surface-container border border-primary/40 text-primary hover:bg-primary/15 font-headline font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(255,45,120,0.25)] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">key</span>
          <span>Open Active Date Ceremony (Alex Rivera)</span>
        </button>

        {/* Philosophy micro-card */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-[#302840] text-[11px] font-body text-on-surface-variant leading-relaxed">
          <span className="font-headline font-semibold text-on-surface block mb-1">
            Why Glue Works:
          </span>
          Traditional dating apps profit from keeping you single and swiping. Glue makes ghosting costly and rewards people who honor their word.
        </div>
      </div>
    </div>
  );
};
