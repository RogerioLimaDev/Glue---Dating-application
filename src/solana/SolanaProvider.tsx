import { ConnectionProvider, WalletProvider, useConnection } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useMemo, type ReactNode } from 'react';

import '@solana/wallet-adapter-react-ui/styles.css';
import { AutoConnectBurner } from './AutoConnectBurner';

interface SolanaProviderProps {
  children: ReactNode;
  network?: 'devnet' | 'mainnet-beta' | 'testnet' | 'localnet';
}

/** Auto-airdrops SOL to the connected wallet so demo flows never hit fee poverty. */
function LocalnetAirdropper() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  useEffect(() => {
    if (!publicKey) return;
    (async () => {
      try {
        const bal = await connection.getBalance(publicKey, 'confirmed');
        if (bal < LAMPORTS_PER_SOL / 2) {
          const sig = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
          await connection.confirmTransaction(sig, 'confirmed');
        }
      } catch (e) {
        console.warn('airdrop failed (ok if wallet already funded):', e);
      }
    })();
  }, [publicKey, connection]);
  return null;
}

export function SolanaProvider({ children, network = 'localnet' }: SolanaProviderProps) {
  const endpoint = useMemo(() => {
    if (network === 'localnet') return 'http://127.0.0.1:8899';
    if (network === 'mainnet-beta') {
      // Replace with a private RPC (Helius/QuickNode) for production
      return clusterApiUrl(network);
    }
    return clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(() => {
    const base: (PhantomWalletAdapter | SolflareWalletAdapter | UnsafeBurnerWalletAdapter)[] = [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ];
    if (network === 'localnet') {
      // Frictionless demo wallet: random keypair per session, auto-connected.
      base.push(new UnsafeBurnerWalletAdapter());
    }
    return base;
  }, [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AutoConnectBurner />
          <LocalnetAirdropper />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}