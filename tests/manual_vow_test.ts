import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BN } from "bn.js";
import { VowProtocol } from "../target/types/vow_protocol";
import * as fs from "fs";
import * as crypto from "crypto";

const PROGRAM_ID = new anchor.web3.PublicKey(
  "592x9qBjrwDiZiVfAuaAqqghnYJvygQFsXLBp5Yqxt3R"
);

function sha256(input: string): Buffer {
  return crypto.createHash("sha256").update(input).digest();
}

// Retry helper: evita race de commitment level entre tx confirmada e leitura
async function fetchWithRetry<T>(fetchFn: () => Promise<T | null>, label: string, maxRetries = 5): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    const acc = await fetchFn();
    if (acc) return acc;
    console.log(`  [${label}] conta não visível (tentativa ${i + 1}/${maxRetries}), aguardando...`);
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`[${label}] conta não encontrada após ${maxRetries} tentativas`);
}

async function main() {
  const walletKeypair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(
      JSON.parse(fs.readFileSync(process.env.HOME + "/.config/solana/id.json", "utf8"))
    )
  );
  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(
    new anchor.web3.Connection("http://localhost:8899", { commitment: "confirmed" }),
    wallet,
    { commitment: "confirmed" }
  );
  anchor.setProvider(provider);

  const program = new Program<VowProtocol>(
    JSON.parse(fs.readFileSync("target/idl/vow_protocol.json", "utf8")),
    PROGRAM_ID,
    provider
  );

  const proposer = anchor.web3.Keypair.generate();
  const partner = anchor.web3.Keypair.generate();

  console.log("Proposer:", proposer.publicKey.toBase58());
  console.log("Partner:", partner.publicKey.toBase58());

  // Airdrops
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(proposer.publicKey, 1e9),
    "confirmed"
  );
  await provider.connection.confirmTransaction(
    await provider.connection.requestAirdrop(partner.publicKey, 1e9),
    "confirmed"
  );
  console.log("Airdrops done");

  // PDA vaults
  const [proposerVault] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user_vault"), proposer.publicKey.toBuffer()],
    program.programId
  );
  const [partnerVault] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user_vault"), partner.publicKey.toBuffer()],
    program.programId
  );

  // Initialize vaults
  let tx = await program.methods
    .initializeUserVault()
    .accounts({
      userVault: proposerVault,
      owner: proposer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([proposer])
    .rpc({ commitment: "confirmed" });
  await provider.connection.confirmTransaction(tx, "confirmed");
  console.log("Proposer vault tx:", tx);

  tx = await program.methods
    .initializeUserVault()
    .accounts({
      userVault: partnerVault,
      owner: partner.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([partner])
    .rpc({ commitment: "confirmed" });
  await provider.connection.confirmTransaction(tx, "confirmed");
  console.log("Partner vault tx:", tx);

  // Check initial balances
  let raw = await provider.connection.getAccountInfo(proposerVault);
  console.log("Raw proposer vault length:", raw?.data.length);
  let pv = await fetchWithRetry(
    () => program.account.userVault.fetchNullable(proposerVault),
    "proposer-vault"
  );
  let pav = await fetchWithRetry(
    () => program.account.userVault.fetchNullable(partnerVault),
    "partner-vault"
  );
  console.log("Initial proposer balance:", pv.balance.toNumber());
  console.log("Initial partner balance:", pav.balance.toNumber());

  // Create commitment
  let c: any;
  const vows = new BN(5);
  const venue = "Café Gitane";
  const time = "Tomorrow 11:30 AM";
  const proposerCode = "482731";
  const partnerCode = "631942";
  const nonce = new BN(0);
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = new BN(now + 86400);

  const [commitment] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("commitment"),
      proposer.publicKey.toBuffer(),
      partner.publicKey.toBuffer(),
      vows.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );
  console.log(
    "PDA derivado com vows como seed (workaround: programa usa vows em vez de nonce na seed):",
    commitment.toBase58()
  );

  await program.methods
    .createCommitment(
      vows,
      Array.from(sha256(venue)),
      Array.from(sha256(time)),
      Array.from(sha256(proposerCode)),
      Array.from(sha256(partnerCode)),
      expiresAt,
      nonce
    )
    .accounts({
      commitment,
      proposer: proposer.publicKey,
      partner: partner.publicKey,
      proposerVault,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([proposer])
    .rpc();
  console.log("Commitment created:", commitment.toBase58());

  c = await fetchWithRetry(
    () => program.account.commitment.fetchNullable(commitment),
    "commitment-create"
  );
  console.log("State:", c.state);

  // Accept
  await program.methods
    .acceptCommitment()
    .accounts({
      commitment,
      partner: partner.publicKey,
      partnerVault,
    })
    .signers([partner])
    .rpc();
  c = await fetchWithRetry(
    () => program.account.commitment.fetchNullable(commitment),
    "commitment-accept"
  );
  console.log("After accept state:", c.state);

  // Verify
  await program.methods
    .verifyDate(proposerCode, partnerCode)
    .accounts({
      commitment,
      caller: proposer.publicKey,
    })
    .signers([proposer])
    .rpc();
  c = await fetchWithRetry(
    () => program.account.commitment.fetchNullable(commitment),
    "commitment-verify"
  );
  console.log("After verify state:", c.state);

  // Settle
  await program.methods
    .settleCommitment()
    .accounts({
      commitment,
      caller: proposer.publicKey,
      proposerVault,
      partnerVault,
    })
    .signers([proposer])
    .rpc();
  c = await fetchWithRetry(
    () => program.account.commitment.fetchNullable(commitment),
    "commitment-settle"
  );
  console.log("After settle state:", c.state);

  pv = await fetchWithRetry(
    () => program.account.userVault.fetchNullable(proposerVault),
    "proposer-vault-final"
  );
  pav = await fetchWithRetry(
    () => program.account.userVault.fetchNullable(partnerVault),
    "partner-vault-final"
  );
  console.log("Final proposer balance:", pv.balance.toNumber());
  console.log("Final partner balance:", pav.balance.toNumber());

  console.log("\nTest completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
