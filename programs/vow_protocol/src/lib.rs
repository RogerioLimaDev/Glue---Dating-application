use anchor_lang::prelude::*;

declare_id!("Vow111111111111111111111111111111111111111");

#[program]
pub mod vow_protocol {
    use super::*;

    pub fn initialize_user_vault(ctx: Context<InitializeUserVault>) -> Result<()> {
        let vault = &mut ctx.accounts.user_vault;
        vault.owner = ctx.accounts.owner.key();
        vault.balance = 100; // faucet inicial para demo
        vault.locked = 0;
        vault.bump = ctx.bumps.user_vault;
        Ok(())
    }

    pub fn create_commitment(
        ctx: Context<CreateCommitment>,
        vows: u64,
        venue_hash: [u8; 32],
        time_hash: [u8; 32],
        proposer_code_hash: [u8; 32],
        partner_code_hash: [u8; 32],
        expires_at: i64,
    ) -> Result<()> {
        require!(vows > 0, VowError::ZeroVows);

        let vault = &mut ctx.accounts.proposer_vault;
        require!(vault.balance >= vows, VowError::InsufficientBalance);

        vault.balance -= vows;
        vault.locked += vows;

        let commitment = &mut ctx.accounts.commitment;
        commitment.bump = ctx.bumps.commitment;
        commitment.proposer = ctx.accounts.proposer.key();
        commitment.partner = ctx.accounts.partner.key();
        commitment.vows = vows;
        commitment.venue_hash = venue_hash;
        commitment.time_hash = time_hash;
        commitment.proposer_code_hash = proposer_code_hash;
        commitment.partner_code_hash = partner_code_hash;
        commitment.state = CommitmentState::Proposed;
        commitment.created_at = Clock::get()?.unix_timestamp;
        commitment.expires_at = expires_at;

        Ok(())
    }

    pub fn accept_commitment(ctx: Context<AcceptCommitment>) -> Result<()> {
        let commitment = &mut ctx.accounts.commitment;
        require!(
            commitment.state == CommitmentState::Proposed,
            VowError::InvalidState
        );
        require!(
            Clock::get()?.unix_timestamp <= commitment.expires_at,
            VowError::Expired
        );

        let vault = &mut ctx.accounts.partner_vault;
        require!(vault.balance >= commitment.vows, VowError::InsufficientBalance);

        vault.balance -= commitment.vows;
        vault.locked += commitment.vows;
        commitment.state = CommitmentState::Locked;

        Ok(())
    }

    pub fn cancel_commitment(ctx: Context<CancelCommitment>) -> Result<()> {
        let commitment = &mut ctx.accounts.commitment;
        require!(
            commitment.state == CommitmentState::Proposed
                || commitment.state == CommitmentState::Locked,
            VowError::InvalidState
        );

        ctx.accounts.proposer_vault.locked -= commitment.vows;
        ctx.accounts.proposer_vault.balance += commitment.vows;

        if commitment.state == CommitmentState::Locked {
            ctx.accounts.partner_vault.locked -= commitment.vows;
            ctx.accounts.partner_vault.balance += commitment.vows;
        }

        commitment.state = CommitmentState::Cancelled;
        Ok(())
    }

    pub fn verify_date(
        ctx: Context<VerifyDate>,
        proposer_code: String,
        partner_code: String,
    ) -> Result<()> {
        let commitment = &mut ctx.accounts.commitment;
        require!(
            commitment.state == CommitmentState::Locked,
            VowError::InvalidState
        );
        require!(
            Clock::get()?.unix_timestamp <= commitment.expires_at,
            VowError::Expired
        );

        let proposer_hash = hash_code(&proposer_code);
        let partner_hash = hash_code(&partner_code);

        require!(
            proposer_hash == commitment.proposer_code_hash,
            VowError::InvalidDateCode
        );
        require!(
            partner_hash == commitment.partner_code_hash,
            VowError::InvalidDateCode
        );

        commitment.state = CommitmentState::Verified;
        Ok(())
    }

    pub fn settle_commitment(ctx: Context<SettleCommitment>) -> Result<()> {
        let commitment = &mut ctx.accounts.commitment;
        let now = Clock::get()?.unix_timestamp;

        match commitment.state {
            CommitmentState::Verified => {
                ctx.accounts.proposer_vault.locked -= commitment.vows;
                ctx.accounts.proposer_vault.balance += commitment.vows;
                ctx.accounts.partner_vault.locked -= commitment.vows;
                ctx.accounts.partner_vault.balance += commitment.vows;
                commitment.state = CommitmentState::Settled;
            }
            CommitmentState::Locked if now > commitment.expires_at => {
                let caller = ctx.accounts.caller.key();
                if caller == commitment.proposer {
                    ctx.accounts.proposer_vault.locked -= commitment.vows;
                    ctx.accounts.proposer_vault.balance += commitment.vows * 2;
                    ctx.accounts.partner_vault.locked -= commitment.vows;
                } else if caller == commitment.partner {
                    ctx.accounts.partner_vault.locked -= commitment.vows;
                    ctx.accounts.partner_vault.balance += commitment.vows * 2;
                    ctx.accounts.proposer_vault.locked -= commitment.vows;
                } else {
                    return Err(VowError::Unauthorized.into());
                }
                commitment.state = CommitmentState::Settled;
            }
            _ => return Err(VowError::InvalidState.into()),
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUserVault<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + UserVault::SIZE,
        seeds = [b"user_vault", owner.key().as_ref()],
        bump
    )]
    pub user_vault: Account<'info, UserVault>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateCommitment<'info> {
    #[account(
        init,
        payer = proposer,
        space = 8 + Commitment::SIZE,
        seeds = [
            b"commitment",
            proposer.key().as_ref(),
            partner.key().as_ref(),
            proposer_code_hash.as_ref(),
        ],
        bump
    )]
    pub commitment: Account<'info, Commitment>,
    #[account(mut)]
    pub proposer: Signer<'info>,
    /// CHECK: partner account is only stored as pubkey reference
    pub partner: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [b"user_vault", proposer.key().as_ref()],
        bump = proposer_vault.bump
    )]
    pub proposer_vault: Account<'info, UserVault>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AcceptCommitment<'info> {
    #[account(
        mut,
        constraint = commitment.partner == partner.key(),
    )]
    pub commitment: Account<'info, Commitment>,
    #[account(mut)]
    pub partner: Signer<'info>,
    #[account(
        mut,
        seeds = [b"user_vault", partner.key().as_ref()],
        bump = partner_vault.bump
    )]
    pub partner_vault: Account<'info, UserVault>,
}

#[derive(Accounts)]
pub struct CancelCommitment<'info> {
    #[account(
        mut,
        constraint = commitment.proposer == proposer.key() || commitment.partner == proposer.key(),
    )]
    pub commitment: Account<'info, Commitment>,
    /// CHECK: proposer or partner account
    pub proposer: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [b"user_vault", commitment.proposer.as_ref()],
        bump = proposer_vault.bump
    )]
    pub proposer_vault: Account<'info, UserVault>,
    #[account(
        mut,
        seeds = [b"user_vault", commitment.partner.as_ref()],
        bump = partner_vault.bump
    )]
    pub partner_vault: Account<'info, UserVault>,
}

#[derive(Accounts)]
pub struct VerifyDate<'info> {
    #[account(
        mut,
        constraint = commitment.proposer == caller.key() || commitment.partner == caller.key(),
    )]
    pub commitment: Account<'info, Commitment>,
    pub caller: Signer<'info>,
}

#[derive(Accounts)]
pub struct SettleCommitment<'info> {
    #[account(
        mut,
        constraint = commitment.proposer == caller.key() || commitment.partner == caller.key(),
    )]
    pub commitment: Account<'info, Commitment>,
    #[account(mut)]
    pub caller: Signer<'info>,
    #[account(
        mut,
        seeds = [b"user_vault", commitment.proposer.as_ref()],
        bump = proposer_vault.bump
    )]
    pub proposer_vault: Account<'info, UserVault>,
    #[account(
        mut,
        seeds = [b"user_vault", commitment.partner.as_ref()],
        bump = partner_vault.bump
    )]
    pub partner_vault: Account<'info, UserVault>,
}

#[account]
pub struct UserVault {
    pub bump: u8,
    pub owner: Pubkey,
    pub balance: u64,
    pub locked: u64,
}

impl UserVault {
    pub const SIZE: usize = 1 + 32 + 8 + 8;
}

#[account]
pub struct Commitment {
    pub bump: u8,
    pub proposer: Pubkey,
    pub partner: Pubkey,
    pub vows: u64,
    pub venue_hash: [u8; 32],
    pub time_hash: [u8; 32],
    pub proposer_code_hash: [u8; 32],
    pub partner_code_hash: [u8; 32],
    pub state: CommitmentState,
    pub created_at: i64,
    pub expires_at: i64,
}

impl Commitment {
    pub const SIZE: usize = 1 + 32 + 32 + 8 + 32 + 32 + 32 + 32 + 1 + 8 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum CommitmentState {
    Proposed,
    Locked,
    Verified,
    Settled,
    Cancelled,
}

#[error_code]
pub enum VowError {
    #[msg("Insufficient vow balance")]
    InsufficientBalance,
    #[msg("Zero vows not allowed")]
    ZeroVows,
    #[msg("Invalid commitment state")]
    InvalidState,
    #[msg("Commitment expired")]
    Expired,
    #[msg("Invalid date code")]
    InvalidDateCode,
    #[msg("Unauthorized")]
    Unauthorized,
}

fn hash_code(code: &str) -> [u8; 32] {
    let digest = anchor_lang::solana_program::hash::hash(code.as_bytes());
    digest.to_bytes()
}
