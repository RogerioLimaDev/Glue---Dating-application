import React from 'react';
import { Candidate } from '../types';

interface VowStakedModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCeremony: () => void;
}

export const VowStakedModal: React.FC<VowStakedModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onOpenCeremony
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-surface-container rounded-2xl border border-primary/50 shadow-[0_0_30px_rgba(255,45,120,0.3)] p-5 space-y-4 text-center">
        {/* Animated Check & Handshake */}
        <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary mx-auto flex items-center justify-center text-primary shadow-[0_0_20px_rgba(255,45,120,0.5)]">
          <span className="material-symbols-outlined text-3xl">handshake</span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-label font-bold text-secondary uppercase tracking-widest">
            Escrow Contract Initiated
          </span>
          <h3 className="text-xl font-headline font-extrabold text-on-surface">
            Vow Staked with {candidate.name.split(' ')[0]}!
          </h3>
          <p className="text-xs font-body text-on-surface-variant leading-relaxed pt-1">
            {candidate.vowRequirement} Vows have been placed in escrow. Both of you will exchange 4-digit codes when you meet at {candidate.meetingVenue || 'the venue'}.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-low border border-[#302840] flex items-center justify-between text-xs font-label">
          <span className="text-on-surface-variant uppercase">Your Vow Deposit:</span>
          <span className="text-primary font-bold neon-text-pink">
            {candidate.vowRequirement} VOWS Locked
          </span>
        </div>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onOpenCeremony}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-headline font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,45,120,0.4)] hover:opacity-95 transition-all cursor-pointer"
          >
            Launch In-Person Ceremony Screen
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-surface-container-high border border-[#302840] text-on-surface-variant hover:text-white font-headline text-xs font-semibold tracking-wider transition-all cursor-pointer"
          >
            Keep Browsing Candidates
          </button>
        </div>
      </div>
    </div>
  );
};
