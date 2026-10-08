import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import type { VowProtocol } from '../types/vow_protocol';
import idl from '../idl/vow_protocol.json';

const PROGRAM_ID = (idl as { metadata?: { address?: string } }).metadata?.address ?? '';

export function useVowProgram() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(() => {
    if (!wallet) return null;

    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );

    return new Program<VowProtocol>(idl as never, provider);
  }, [connection, wallet]);

  return { program, connection, wallet, programId: PROGRAM_ID };
}
