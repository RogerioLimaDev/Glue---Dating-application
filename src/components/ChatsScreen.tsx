import React, { useState } from 'react';
import { Conversation, ChatMessage } from '../types';

interface ChatsScreenProps {
  conversations: Conversation[];
  selectedCandidateId?: string;
  onOpenCeremonyForCandidate: (candidateId: string) => void;
  onSendMessage: (conversationId: string, text: string) => void;
}

export const ChatsScreen: React.FC<ChatsScreenProps> = ({
  conversations,
  selectedCandidateId,
  onOpenCeremonyForCandidate,
  onSendMessage
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(
    selectedCandidateId
      ? conversations.find(c => c.candidateId === selectedCandidateId)?.id || conversations[0].id
      : conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="relative flex-1 flex flex-col w-full min-h-screen bg-background text-on-surface pt-16 pb-24 selection:bg-primary selection:text-white">
      <div className="fixed inset-0 pointer-events-none opacity-20 cyber-grid z-0" />

      <div className="relative z-10 flex flex-col w-full max-w-md mx-auto px-4 pb-8 space-y-4">
        {/* Chat List Carousel / Selector */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-headline font-bold text-on-surface flex items-center gap-1.5">
              <span>Intentional Dialogues</span>
              <span className="text-xs text-secondary font-label">({conversations.length})</span>
            </h2>
            <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-wider">
              No endless texting
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {conversations.map((conv) => {
              const isCurrent = conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setActiveConvId(conv.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-surface-container-high border-secondary text-on-surface shadow-[0_0_10px_rgba(0,255,204,0.3)]'
                      : 'bg-surface-container border-[#302840] text-on-surface-variant hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conv.candidateImage}
                      alt={conv.candidateName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    {conv.hasActiveEscrow && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-secondary shadow-[0_0_4px_#00ffcc]" />
                    )}
                  </div>
                  <span className="text-xs font-headline font-semibold">{conv.candidateName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Conversation Container */}
        {activeConv ? (
          <div className="flex-1 flex flex-col rounded-2xl bg-surface-container border border-outline-variant/60 shadow-xl overflow-hidden min-h-[500px]">
            {/* Thread Header */}
            <div className="p-3.5 bg-surface-container-high/80 border-b border-[#302840] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeConv.candidateImage}
                    alt={activeConv.candidateName}
                    className="w-10 h-10 rounded-full object-cover border border-primary/50"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_6px_#00ffcc]" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-sm text-on-surface flex items-center gap-1.5">
                    {activeConv.candidateName}
                    <span className="material-symbols-outlined text-xs text-secondary">verified</span>
                  </h3>
                  <p className="text-[10px] font-label text-secondary neon-text-cyan">
                    {activeConv.hasActiveEscrow ? 'Escrow Locked • Ceremony Ready' : 'Mutual Vow Established'}
                  </p>
                </div>
              </div>

              {activeConv.hasActiveEscrow && (
                <button
                  type="button"
                  onClick={() => onOpenCeremonyForCandidate(activeConv.candidateId)}
                  className="px-2.5 py-1 rounded-lg bg-primary text-white font-headline text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(255,45,120,0.4)] hover:opacity-90 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">key</span>
                  <span>Ceremony</span>
                </button>
              )}
            </div>

            {/* In-Person Escrow Milestone Banner inside chat */}
            {activeConv.hasActiveEscrow && activeConv.meetingVenue && (
              <div className="m-3 p-3 rounded-xl bg-surface-container-highest/60 border border-secondary/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-sm">handshake</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-label uppercase font-bold text-secondary tracking-wider block">
                      Confirmed Venue
                    </span>
                    <span className="text-xs font-headline font-bold text-white">
                      {activeConv.meetingVenue} • {activeConv.meetingTime}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCeremonyForCandidate(activeConv.candidateId)}
                  className="text-xs font-label text-secondary underline hover:text-white"
                >
                  View Code
                </button>
              </div>
            )}

            {/* Message History */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[360px]">
              {activeConv.messages.map((msg: ChatMessage) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] p-3 rounded-2xl text-xs font-body leading-relaxed ${
                        isUser
                          ? 'bg-primary text-white rounded-br-none shadow-[0_0_12px_rgba(255,45,120,0.3)]'
                          : 'bg-surface-container-high text-on-surface border border-[#302840] rounded-bl-none'
                      }`}
                    >
                      {msg.text}

                      {/* Date Proposal Widget inside chat */}
                      {msg.isDateProposal && msg.proposalDetails && (
                        <div className="mt-2 pt-2 border-t border-white/20 text-[11px] font-label space-y-1">
                          <div className="flex items-center justify-between text-tertiary">
                            <span className="font-bold uppercase">Staked Date Proposal</span>
                            <span>{msg.proposalDetails.stakedVows} VOWS</span>
                          </div>
                          <p className="text-white/90">
                            {msg.proposalDetails.venue} • {msg.proposalDetails.time}
                          </p>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-label text-on-surface-variant/70 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick date prompts */}
            <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-[#302840]">
              <button
                type="button"
                onClick={() => setInputText("I'm heading to Café Gitane right now!")}
                className="px-2.5 py-1 rounded-full bg-surface-container-high text-[10px] font-label text-on-surface-variant hover:text-secondary whitespace-nowrap"
              >
                “Heading to venue now!”
              </button>
              <button
                type="button"
                onClick={() => setInputText("See you inside near the front desk.")}
                className="px-2.5 py-1 rounded-full bg-surface-container-high text-[10px] font-label text-on-surface-variant hover:text-secondary whitespace-nowrap"
              >
                “See you inside”
              </button>
              <button
                type="button"
                onClick={() => setInputText("Code ready on my phone!")}
                className="px-2.5 py-1 rounded-full bg-surface-container-high text-[10px] font-label text-on-surface-variant hover:text-secondary whitespace-nowrap"
              >
                “Code ready!”
              </button>
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 bg-surface-container-high border-t border-[#302840] flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 h-10 px-3.5 rounded-xl bg-surface-container-lowest border border-[#302840] text-on-surface text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/50"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 shadow-[0_0_12px_rgba(255,45,120,0.4)] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </form>
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant text-center py-10">No chats yet.</p>
        )}
      </div>
    </div>
  );
};
