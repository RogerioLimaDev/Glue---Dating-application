/**
 * Demo wallet for localnet hackathon demos.
 *
 * WHY: @solana/wallet-adapter's autoConnect only connects adapters with
 * readyState "Installed"; the UnsafeBurner reports "Loadable" and silently
 * no-ops in this modal-less app. We therefore satisfy Anchor's Wallet
 * interface directly with an in-process keypair.
 *
 * NOTE: the anchor browser build does NOT export the `Wallet` class (it is
 * node-only); its runtime contract is the duck-typed interface below
 * (signTransaction / signAllTransactions / publicKey) — see
 * anchor/dist/browser/src/provider.d.ts.
 *
 * For production: swap this for Phantom/Privy signing.
 */
import { Connection, Keypair, PublicKey, VersionedTransaction, Transaction } from '@solana/web3.js';

export interface DemoWallet {
  keypair: Keypair;
  publicKey: PublicKey;
}

let cached: DemoWallet | null = null;

export function getDemoWallet(): DemoWallet {
  if (!cached) {
    const keypair = Keypair.generate();
    cached = { keypair, publicKey: keypair.publicKey };
  }
  return cached;
}

/**
 * Anchor-compatible Wallet backed by the demo keypair.
 * Uses `any` at the boundary: anchor's Wallet generics (Transaction family)
 * collapse to duck typing at runtime — partialSign on legacy, sign([kp]) on
 * versioned.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function demoAnchorWallet(): any {
  const { keypair, publicKey } = getDemoWallet();
  return {
    publicKey,
    async signTransaction(tx: Transaction | VersionedTransaction) {
      const legacy = tx as Transaction;
      if (typeof legacy.partialSign === 'function') {
        legacy.partialSign(keypair);
        return tx;
      }
      await (tx as VersionedTransaction).sign([keypair]);
      return tx;
    },
    async signAllTransactions(txs: (Transaction | VersionedTransaction)[]) {
      return Promise.all(txs.map((tx) => this.signTransaction(tx)));
    },
  };
}

/** One-time funding: airdrop 2 SOL (silently skips if already funded). */
export async function ensureFunded(connection: Connection, pubkey?: PublicKey): Promise<void> {
  const pk = pubkey ?? getDemoWallet().publicKey;
  const bal = await connection.getBalance(pk, 'confirmed');
  if (bal < 1e9 / 2) {
    const sig = await connection.requestAirdrop(pk, 2e9);
    await connection.confirmTransaction(sig, 'confirmed');
  }
}

// ---- Demo partner (deterministic keypair, signs its own accept) -------------

const DEMO_PARTNER_SECRET = new Uint8Array([
  130, 216, 68, 151, 186, 108, 128, 189, 29, 207, 68, 220, 185, 20, 4, 17, 179,
  26, 14, 142, 148, 12, 161, 184, 0, 78, 236, 38, 175, 249, 173, 199, 147, 196,
  181, 233, 134, 181, 186, 111, 71, 77, 33, 97, 245, 125, 134, 253, 98, 11, 28,
  42, 72, 74, 112, 124, 238, 98, 35, 184, 63, 106, 149, 93,
]);
export const demoPartnerKeypair = Keypair.fromSecretKey(DEMO_PARTNER_SECRET);
export const DEMO_PARTNER_PUBKEY = demoPartnerKeypair.publicKey;

/** Anchor-compatible Wallet for the demo partner (signs acceptCommitment). */
export function partnerAnchorWallet(): any {
  return {
    publicKey: DEMO_PARTNER_PUBKEY,
    async signTransaction(tx: Transaction | VersionedTransaction) {
      const legacy = tx as Transaction;
      if (typeof legacy.partialSign === 'function') {
        legacy.partialSign(demoPartnerKeypair);
        return tx;
      }
      await (tx as VersionedTransaction).sign([demoPartnerKeypair]);
      return tx;
    },
    async signAllTransactions(txs: (Transaction | VersionedTransaction)[]) {
      return Promise.all(txs.map((tx) => this.signTransaction(tx)));
    },
  };
}