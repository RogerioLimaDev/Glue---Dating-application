import React from 'react';
import { Commitment } from '../types';

interface VowsScreenProps {
  commitments: Commitment[];
  vowBalance: number;
  onOpenCeremony: (commitment: Commitment) => void;
  onDiscoverMore: () => void;
}

export const VowsScreen: React.FC<VowsScreenProps> = ({
  commitments,
  vowBalance,
  onOpenCeremony,
  onDiscoverMore
}) => {
  const activeCommitments = commitments.filter((c) => c.status === 'escrowed');
  const fulfilledCommitments = commitments.filter((c) => c.status === 'fulfilled');

  return (
    <div className="relative flex-1 flex flex-col w-full min-h-screen bg-background text-on-surface pt-16 pb-24 selection:bg-primary selection:text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20 cyber-grid z-0" />

      <div className="relative z-10 flex flex-col w-full max-w-md mx-auto px-4 pb-8 space-y-5">
        {/* Header Summary */}
        <div className="pt-2 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-secondary/30 text-secondary text-xs font-label uppercase tracking-wider font-bold">
            <span className="material-symbols-outlined text-sm">all_inclusive</span>
            <span>Escrow Protocol Vault</span>
          </div>
          <h2 className="text-2xl font-headline font-extrabold text-on-surface">
            Your Vow Contracts
          </h2>
          <p className="text-xs font-body text-on-surface-variant">
            Each contract locks mutual tokens in escrow. Codes exchanged in person release the stake back to both attendees.
          </p>
        </div>

        {/* Vault Stats Row */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/60 shadow-md">
            <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider block">
              Available
            </span>
            <span className="text-xl font-headline font-extrabold text-secondary neon-text-cyan tabular-nums">
              {vowBalance}
            </span>
            <span className="text-[10px] font-body text-on-surface-variant block">Tokens</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/60 shadow-md">
            <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider block">
              In Escrow
            </span>
            <span className="text-xl font-headline font-extrabold text-primary neon-text-pink tabular-nums">
              {activeCommitments.reduce((sum, c) => sum + c.vowsStaked, 0)}
            </span>
            <span className="text-[10px] font-body text-on-surface-variant block">Locked</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/60 shadow-md">
            <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider block">
              Fulfilled
            </span>
            <span className="text-xl font-headline font-extrabold text-tertiary neon-text-yellow tabular-nums">
              14
            </span>
            <span className="text-[10px] font-body text-on-surface-variant block">Dates (100%)</span>
          </div>
        </div>

        {/* Active In-Person Escrows */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-label text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              Active In-Person Escrow ({activeCommitments.length})
            </h3>
            <span className="text-[10px] font-label text-on-surface-variant">Code Verification Ready</span>
          </div>

          {activeCommitments.length === 0 ? (
            <div className="p-6 rounded-xl bg-surface-container border border-dashed border-[#302840] text-center space-y-2">
              <p className="text-xs text-on-surface-variant">No active escrow commitments currently.</p>
              <button
                type="button"
                onClick={onDiscoverMore}
                className="px-4 py-2 rounded-full bg-primary text-white font-headline text-xs font-bold uppercase tracking-wider"
              >
                Stake a Vow in Discover
              </button>
            </div>
          ) : (
            activeCommitments.map((commit) => (
              <div
                key={commit.id}
                className="p-4 rounded-xl bg-surface-container border border-secondary/40 shadow-[0_0_20px_rgba(0,255,204,0.15)] flex flex-col space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={commit.candidateImage}
                      alt={commit.candidateName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-secondary"
                    />
                    <div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">
                        {commit.candidateName}, {commit.candidateAge}
                      </h4>
                      <p className="font-body text-xs text-secondary neon-text-cyan flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">location_on</span>
                        {commit.venue} • {commit.time}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-label text-xs font-bold text-primary neon-text-pink block">
                      {commit.vowsStaked} Vows
                    </span>
                    <span className="text-[10px] font-label px-2 py-0.5 rounded bg-primary-container/30 text-on-primary-container uppercase">
                      Escrowed
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between text-xs font-label">
                  <span className="text-on-surface-variant">Your Live Token:</span>
                  <span className="font-mono text-primary font-bold tracking-widest text-sm">
                    {commit.userCode}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCeremony(commit)}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary via-primary-container to-secondary text-white font-headline font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,45,120,0.4)] hover:opacity-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  <span>Launch In-Person Verification Ceremony</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Fulfilled Vows Archive */}
        <div className="space-y-2 pt-2">
          <h3 className="font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Completed Commitments
          </h3>

          <div className="space-y-2">
            {fulfilledCommitments.map((commit) => (
              <div
                key={commit.id}
                className="p-3 rounded-xl bg-surface-container border border-outline-variant/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={commit.candidateImage}
                    alt={commit.candidateName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-headline font-bold text-on-surface block">
                      {commit.candidateName}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {commit.venue} • Verified
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-secondary neon-text-cyan font-label font-bold text-xs">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>+10 Vows Returned</span>
                </div>
              </div>
            ))}

            <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/60 flex items-center justify-between text-xs opacity-80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-tertiary">
                  CB
                </div>
                <div>
                  <span className="font-headline font-bold text-on-surface block">
                    Carolina B.
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    Sterna Café • 3 days ago
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-secondary font-label font-bold text-xs">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>+4 Vows Returned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Flake Protocol Rules Guarantee */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-[#302840] space-y-2">
          <div className="flex items-center gap-2 text-tertiary">
            <span className="material-symbols-outlined text-base">shield</span>
            <h4 className="font-label text-xs font-bold uppercase tracking-wider">
              100% Anti-Ghosting Guarantee
            </h4>
          </div>
          <p className="text-xs font-body text-on-surface-variant leading-relaxed">
            If a confirmed match fails to show up within 15 minutes of the scheduled time, their entire staked vow deposit is automatically forfeited and transferred directly into your personal balance.
          </p>
        </div>
      </div>
    </div>
  );
};
