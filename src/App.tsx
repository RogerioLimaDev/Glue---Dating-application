/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Candidate, Commitment, Conversation } from './types';
import { CANDIDATES, INITIAL_COMMITMENT, INITIAL_CONVERSATIONS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DiscoverScreen } from './components/DiscoverScreen';
import { CeremonyScreen } from './components/CeremonyScreen';
import { VowsScreen } from './components/VowsScreen';
import { ChatsScreen } from './components/ChatsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { FilterModal } from './components/FilterModal';
import { IcebreakerModal } from './components/IcebreakerModal';
import { VowStakedModal } from './components/VowStakedModal';
import { VaultModal } from './components/VaultModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'discover' | 'ceremony' | 'vows' | 'chats' | 'profile'>('discover');
  const [vowBalance, setVowBalance] = useState<number>(12);
  const [candidates, setCandidates] = useState<Candidate[]>(CANDIDATES);
  const [commitments, setCommitments] = useState<Commitment[]>([INITIAL_COMMITMENT]);
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment>(INITIAL_COMMITMENT);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Reset verification state when leaving ceremony tab (for demo purposes)
  React.useEffect(() => {
    if (activeTab !== 'ceremony') {
      setIsVerified(false);
    }
  }, [activeTab]);

  // Modals state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isIcebreakerModalOpen, setIsIcebreakerModalOpen] = useState(false);
  const [isVowStakedModalOpen, setIsVowStakedModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [stakedCandidate, setStakedCandidate] = useState<Candidate | null>(null);

  // Staking a vow on a candidate in Discover
  const handleMakeVow = (candidate: Candidate) => {
    const cost = candidate.vowRequirement || 2;
    if (vowBalance < cost) {
      alert("Insufficient Vows in balance! Top up in the Vow Vault.");
      setIsVaultModalOpen(true);
      return;
    }

    setVowBalance((prev) => Math.max(0, prev - cost));

    const newCommitment: Commitment = {
      id: `commit-${candidate.id}-${Date.now()}`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateAge: candidate.age,
      candidateTitle: candidate.title,
      candidateImage: candidate.imageUrl,
      venue: candidate.meetingVenue || 'Café Gitane',
      time: candidate.meetingTime || '4:00 PM',
      userCode: String(Math.floor(1000 + Math.random() * 9000)),
      partnerCode: String(Math.floor(1000 + Math.random() * 9000)),
      vowsStaked: cost,
      status: 'escrowed',
      createdAt: 'Just now'
    };

    setCommitments((prev) => [newCommitment, ...prev]);
    setSelectedCommitment(newCommitment);
    setStakedCandidate(candidate);
    setIsVowStakedModalOpen(true);

    // Also ensure conversation exists
    setConversations((prev) => {
      const exists = prev.find((c) => c.candidateId === candidate.id);
      if (exists) {
        return prev.map((c) =>
          c.candidateId === candidate.id
            ? { ...c, hasActiveEscrow: true, meetingVenue: newCommitment.venue, meetingTime: newCommitment.time }
            : c
        );
      }
      return [
        {
          id: `conv-${candidate.id}`,
          candidateId: candidate.id,
          candidateName: candidate.name,
          candidateImage: candidate.imageUrl,
          lastMessage: `Vow Staked! Meeting at ${newCommitment.venue}`,
          lastMessageTime: 'Just now',
          unreadCount: 0,
          hasActiveEscrow: true,
          meetingVenue: newCommitment.venue,
          meetingTime: newCommitment.time,
          messages: [
            {
              id: `m-${Date.now()}`,
              sender: 'system',
              text: `Mutual Vow Protocol initiated. Staked ${cost} Vows for ${newCommitment.venue} at ${newCommitment.time}.`,
              timestamp: 'Just now',
              isDateProposal: true,
              proposalDetails: {
                venue: newCommitment.venue,
                time: newCommitment.time,
                stakedVows: cost
              }
            }
          ]
        },
        ...prev
      ];
    });
  };

  // Date code verification ceremony completion
  const handleVerifyDate = () => {
    setIsVerified(true);
    setVowBalance((prev) => prev + selectedCommitment.vowsStaked * 2); // Escrow returned
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === selectedCommitment.id
          ? { ...c, status: 'fulfilled', fulfilledAt: 'Just now' }
          : c
      )
    );
  };

  // Sending a chat message
  const handleSendMessage = (conversationId: string, text: string) => {
    const newMessage = {
      id: `m-${Date.now()}`,
      sender: 'user' as const,
      text,
      timestamp: 'Just now'
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          lastMessage: text,
          lastMessageTime: 'Just now',
          messages: [...conv.messages, newMessage]
        };
      })
    );

    // Auto-respond for realistic interaction
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== conversationId) return conv;
          const reply = {
            id: `reply-${Date.now()}`,
            sender: 'partner' as const,
            text: "Excited to meet! I'm here and my verification code is ready.",
            timestamp: 'Just now'
          };
          return {
            ...conv,
            lastMessage: reply.text,
            lastMessageTime: 'Just now',
            messages: [...conv.messages, reply]
          };
        })
      );
    }, 1500);
  };

  const handleOpenCeremonyForCandidate = (candidateId: string) => {
    const commit = commitments.find((c) => c.candidateId === candidateId);
    if (commit) {
      setSelectedCommitment(commit);
    }
    setActiveTab('ceremony');
  };

  const hasActiveDate = commitments.some((c) => c.status === 'escrowed');
  const activeDateCommit = commitments.find((c) => c.status === 'escrowed') || INITIAL_COMMITMENT;

  return (
    <div className="min-h-screen bg-[#0a0a12] text-[#e8e0f0] flex flex-col font-body selection:bg-primary selection:text-white">
      {/* Top Header */}
      <Header
        mode={activeTab}
        vowBalance={vowBalance}
        onBack={() => setActiveTab('discover')}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenVault={() => setIsVaultModalOpen(true)}
        onToggleDemoCeremony={() => {
          setSelectedCommitment(activeDateCommit);
          setActiveTab(activeTab === 'ceremony' ? 'discover' : 'ceremony');
        }}
      />

      {/* Main Content View based on activeTab */}
      <main className="flex-1 flex flex-col w-full">
        {activeTab === 'discover' && (
          <DiscoverScreen
            candidates={candidates}
            onMakeVow={handleMakeVow}
            onSelectCandidateForCeremony={(candidate) => {
              // Set up commitment or view dossier
              const commit = commitments.find((c) => c.candidateId === candidate.id) || {
                ...INITIAL_COMMITMENT,
                candidateId: candidate.id,
                candidateName: candidate.name,
                candidateAge: candidate.age,
                candidateTitle: candidate.title,
                candidateImage: candidate.imageUrl,
                venue: candidate.meetingVenue || 'Café Gitane'
              };
              setSelectedCommitment(commit);
              setActiveTab('ceremony');
            }}
            onOpenCeremonyDirectly={() => {
              setSelectedCommitment(activeDateCommit);
              setActiveTab('ceremony');
            }}
            hasActiveDate={hasActiveDate}
            activeDatePartnerName={activeDateCommit.candidateName}
            onOpenFilterModal={() => setIsFilterModalOpen(true)}
          />
        )}

        {activeTab === 'ceremony' && (
          <CeremonyScreen
            commitment={selectedCommitment}
            onVerify={handleVerifyDate}
            isVerified={isVerified}
            onOpenChat={(candidateId) => {
              setActiveTab('chats');
            }}
            onOpenIcebreakers={() => setIsIcebreakerModalOpen(true)}
          />
        )}

        {activeTab === 'vows' && (
          <VowsScreen
            commitments={commitments}
            vowBalance={vowBalance}
            onOpenCeremony={(commit) => {
              setSelectedCommitment(commit);
              setActiveTab('ceremony');
            }}
            onDiscoverMore={() => setActiveTab('discover')}
          />
        )}

        {activeTab === 'chats' && (
          <ChatsScreen
            conversations={conversations}
            selectedCandidateId={selectedCommitment?.candidateId}
            onOpenCeremonyForCandidate={handleOpenCeremonyForCandidate}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            vowBalance={vowBalance}
            onAddVows={(amt) => setVowBalance((prev) => prev + amt)}
            onOpenCeremony={() => {
              setSelectedCommitment(activeDateCommit);
              setActiveTab('ceremony');
            }}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={1}
        activeVowCount={commitments.filter((c) => c.status === 'escrowed').length}
      />

      {/* Modals */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={() => {
          // Filters applied
        }}
      />

      <IcebreakerModal
        isOpen={isIcebreakerModalOpen}
        partnerName={selectedCommitment.candidateName}
        onClose={() => setIsIcebreakerModalOpen(false)}
      />

      <VowStakedModal
        candidate={stakedCandidate}
        isOpen={isVowStakedModalOpen}
        onClose={() => setIsVowStakedModalOpen(false)}
        onOpenCeremony={() => {
          setIsVowStakedModalOpen(false);
          setActiveTab('chats');
        }}
      />

      <VaultModal
        isOpen={isVaultModalOpen}
        vowBalance={vowBalance}
        onClose={() => setIsVaultModalOpen(false)}
        onAddVows={(amt) => setVowBalance((prev) => prev + amt)}
      />
    </div>
  );
}
