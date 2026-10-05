import React, { useState } from 'react';
import { Candidate } from '../types';

interface DiscoverScreenProps {
  candidates: Candidate[];
  onMakeVow: (candidate: Candidate) => void;
  onSelectCandidateForCeremony: (candidate: Candidate) => void;
  onOpenCeremonyDirectly: () => void;
  hasActiveDate: boolean;
  activeDatePartnerName?: string;
  onOpenFilterModal: () => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  candidates,
  onMakeVow,
  onSelectCandidateForCeremony,
  onOpenCeremonyDirectly,
  hasActiveDate,
  activeDatePartnerName,
  onOpenFilterModal
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterMode, setFilterMode] = useState<'all' | 'high_vows' | 'location' | 'creative'>('all');
  const [superVowed, setSuperVowed] = useState<Record<string, boolean>>({});
  const [isStaking, setIsStaking] = useState(false);
  const [justStaked, setJustStaked] = useState(false);

  // Filter candidates based on selected filter
  const filteredCandidates = candidates.filter((c) => {
    if (filterMode === 'high_vows') return c.commitmentRate >= 98;
    if (filterMode === 'location') return c.location.toLowerCase().includes('madalena') || c.location.toLowerCase().includes('jardins');
    if (filterMode === 'creative') return c.tags.some(t => ['Art History', 'Architecture', 'Analog Film', 'Modernist Design'].includes(t));
    return true;
  });

  const activeCandidate = filteredCandidates[currentIndex % filteredCandidates.length] || candidates[0];
  const nextCandidate = filteredCandidates[(currentIndex + 1) % filteredCandidates.length] || candidates[1] || candidates[0];

  const handlePass = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredCandidates.length);
  };

  const handleSuperVow = (id: string) => {
    setSuperVowed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMakeVowClick = () => {
    if (isStaking) return;
    setIsStaking(true);
    setTimeout(() => {
      setIsStaking(false);
      setJustStaked(true);
      onMakeVow(activeCandidate);
      setTimeout(() => {
        setJustStaked(false);
      }, 2000);
    }, 800);
  };

  const isSuperVowActive = superVowed[activeCandidate.id];

  return (
    <div className="relative flex-1 flex flex-col w-full min-h-screen bg-background text-on-surface pt-16 pb-24 selection:bg-primary selection:text-white">
      {/* Background cyber grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20 cyber-grid z-0" />

      <div className="relative z-10 flex flex-col w-full max-w-md mx-auto px-4 pb-8 space-y-4">
        {/* Active Ceremony Alert Banner if user has an in-person date waiting */}
        {hasActiveDate && (
          <div className="mt-2 w-full p-2.5 rounded-xl bg-[#004d3d]/60 border border-secondary/40 shadow-[0_0_15px_rgba(0,255,204,0.2)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping shrink-0" />
              <div className="truncate">
                <p className="text-[11px] font-label font-bold text-secondary uppercase tracking-wider">
                  In-Person Ceremony Ready
                </p>
                <p className="text-xs text-on-surface truncate">
                  Meeting {activeDatePartnerName || 'Alex'} @ Café Gitane
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenCeremonyDirectly}
              className="px-3 py-1.5 rounded-lg bg-secondary text-on-secondary font-headline text-[11px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(0,255,204,0.4)] hover:opacity-95 transition-all shrink-0"
            >
              Enter Code
            </button>
          </div>
        )}

        {/* Sub-Header / Intentional Filter Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all shrink-0 font-label text-xs tracking-wider uppercase font-semibold cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-surface-container-high text-secondary shadow-[0_0_12px_rgba(0,255,204,0.3)] border border-secondary/40'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${filterMode === 'all' ? 'bg-secondary shadow-[0_0_6px_#00ffcc]' : 'bg-transparent'}`} />
              All Matches
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('high_vows')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all shrink-0 font-label text-xs tracking-wider uppercase cursor-pointer ${
                filterMode === 'high_vows'
                  ? 'bg-surface-container-high text-tertiary border border-tertiary/40 shadow-[0_0_10px_rgba(255,224,74,0.3)]'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[14px] text-tertiary">
                workspace_premium
              </span>
              High Vows (90%+)
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('location')}
              className={`px-3 py-1.5 rounded-full transition-all shrink-0 font-label text-xs tracking-wider uppercase cursor-pointer ${
                filterMode === 'location'
                  ? 'bg-surface-container-high text-secondary border border-secondary/40'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              São Paulo
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('creative')}
              className={`px-3 py-1.5 rounded-full transition-all shrink-0 font-label text-xs tracking-wider uppercase cursor-pointer ${
                filterMode === 'creative'
                  ? 'bg-surface-container-high text-primary border border-primary/40'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Creative &amp; Tech
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenFilterModal}
            aria-label="Filter parameters"
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:text-secondary border border-[#302840] transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px]">tune</span>
          </button>
        </div>

        {/* Featured Discovery Hero Card */}
        <div className="relative w-full rounded-2xl bg-surface-container border border-outline-variant/60 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.7)] flex flex-col transition-all">
          {/* Visual Image Area with Scrims and Badges */}
          <div className="relative w-full h-[370px] overflow-hidden bg-[#111118]">
            <img
              alt={`${activeCandidate.name} in ${activeCandidate.location}`}
              className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              src={activeCandidate.imageUrl}
            />

            {/* Ambient Cyber Scrim Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/25 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-transparent pointer-events-none" />

            {/* Top Overlay Badges: Commitment & Protocol Verification */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest/90 border border-secondary/30 backdrop-blur-md shadow-[0_0_12px_rgba(0,255,204,0.35)]">
                <span className="material-symbols-outlined text-[15px] text-secondary">
                  verified_user
                </span>
                <span className="font-label text-[11px] font-bold tracking-wide text-secondary uppercase">
                  {activeCandidate.commitmentRate}% Commitment
                </span>
                <span className="text-on-surface-variant/40 text-xs">•</span>
                <span className="font-label text-[11px] text-on-surface font-medium">
                  {activeCandidate.fulfilledCount} Fulfilled
                </span>
              </div>

              {activeCandidate.protocolVerified && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest/90 border border-tertiary/30 backdrop-blur-md text-tertiary shadow-[0_0_10px_rgba(255,224,74,0.25)]">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span className="font-label text-[10px] uppercase font-bold tracking-widest">
                    Protocol Verified
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Profile Name Overlaid on Image Base */}
            <div className="absolute bottom-2 inset-x-4 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">
                    {activeCandidate.name}
                  </h2>
                  <span className="font-headline text-2xl text-on-surface-variant font-light">
                    {activeCandidate.age}
                  </span>
                </div>
                <p className="font-body text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                  <span className="text-on-surface font-medium">{activeCandidate.title}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-secondary">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    {activeCandidate.location} ({activeCandidate.distance})
                  </span>
                </p>
              </div>

              {/* Live status pulse */}
              {activeCandidate.activeNow && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-lowest/85 backdrop-blur-md border border-[#302840]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                  </span>
                  <span className="font-label text-[10px] text-secondary uppercase font-semibold">
                    Active Now
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Dossier Body */}
          <div className="p-4 space-y-3.5">
            {/* Bio Quote */}
            <div className="bg-surface-container-low p-3 rounded-lg border border-[#302840]/60 shadow-sm">
              <p className="font-body text-xs text-on-surface leading-relaxed">
                {activeCandidate.bio}
              </p>
            </div>

            {/* Her Date Protocol / Stake Request */}
            <div className="bg-surface-container-high/60 border border-[#302840] p-3 rounded-lg flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(255,45,120,0.3)]">
                <span className="material-symbols-outlined text-primary text-[16px]">
                  handshake
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-label text-[10px] tracking-wider uppercase font-bold text-primary">
                    Vow Request
                  </span>
                  <span className="font-label text-[10px] font-semibold text-secondary">
                    Escrow Protected
                  </span>
                </div>
                <p className="font-body text-xs font-semibold text-on-surface mt-0.5">
                  Stakes {activeCandidate.vowRequirement} Vows for first date
                </p>
                <p className="font-body text-[11px] text-on-surface-variant mt-0.5">
                  {activeCandidate.vowVibeNote}
                </p>
              </div>
            </div>

            {/* Quick Vibe Badges */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {activeCandidate.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-label text-[11px] px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant border border-[#302840]/60"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Floating Action Controls */}
            <div className="pt-2 flex items-center gap-2.5">
              {/* Pass Button */}
              <button
                type="button"
                onClick={handlePass}
                aria-label="Pass Profile"
                className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center hover:text-error hover:bg-surface-container-highest border border-[#302840] transition-all shrink-0 active:scale-95 shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>

              {/* Super Vow / Priority Ping */}
              <button
                type="button"
                onClick={() => handleSuperVow(activeCandidate.id)}
                aria-label="Super Vow"
                className={`w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center border transition-all shrink-0 active:scale-95 shadow-[0_0_14px_rgba(255,45,120,0.35)] cursor-pointer ${
                  isSuperVowActive
                    ? 'text-tertiary border-tertiary shadow-[0_0_18px_rgba(255,224,74,0.5)]'
                    : 'text-primary border-primary/40 hover:bg-surface-container-highest'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
              </button>

              {/* Make A Vow Action Button */}
              <button
                type="button"
                onClick={handleMakeVowClick}
                disabled={isStaking}
                className={`flex-1 h-12 rounded-full flex items-center justify-center gap-2 font-headline font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer ${
                  justStaked
                    ? 'bg-secondary text-on-secondary shadow-[0_0_20px_rgba(0,255,204,0.5)]'
                    : 'bg-primary text-on-primary shadow-[0_0_18px_rgba(255,45,120,0.45)] hover:opacity-95'
                }`}
              >
                {isStaking ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    <span>Vowing {activeCandidate.vowRequirement} Tokens...</span>
                  </>
                ) : justStaked ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Vow Staked!</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">handshake</span>
                    <span>Make a Vow ({activeCandidate.vowRequirement} Vows)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 'Next in Queue' Teaser / Secondary Card preview */}
        <div className="w-full flex flex-col space-y-2 pt-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              Next In Queue
            </span>
            <span className="font-label text-[10px] text-secondary font-semibold">
              14 Candidates Remaining
            </span>
          </div>

          <div
            onClick={() => onSelectCandidateForCeremony(nextCandidate)}
            className="w-full bg-surface-container p-3 rounded-xl border border-outline-variant/60 shadow-lg flex items-center gap-3 transition-transform hover:scale-[1.01] cursor-pointer"
          >
            <div className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border border-[#302840]">
              <img
                alt={`${nextCandidate.name} preview`}
                className="w-full h-full object-cover"
                src={nextCandidate.imageUrl}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent" />
              <div className="absolute bottom-1 right-1">
                <span className="w-2 h-2 rounded-full bg-secondary block shadow-[0_0_6px_#00ffcc]" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-headline text-sm font-bold text-on-surface truncate">
                  {nextCandidate.name}
                </h3>
                <span className="text-xs text-on-surface-variant">{nextCandidate.age}</span>
                <span className="material-symbols-outlined text-[13px] text-secondary shrink-0">
                  verified
                </span>
              </div>
              <p className="font-body text-[11px] text-on-surface-variant truncate mt-0.5">
                {nextCandidate.title} • {nextCandidate.location} ({nextCandidate.distance})
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-high font-label text-[10px] font-medium text-secondary">
                  {nextCandidate.commitmentRate}% Date Rate
                </span>
                <span className="font-body text-[10px] text-on-surface-variant truncate">
                  {nextCandidate.previewBio || nextCandidate.vowVibeNote}
                </span>
              </div>
            </div>

            <button
              type="button"
              aria-label={`View ${nextCandidate.name} Dossier`}
              className="w-8 h-8 rounded-full bg-surface-container-high border border-[#302840] text-secondary flex items-center justify-center hover:bg-surface-container-highest shrink-0 shadow-[0_0_8px_rgba(0,255,204,0.2)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Micro-Education / Trust Badge Banner */}
        <div className="w-full bg-surface-container-low border border-[#302840]/60 p-3.5 rounded-xl flex items-center gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,255,204,0.25)]">
            <span className="material-symbols-outlined text-secondary text-[17px]">
              all_inclusive
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label text-[11px] font-bold text-on-surface uppercase tracking-wide">
              Glue Anti-Ghosting Protocol
            </p>
            <p className="font-body text-[11px] text-on-surface-variant leading-tight mt-0.5">
              Every Like is backed by your Vow balance. Flaking automatically forfeits Vows to your date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
