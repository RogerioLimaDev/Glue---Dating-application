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

import {
  useVault,
  DEMO_PARTNER_PUBKEY,
  deriveCommitmentPda,
  deriveVaultPda,
  sha256Bytes,
  makePartnerProgram,
} from './solana/useVault';
import { BN } from 'bn.js';
import { PublicKey, SystemProgram } from '@solana/web3.js';

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

  // ---- On-chain (vow_protocol) integration ----
  const { program, publicKey, vault, refresh: refreshVault, initVault, ensureReady } = useVault();
  const [txPending, setTxPending] = useState(false);

  // Keep the displayed Vow balance driven by on-chain state when available
  React.useEffect(() => {
    if (vault?.exists) setVowBalance(vault.balance);
  }, [vault?.exists, vault?.balance]);

  const handleInitializeVault = async () => {
    try {
      await initVault();
    } catch (e) {
      console.error('initializeUserVault failed:', e);
      alert('Falha ao inicializar vault on-chain. Veja o console.');
    }
  };

  // Staking a vow on a candidate in Discover — creates an on-chain commitment
  const handleMakeVow = async (candidate: Candidate) => {
    console.log('[MakeVow] click', { pub: publicKey.toBase58().slice(0, 6), vault: vault?.exists });
    const cost = candidate.vowRequirement || 2;

    // demo mode: fund fees + auto-initialize vault if missing (returns faucet amount)
    let balanceNow = vault?.balance ?? 0;
    try {
      if (!vault?.exists) {
        balanceNow = await ensureReady();
      }
    } catch (e) {
      console.error('vault init failed:', e);
      alert('Falha ao iniciar vault on-chain. Veja o console.');
      return;
    }

    if (balanceNow < cost) {
      alert('Insufficient Vows in balance! Top up in the Vow Vault.');
      setIsVaultModalOpen(true);
      return;
    }

    setTxPending(true);
    try {
      const venue = candidate.meetingVenue || 'Café Gitane';
      const time = candidate.meetingTime || 'Tomorrow 4:00 PM';
      // Demo Date Codes: the UI generates both; in the real flow the partner keeps theirs secret
      const userCode = String(Math.floor(1000 + Math.random() * 9000)).padStart(6, '0').slice(0, 6);
      const partnerCode = String(Math.floor(1000 + Math.random() * 9000)).padStart(6, '0').slice(0, 6);

      const now = Math.floor(Date.now() / 1000);
      const userCodeHash = sha256Bytes(userCode);
      const [cmtPda] = deriveCommitmentPda(publicKey, DEMO_PARTNER_PUBKEY, userCodeHash);

      await program.methods
        .createCommitment(
          new BN(cost),
          sha256Bytes(venue),
          sha256Bytes(time),
          sha256Bytes(userCode),
          sha256Bytes(partnerCode),
          new BN(now + 86400),
          new BN(0)
        )
        .accounts({
          commitment: cmtPda,
          proposer: publicKey,
          partner: DEMO_PARTNER_PUBKEY,
          proposerVault: deriveVaultPda(publicKey)[0],
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      await refreshVault();

      const newCommitment: Commitment = {
        id: `commit-${candidate.id}-${Date.now()}`,
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateAge: candidate.age,
        candidateTitle: candidate.title,
        candidateImage: candidate.imageUrl,
        venue,
        time,
        userCode,
        partnerCode,
        vowsStaked: cost,
        status: 'escrowed',
        createdAt: 'Just now',
        onChain: cmtPda.toBase58(),
        proposerKey: publicKey.toBase58(),
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
    } catch (e) {
      console.error('createCommitment failed:', e);
      alert('Falha ao criar commitment on-chain. Veja o console.');
    } finally {
      setTxPending(false);
    }
  };

  // Date code verification ceremony completion — verify + settle on-chain
  const handleVerifyDate = async () => {
    const commitment = commitments.find((c) => c.id === selectedCommitment.id);
    console.log('[Verify] called', {
      prog: !!program,
      pk: !!publicKey,
      selId: selectedCommitment.id,
      foundOnChain: !!commitment?.onChain,
      cid: commitment?.candidateId,
    });
    if (
      !program ||
      !publicKey ||
      !commitment?.onChain ||
      commitment.candidateId === 'demo'
    ) {
      // demo-only path (no on-chain commitment attached)
      setIsVerified(true);
      setVowBalance((prev) => prev + selectedCommitment.vowsStaked * 2);
      setCommitments((prev) =>
        prev.map((c) =>
          c.id === selectedCommitment.id
            ? { ...c, status: 'fulfilled', fulfilledAt: 'Just now' }
            : c
        )
      );
      return;
    }

    setTxPending(true);
    try {
      console.log('[Verify] ON-CHAIN path: cmtPda=', commitment.onChain);
      const cmtPda = new PublicKey(commitment.onChain);

      // 1. acceptCommitment — signed by the demo partner (state Proposed -> Locked).
      //    Required: verify_date demands Locked state (lib.rs:110).
      const { program: partnerProg } = makePartnerProgram();
      const [partnerVaultPda] = deriveVaultPda(DEMO_PARTNER_PUBKEY);
      await partnerProg.methods
        .acceptCommitment()
        .accounts({
          commitment: cmtPda,
          partner: DEMO_PARTNER_PUBKEY,
          partnerVault: partnerVaultPda,
        })
        .rpc();
      console.log('[Verify] accepted by partner');

      // 2. verifyDate — caller = proposer, codes checked against stored hashes
      const sigV = await program.methods
        .verifyDate(commitment.userCode, commitment.partnerCode)
        .accounts({ commitment: cmtPda, caller: publicKey })
        .rpc();
      console.log('[Verify] verifyDate sig:', sigV.slice(0, 12));

      // 3. settle — returns vows to both vaults
      const proposerKey = commitment.proposerKey ? new PublicKey(commitment.proposerKey) : publicKey;
      const [proposerVault] = deriveVaultPda(proposerKey);
      await program.methods
        .settleCommitment()
        .accounts({
          commitment: cmtPda,
          caller: publicKey,
          proposerVault,
          partnerVault: partnerVaultPda,
        })
        .rpc();
      console.log('[Verify] settled');

      await refreshVault();
      const acc = await program.account.commitment.fetchNullable(cmtPda, 'confirmed');
      console.log('on-chain state settled:', acc && Object.keys(acc.state)[0]);
    } catch (e) {
      console.error('verify/settle failed:', e);
      alert('Falha ao verificar/settar on-chain. Veja o console.');
    } finally {
      setTxPending(false);
    }

    setIsVerified(true);
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
            onAddVows={(amt) => {
              // On-chain mode: route "top up" to initializeUserVault (faucet of 100 demo Vows)
              void amt;
              void handleInitializeVault();
            }}
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
