export interface Candidate {
  id: string;
  name: string;
  age: number;
  title: string;
  location: string;
  distance: string;
  activeNow: boolean;
  commitmentRate: number; // e.g. 98%
  fulfilledCount: number; // e.g. 14
  protocolVerified: boolean;
  bio: string;
  vowRequirement: number; // e.g. 2
  vowVibeNote: string;
  tags: string[];
  imageUrl: string;
  previewBio?: string;
  meetingVenue?: string;
  meetingTime?: string;
}

export interface Commitment {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAge: number;
  candidateTitle: string;
  candidateImage: string;
  venue: string;
  time: string;
  userCode: string;
  partnerCode: string;
  vowsStaked: number;
  status: 'escrowed' | 'fulfilled' | 'cancelled';
  createdAt: string;
  fulfilledAt?: string;
  /** base58 PDA of the on-chain commitment (present when staked via wallet) */
  onChain?: string;
  /** base58 proposer pubkey stored at staking time (for vault derivations) */
  proposerKey?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'partner' | 'system';
  text: string;
  timestamp: string;
  isDateProposal?: boolean;
  proposalDetails?: {
    venue: string;
    time: string;
    stakedVows: number;
  };
}

export interface Conversation {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  hasActiveEscrow: boolean;
  meetingVenue?: string;
  meetingTime?: string;
  messages: ChatMessage[];
}
