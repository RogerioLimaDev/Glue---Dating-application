import React, { useState } from 'react';
import { Commitment } from '../types';

interface CeremonyScreenProps {
  commitment: Commitment;
  onVerify: () => void;
  isVerified: boolean;
  onOpenChat: (candidateId: string) => void;
  onOpenIcebreakers: () => void;
}

export const CeremonyScreen: React.FC<CeremonyScreenProps> = ({
  commitment,
  onVerify,
  isVerified,
  onOpenChat,
  onOpenIcebreakers
}) => {
  // 4 digit state for entered code from partner (defaults to 6319 as in HTML 2)
  const [partnerDigits, setPartnerDigits] = useState<string[]>(['6', '3', '1', '9']);
  const [activeDigitIndex, setActiveDigitIndex] = useState<number | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);

  const handleDigitChange = (index: number, val: string) => {
    const updated = [...partnerDigits];
    updated[index] = val;
    setPartnerDigits(updated);
  };

  const handleKeypadPress = (digit: string) => {
    if (activeDigitIndex === null) {
      // Find first empty or replace index 0
      const nextIndex = partnerDigits.findIndex(d => d === '');
      const target = nextIndex !== -1 ? nextIndex : 0;
      const updated = [...partnerDigits];
      updated[target] = digit;
      setPartnerDigits(updated);
      setActiveDigitIndex((target + 1) % 4);
    } else {
      const updated = [...partnerDigits];
      updated[activeDigitIndex] = digit;
      setPartnerDigits(updated);
      setActiveDigitIndex((activeDigitIndex + 1) % 4);
    }
  };

  const handleBackspace = () => {
    const target = activeDigitIndex !== null ? activeDigitIndex : 3;
    const updated = [...partnerDigits];
    updated[target] = '';
    setPartnerDigits(updated);
    setActiveDigitIndex(Math.max(0, target - 1));
  };

  const handleVerifyClick = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onVerify();
    }, 800);
  };

  const handleCloseVerifiedModal = () => {
    setShowVerifiedModal(false);
  };

  // Sync modal with isVerified prop from parent
  React.useEffect(() => {
    if (isVerified) {
      setShowVerifiedModal(true);
    }
  }, [isVerified]);

  const userCodeDigits = (commitment.userCode || '4827').split('');

  return (
    <div className="relative flex-1 flex flex-col w-full min-h-screen bg-background text-on-surface pt-16 pb-24 selection:bg-primary selection:text-white">
      {/* Ambient Hologram Grid Background Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-25 cyber-grid z-0" />

      {/* Cyber Ambient Glow Spotlights */}
      <div className="fixed top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-32 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col w-full max-w-md mx-auto px-4 pb-8 space-y-5">
        {/* Header Category Pill & Intro */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-high border border-primary/40 neon-glow-pink">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-[11px] font-label font-bold tracking-widest text-primary uppercase">
              In-Person Ceremony
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">
              You&apos;re here.
            </h2>
            <p className="text-sm font-headline text-secondary neon-text-cyan font-semibold tracking-wide uppercase">
              Confirm that you met.
            </p>
          </div>

          <p className="text-xs font-body text-on-surface-variant max-w-xs leading-relaxed">
            Your Date Code verifies that both of you showed up for the commitment. Exchange codes in person to complete the vow.
          </p>
        </div>

        {/* Meeting Identity Card */}
        <div className="relative p-4 rounded-xl bg-surface-container border border-outline-variant/60 shadow-xl overflow-hidden">
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-1 rounded-full bg-primary/40 blur-sm" />
              <img
                alt={commitment.candidateName}
                className="relative w-14 h-14 rounded-full object-cover shadow-md border-2 border-primary/50"
                src={commitment.candidateImage}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-surface-container flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_6px_#00ffcc]" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-label tracking-widest uppercase text-on-surface-variant">
                <span>Meeting With</span>
              </div>
              <h3 className="text-base font-headline font-bold text-on-surface truncate">
                {commitment.candidateName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-secondary neon-text-cyan font-medium">
                <span className="material-symbols-outlined text-sm">handshake</span>
                <span className="truncate">{commitment.venue}, {commitment.time}</span>
              </div>
            </div>

            <button
              onClick={() => onOpenChat(commitment.candidateId)}
              className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant text-on-surface-variant hover:text-secondary hover:border-secondary flex items-center justify-center transition-all"
              title="Open Chat"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
            </button>
          </div>
        </div>

        {/* Your Date Code Card */}
        <div className="relative p-5 rounded-xl bg-surface-container-high/90 border border-primary/30 backdrop-blur-md shadow-2xl flex flex-col items-center text-center space-y-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5 text-primary text-[11px] font-label font-bold tracking-widest uppercase">
              <span className="material-symbols-outlined text-sm">key</span>
              <span>Your Date Code</span>
            </div>
            <span className="text-[10px] font-label px-2 py-0.5 rounded bg-primary-container/30 border border-primary/40 text-on-primary-container tracking-wider font-semibold">
              LIVE TOKEN
            </span>
          </div>

          {/* Glowing Cyber Monospace Block */}
          <div className="w-full py-4 px-2 rounded-lg bg-surface-container-lowest border border-[#302840]/80 flex items-center justify-center gap-3">
            {userCodeDigits.map((digit, i) => (
              <span
                key={i}
                className="w-12 h-14 flex items-center justify-center text-3xl font-headline font-extrabold text-primary neon-text-pink bg-surface-container-high rounded-md shadow-inner border border-primary/30"
              >
                {digit}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-body pt-1">
            <span className="material-symbols-outlined text-sm text-primary">visibility</span>
            <span>Show this code to {commitment.candidateName.split(' ')[0]} when you meet</span>
          </div>
        </div>

        {/* Enter Partner's Code Card */}
        <div className="relative p-5 rounded-xl bg-surface-container border border-secondary/30 shadow-xl flex flex-col space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-secondary text-[11px] font-label font-bold tracking-widest uppercase">
              <span className="material-symbols-outlined text-sm">lock_open</span>
              <span>Enter {commitment.candidateName.split(' ')[0]}&apos;s Code</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowKeypad(!showKeypad)}
                className="text-[10px] font-label text-on-surface-variant hover:text-secondary underline"
              >
                {showKeypad ? 'Hide Keypad' : 'Edit Code'}
              </button>
              <span className="text-[10px] font-label px-2 py-0.5 rounded bg-secondary-container/40 text-secondary tracking-widest neon-text-cyan uppercase font-bold">
                {partnerDigits.every(d => d !== '') ? 'Ready' : 'Pending'}
              </span>
            </div>
          </div>

          {/* 4 Interactive Digit Boxes */}
          <div className="grid grid-cols-4 gap-3 w-full">
            {partnerDigits.map((digit, idx) => {
              const isSelected = activeDigitIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveDigitIndex(idx);
                    setShowKeypad(true);
                  }}
                  className={`h-14 rounded-lg bg-surface-container-lowest flex items-center justify-center text-2xl font-headline font-bold text-secondary neon-text-cyan shadow-inner border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-secondary shadow-[0_0_12px_rgba(0,255,204,0.5)] ring-1 ring-secondary'
                      : 'border-[#302840]'
                  }`}
                >
                  {digit || <span className="text-outline-variant text-base animate-pulse">_</span>}
                </button>
              );
            })}
          </div>

          {/* Keypad when user wants to edit code */}
          {showKeypad && (
            <div className="bg-surface-container-low p-3 rounded-lg border border-[#302840] space-y-2 mt-2">
              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeypadPress(num)}
                    className="h-10 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-headline font-bold text-base active:scale-95 transition-all"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPartnerDigits(['', '', '', ''])}
                  className="h-10 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-xs font-label uppercase"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="h-10 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-headline font-bold text-base active:scale-95 transition-all"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="h-10 rounded bg-surface-container hover:bg-surface-container-high text-error flex items-center justify-center active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-base">backspace</span>
                </button>
              </div>
              <div className="flex justify-between items-center pt-1">
                <button
                  type="button"
                  onClick={() => setPartnerDigits(['6', '3', '1', '9'])}
                  className="text-[11px] font-label text-secondary hover:underline"
                >
                  Quick Pre-Fill (6319)
                </button>
                <button
                  type="button"
                  onClick={() => setShowKeypad(false)}
                  className="text-[11px] font-label text-on-surface-variant hover:text-white"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          <p className="text-xs text-center text-on-surface-variant font-body">
            Ask {commitment.candidateName.split(' ')[0]} for their 4-digit code
          </p>
        </div>

        {/* CTA Verification Button */}
        <div className="pt-1">
          <button
            type="button"
            id="verifyBtn"
            onClick={handleVerifyClick}
            disabled={verifying}
            className={`w-full py-4 px-6 rounded-xl font-headline font-bold text-sm tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] ${
              isVerified
                ? 'bg-secondary text-on-secondary shadow-[0_0_24px_rgba(0,255,204,0.6)]'
                : 'bg-gradient-to-r from-primary via-primary-container to-secondary text-on-primary shadow-[0_0_24px_rgba(255,45,120,0.45)] hover:shadow-[0_0_32px_rgba(0,255,204,0.6)]'
            }`}
          >
            {verifying ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                <span className="tracking-widest uppercase">Synchronizing Vows...</span>
              </>
            ) : isVerified ? (
              <>
                <span className="material-symbols-outlined text-lg neon-text-cyan">check_circle</span>
                <span className="tracking-widest uppercase neon-text-cyan">Vow Synchronized</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">verified_user</span>
                <span className="tracking-widest uppercase">Verify Date</span>
              </>
            )}
          </button>
        </div>

        {/* Fulfilled State Preview Card */}
        {isVerified && !showVerifiedModal && (
          <div
            className="relative p-5 rounded-xl bg-surface-container-low border transition-all duration-500 shadow-lg overflow-hidden"
            style={{
              borderColor: 'rgba(0, 255, 204, 0.7)',
              boxShadow: '0 0 20px rgba(0,255,204,0.25)',
              backgroundColor: 'var(--surface-container)'
            }}
          >
            <div className="flex items-start gap-3.5">
              {/* Glowing Infinity Knot Badge */}
              <div className="w-10 h-10 rounded-full bg-secondary-container/60 border border-secondary/40 flex-shrink-0 flex items-center justify-center neon-glow-cyan">
                <span className="material-symbols-outlined text-secondary text-xl">
                  all_inclusive
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-label font-bold text-tertiary tracking-widest uppercase">
                    Fulfilled • Mutual Vow
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-secondary/20 text-secondary text-[9px] font-bold uppercase">
                    Live
                  </span>
                </div>

                <h4 className="text-xs font-headline font-semibold text-on-surface uppercase tracking-wide">
                  Date Verified - "Your commitment has been fulfilled. Enjoy your meeting."
                </h4>

                <div className="flex items-center gap-2 pt-1 text-xs text-on-surface-variant font-body">
                  <span className="material-symbols-outlined text-sm text-tertiary">
                    workspace_premium
                  </span>
                  <span className="font-medium text-on-surface">10 Vows Fulfilled</span>
                  <span className="text-[11px] opacity-75">
                    (5 yours + 5 {commitment.candidateName.split(' ')[0]}'s returned)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {showVerifiedModal && (
          <VerifiedModal
            onClose={handleCloseVerifiedModal}
            commitment={commitment}
          />
        )}
      </div>
    </div>
  );
};

const VerifiedModal: React.FC<{ onClose: () => void; commitment: Commitment }> = ({ onClose, commitment }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
    <div className="w-full max-w-sm bg-surface-container rounded-2xl border border-secondary/50 shadow-[0_0_30px_rgba(0,255,204,0.3)] p-5 space-y-4 text-center">
      {/* Animated Check & Infinity Knot */}
      <div className="w-16 h-16 rounded-full bg-secondary/20 border-2 border-secondary mx-auto flex items-center justify-center text-secondary shadow-[0_0_20px_rgba(0,255,204,0.5)]">
        <span className="material-symbols-outlined text-3xl">all_inclusive</span>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-label font-bold text-secondary uppercase tracking-widest">
          Date Verified
        </span>
        <h3 className="text-xl font-headline font-extrabold text-on-surface">
          Commitment Fulfilled!
        </h3>
        <p className="text-xs font-body text-on-surface-variant leading-relaxed pt-1">
          Your commitment has been fulfilled. Enjoy your meeting.
        </p>
      </div>

      <div className="p-3 rounded-xl bg-surface-container-low border border-[#302840] flex items-center justify-between text-xs font-label">
        <span className="text-on-surface-variant uppercase">Vows Fulfilled:</span>
        <span className="text-secondary font-bold neon-text-cyan">
          10 VOWS Returned
        </span>
      </div>

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-secondary to-tertiary text-on-secondary font-headline font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,204,0.4)] hover:opacity-95 transition-all cursor-pointer"
        >
          Convert your vows into currency
        </button>
      </div>
    </div>
  </div>
);

export default CeremonyScreen;
