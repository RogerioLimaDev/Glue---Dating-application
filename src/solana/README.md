# Solana integration

This folder contains the React providers and hooks that connect the Glue frontend to the Solana blockchain.

## Files

- `SolanaProvider.tsx` — wraps the app with Solana wallet adapters (Phantom, Solflare) and the RPC connection. Defaults to `devnet`.
- `useVowProgram.ts` — returns an Anchor `Program` instance for the Vow Protocol. The program ID and IDL are read from `src/idl/vow_protocol.json`.

## IDL

The file `src/idl/vow_protocol.json` is a placeholder. After running `anchor build`, copy the generated file from:

```
target/idl/vow_protocol.json
```

into:

```
src/idl/vow_protocol.json
```

Also copy the generated TypeScript types from:

```
target/types/vow_protocol.ts
```

into:

```
src/types/vow_protocol.ts
```

## Network

The provider defaults to `devnet`. Change `network` in `src/main.tsx` to switch to `mainnet-beta`, `testnet`, or `localnet`. For production, replace the public RPC in `SolanaProvider.tsx` with a private endpoint from Helius or QuickNode.
