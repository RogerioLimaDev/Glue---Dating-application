import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VowProtocol } from "../target/types/vow_protocol";
import { expect } from "chai";

const crypto = require("crypto");

function sha256(input: string): Buffer {
  return crypto.createHash("sha256").update(input).digest();
}

function codeHash(input: string): number[] {
  return Array.from(sha256(input));
}

describe("vow_protocol", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.VowProtocol as Program<VowProtocol>;
  const provider = anchor.getProvider() as anchor.AnchorProvider;

  const proposer = anchor.web3.Keypair.generate();
  const partner = anchor.web3.Keypair.generate();

  let proposerVault: anchor.web3.PublicKey;
  let partnerVault: anchor.web3.PublicKey;
  let commitment: anchor.web3.PublicKey;
  let commitmentBump: number;

  const vows = new anchor.BN(5);
  const venue = "Café Gitane";
  const time = "Tomorrow 11:30 AM";
  const proposerCode = "482731";
  const partnerCode = "631942";
  const venueHash = codeHash(venue);
  const timeHash = codeHash(time);
  const proposerCodeHash = codeHash(proposerCode);
  const partnerCodeHash = codeHash(partnerCode);

  before(async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(proposer.publicKey, 1e9),
      "confirmed"
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(partner.publicKey, 1e9),
      "confirmed"
    );
  });

  it("Initialize user vaults", async () => {
    [proposerVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_vault"), proposer.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .initializeUserVault()
      .accounts({
        userVault: proposerVault,
        owner: proposer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([proposer])
      .rpc();

    const vault = await program.account.userVault.fetch(proposerVault);
    expect(vault.balance.toNumber()).to.equal(100);
    expect(vault.locked.toNumber()).to.equal(0);

    [partnerVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_vault"), partner.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .initializeUserVault()
      .accounts({
        userVault: partnerVault,
        owner: partner.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([partner])
      .rpc();

    const partnerVaultAccount = await program.account.userVault.fetch(partnerVault);
    expect(partnerVaultAccount.balance.toNumber()).to.equal(100);
  });

  it("Create commitment", async () => {
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = new anchor.BN(now + 86400);

    [commitment, commitmentBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("commitment"),
        proposer.publicKey.toBuffer(),
        partner.publicKey.toBuffer(),
        Buffer.from(proposerCodeHash),
      ],
      program.programId
    );

    await program.methods
      .createCommitment(
        vows,
        venueHash,
        timeHash,
        proposerCodeHash,
        partnerCodeHash,
        expiresAt
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

    const account = await program.account.commitment.fetch(commitment);
    expect(account.state).to.deep.equal({ proposed: {} });
    expect(account.vows.toNumber()).to.equal(5);

    const vault = await program.account.userVault.fetch(proposerVault);
    expect(vault.balance.toNumber()).to.equal(95);
    expect(vault.locked.toNumber()).to.equal(5);
  });

  it("Accept commitment", async () => {
    await program.methods
      .acceptCommitment()
      .accounts({
        commitment,
        partner: partner.publicKey,
        partnerVault,
      })
      .signers([partner])
      .rpc();

    const account = await program.account.commitment.fetch(commitment);
    expect(account.state).to.deep.equal({ locked: {} });

    const vault = await program.account.userVault.fetch(partnerVault);
    expect(vault.balance.toNumber()).to.equal(95);
    expect(vault.locked.toNumber()).to.equal(5);
  });

  it("Verify date with Date Codes", async () => {
    await program.methods
      .verifyDate(proposerCode, partnerCode)
      .accounts({
        commitment,
        caller: proposer.publicKey,
      })
      .signers([proposer])
      .rpc();

    const account = await program.account.commitment.fetch(commitment);
    expect(account.state).to.deep.equal({ verified: {} });
  });

  it("Settle commitment and return Vows", async () => {
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

    const account = await program.account.commitment.fetch(commitment);
    expect(account.state).to.deep.equal({ settled: {} });

    const proposerAccount = await program.account.userVault.fetch(proposerVault);
    expect(proposerAccount.balance.toNumber()).to.equal(100);
    expect(proposerAccount.locked.toNumber()).to.equal(0);

    const partnerAccount = await program.account.userVault.fetch(partnerVault);
    expect(partnerAccount.balance.toNumber()).to.equal(100);
    expect(partnerAccount.locked.toNumber()).to.equal(0);
  });
});
