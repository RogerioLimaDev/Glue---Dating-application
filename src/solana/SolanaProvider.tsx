import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, type ReactNode } from 'react';

import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaProviderProps {
  children: ReactNode;
  network?: 'devnet' | 'mainnet-beta' | 'testnet' | 'localnet';
}

export function SolanaProvider({ children, network = 'devnet' }: SolanaProviderProps) {
  const endpoint = useMemo(() => {
    if (network === 'localnet') return 'http://127.0.0.1:8899';
    if (network === 'mainnet-beta') {
      // Replace with a private RPC (Helius/QuickNode) for production
      return clusterApiUrl(network);
    }
    return clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
