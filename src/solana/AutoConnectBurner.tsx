/**
 * Localnet demo helper: selects the Unsafe Burner wallet right after mount.
 * The wallet-adapter autoConnect only fires for wallets with readyState
 * "Installed"; the burner reports "Loadable", so we select it programmatically.
 */
import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function AutoConnectBurner() {
  const { wallets, select, connecting, connected } = useWallet();

  useEffect(() => {
    if (connected || connecting) return;
    const burner = wallets.find((w) => w.adapter.name === 'Burner Wallet');
    if (burner) {
      select(burner.adapter.name);
    }
  }, [wallets, select, connected, connecting]);

  return null;
}