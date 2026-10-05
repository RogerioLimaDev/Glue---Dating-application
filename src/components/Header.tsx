import React from 'react';
import { GLUE_LOGO, USER_AVATAR } from '../data/mockData';

interface HeaderProps {
  mode: 'discover' | 'ceremony' | 'vows' | 'chats' | 'profile';
  vowBalance: number;
  onBack?: () => void;
  onOpenProfile?: () => void;
  onOpenVault?: () => void;
  onToggleDemoCeremony?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  vowBalance,
  onBack,
  onOpenProfile,
  onOpenVault,
  onToggleDemoCeremony
}) => {
  if (mode === 'ceremony') {
    return (
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0a0a12]/90 backdrop-blur-xl border-b border-[#302840]/60 pt-safe shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              aria-label="Go back"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-variant text-primary hover:bg-primary/20 neon-glow-pink transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-lg neon-text-pink">
                arrow_back_ios_new
              </span>
            </button>
            <img
              alt="Glue"
              className="h-8 w-auto object-contain rounded-lg drop-shadow-[0_0_8px_rgba(255,45,120,0.5)]"
              src={GLUE_LOGO}
              onError={(e) => {
                // fallback to text if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <h1 className="text-xs sm:text-sm font-headline font-bold uppercase tracking-wider text-on-surface">
              Candidate Dossier
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenVault}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#004d3d]/50 border border-secondary/30 neon-glow-cyan hover:bg-[#004d3d]/80 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-secondary text-xs">
                electric_bolt
              </span>
              <span className="text-[11px] font-label font-bold tracking-wider text-secondary neon-text-cyan">
                {vowBalance} VOWS
              </span>
            </button>
            <button
              type="button"
              onClick={onOpenProfile}
              aria-label="View Profile"
              className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/60 shadow-[0_0_10px_rgba(255,45,120,0.4)]"
            >
              <img
                alt="Profile"
                className="w-full h-full object-cover"
                src={USER_AVATAR}
              />
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0a0a12]/85 backdrop-blur-xl border-b border-[#302840]/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2">
          <img
            alt="Glue Logo"
            className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,45,120,0.65)] rounded"
            src={GLUE_LOGO}
          />
          <span className="font-headline text-lg text-white tracking-wider font-extrabold drop-shadow-[0_0_10px_rgba(255,45,120,0.4)]">
            Glue
          </span>
          <span className="hidden">Discover</span>
        </div>

        {/* Right Action: Ceremony quick link, Vow Balance & User Avatar */}
        <div className="flex items-center gap-2">
          {onToggleDemoCeremony && (
            <button
              type="button"
              onClick={onToggleDemoCeremony}
              className="hidden xs:flex items-center gap-1 text-[10px] font-label px-2 py-1 rounded-full bg-primary/15 border border-primary/40 text-primary hover:bg-primary/25 transition-all shadow-[0_0_8px_rgba(255,45,120,0.3)]"
              title="Open In-Person Verification Ceremony Screen"
            >
              <span className="material-symbols-outlined text-[13px]">key</span>
              <span className="uppercase font-bold tracking-wide">Ceremony</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenVault}
            className="flex items-center gap-1.5 bg-[#141422]/90 border border-secondary/40 px-3 py-1.5 rounded-full shadow-[0_0_12px_rgba(0,255,204,0.25)] hover:border-secondary transition-all cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[17px] text-secondary"
              style={{ color: '#00ffcc' }}
            >
              all_inclusive
            </span>
            <span className="font-label text-xs font-bold tracking-widest uppercase text-secondary">
              {vowBalance} VOWS
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="View Profile"
            className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden focus:outline-none ring-2 ring-primary/60 shadow-[0_0_12px_rgba(255,45,120,0.4)]"
          >
            <img
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover"
              src={USER_AVATAR}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
