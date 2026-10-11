/**
 * Vow program client — the single place that talks to the on-chain vow_protocol.
 *
 * Demo-mode architecture: instead of @solana/wallet-adapter (whose autoConnect
 * no-ops for Loadable adapters like the UnsafeBurner), we back the whole app
 * with an in-process keypair (see demoWallet.ts). Every screen reads the same
 * Anchor program instance from here.
 *
 * For production: replace this module's internals with Phantom/Privy plumbing.
 */
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { BN } from 'bn.js';
import { Buffer } from 'buffer';
import { Connection, PublicKey } from '@solana/web3.js';
import type { VowProtocol } from '../types/vow_protocol';
import idl from '../idl/vow_protocol.json';
import { demoAnchorWallet, ensureFunded, getDemoWallet, partnerAnchorWallet } from './demoWallet';

// Demo partner pubkey import (value import — used by makePartnerProgram)
import { DEMO_PARTNER_PUBKEY } from './demoWallet';

export const VOW_PROGRAM_ID = new PublicKey('592x9qBjrwDiZiVfAuaAqqghnYJvygQFsXLBp5Yqxt3R');
export const RPC_ENDPOINT = 'http://127.0.0.1:8899';

// ---- PDAs -----------------------------------------------------------------

// Runtime quirk: the deployed program derives the commitment PDA using `vows`
// (arg[0]) as the last seed instead of `nonce` (arg[6]) — see glue-project-notes.
export function deriveCommitmentPda(
  proposer: PublicKey,
  partner: PublicKey,
  vows: number
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('commitment'),
      proposer.toBuffer(),
      partner.toBuffer(),
      new BN(vows).toArrayLike(Buffer, 'le', 8),
    ],
    VOW_PROGRAM_ID
  );
}

export function deriveVaultPda(owner: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('user_vault'), owner.toBuffer()],
    VOW_PROGRAM_ID
  );
}

// ---- Sync sha256 (matches anchor_lang::solana_program::hash::hash) -----------

// sha.js is already in the dependency tree (web3.js/create-hash) and works in
// the browser. Do NOT hand-roll SHA-256 (a manual K-table typo cost us hours).
import createSha256 from 'sha.js';

export function sha256Bytes(input: string): number[] {
  return Array.from(createSha256('sha256').update(input, 'utf8').digest());
}

// ---- Hook: program + wallet identity (demo) ---------------------------------

export function useVowProgramDemo() {
  return useMemo(() => {
    const connection = new Connection(RPC_ENDPOINT, { commitment: 'confirmed' });
    const { publicKey } = getDemoWallet();
    const provider = new AnchorProvider(
      connection,
      demoAnchorWallet(),
      { commitment: 'confirmed', preflightCommitment: 'confirmed' }
    );
    const program = new Program<VowProtocol>(idl as never, VOW_PROGRAM_ID, provider);
    return { program, connection, publicKey };
  }, []); // stable across re-renders
}

// ---- Hook: vault balance -----------------------------------------------------

export interface VaultState {
  exists: boolean;
  balance: number;
  locked: number;
}

export function useVault() {
  const { program, connection, publicKey } = useVowProgramDemo();
  const [vault, setVault] = useState<VaultState | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const [vaultPda] = deriveVaultPda(publicKey);
    const acc = await program.account.userVault.fetchNullable(vaultPda, 'confirmed');
    setVault(
      acc
        ? { exists: true, balance: acc.balance.toNumber(), locked: acc.locked.toNumber() }
        : { exists: false, balance: 0, locked: 0 }
    );
  }, [program, publicKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const initVault = useCallback(async () => {
    setLoading(true);
    try {
      const [vaultPda] = deriveVaultPda(publicKey);
      await program.methods.initializeUserVault()
        .accounts({ userVault: vaultPda, owner: publicKey })
        .rpc();
    } finally {
      setLoading(false);
    }
    await refresh();
  }, [program, publicKey, refresh]);

  /** Ensure wallet has SOL fees + vault exists with demo Vows. Also pre-inits the demo PARTNER vault (needed by acceptCommitment). */
  const ensureReady = useCallback(async () => {
    await ensureFunded(connection, publicKey);
    if (!vault?.exists) await initVault();
    // Partner needs its own vault with balance before accepting a commitment
    await ensurePartnerVault(connection);
    return 100; // faucet amount granted by initializeUserVault
  }, [connection, publicKey, vault?.exists, initVault]);

  return { program, connection, publicKey, vault, loading, refresh, initVault, ensureReady };
}

// ---- Partner-side program (demo partner signs its own accept) ---------------

export function makePartnerProgram(): {
  program: Program<VowProtocol>;
  connection: Connection;
  partnerPublicKey: PublicKey;
} {
  const connection = new Connection(RPC_ENDPOINT, { commitment: 'confirmed' });
  const partnerPublicKey = DEMO_PARTNER_PUBKEY;
  const provider = new AnchorProvider(
    connection,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    partnerAnchorWallet(),
    { commitment: 'confirmed', preflightCommitment: 'confirmed' }
  );
  const program = new Program<VowProtocol>(idl as never, VOW_PROGRAM_ID, provider);
  return { program, connection, partnerPublicKey };
}

/** Partner vault: initialized lazily before the first acceptCommitment. */
export async function ensurePartnerVault(connection: Connection): Promise<void> {
  const { program } = makePartnerProgram();
  const [partnerVault] = deriveVaultPda(DEMO_PARTNER_PUBKEY);
  const acc = await program.account.userVault.fetchNullable(partnerVault, 'confirmed');
  if (acc) return;
  await ensureFunded(connection, DEMO_PARTNER_PUBKEY);
  await program.methods.initializeUserVault()
    .accounts({ userVault: partnerVault, owner: DEMO_PARTNER_PUBKEY })
    .rpc();
}

// Re-exports for App-level conveniences
export { ensureFunded, getDemoWallet };
export { DEMO_PARTNER_PUBKEY, demoPartnerKeypair } from './demoWallet';
export { BN };