/**
 * Compatibility re-exports — the real implementation lives in useVowProgram.ts
 * (program/vault hooks) and demoWallet.ts (wallet identities + PDAs helpers).
 */
export {
  deriveCommitmentPda,
  deriveVaultPda,
  sha256Bytes,
  useVowProgramDemo,
  useVault,
  makePartnerProgram,
  ensurePartnerVault,
  VOW_PROGRAM_ID,
  RPC_ENDPOINT,
} from './useVowProgram';
export type { VaultState } from './useVowProgram';
export { DEMO_PARTNER_PUBKEY, demoPartnerKeypair } from './demoWallet';

export interface CommitmentView {
  state: 'proposed' | 'locked' | 'verified' | 'settled' | 'cancelled';
  vows: number;
}