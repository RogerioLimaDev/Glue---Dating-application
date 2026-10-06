# Glue - Intentional Dating with Anti-Ghosting Protocol

**A dating application where commitment matters.**

Glue is a dating app built for the Solana ecosystem that replaces endless matching with intentional commitments. Instead of accumulating matches, users stake **Vows** to schedule real-world dates, verify them in person with a **Date Code**, and settle the commitment through the **Vow Protocol**.

> We don't match people. We match commitments.

---

## What is a Vow?

A **Vow** is a digital unit of commitment. It is not a payment, ticket, or simple token.

> A Vow isn't a payment. It's the value of commitment made tangible.

When two users agree to meet, both stake the same number of Vows. Those Vows are locked until the date is verified. After that, the protocol settles the commitment according to transparent rules.

## Protocol Flow

```
DISCOVER → MAKE A VOW → LOCK VOWS → CHAT/SCHEDULE → MEET
                                                   ↓
                                    VERIFY WITH DATE CODE
                                                   ↓
                                          SETTLE
```

Reference lifecycle:

```
AVAILABLE → COMMITTED → LOCKED → DATE_SCHEDULED → VERIFIED → SETTLED
```

## MVP Scope

This repository contains the frontend prototype for the hackathon MVP. The goal is to demonstrate the core flow end-to-end:

1. **Discover** - browse candidate profiles.
2. **Make a Vow** - commit Vows to a date.
3. **Lock Vows** - both sides lock their stake.
4. **Chat + Schedule** - confirm date details.
5. **Date Verification** - exchange Date Codes in person.
6. **Settlement** - Vows are returned or redistributed.
7. **Protocol Details** - show on-chain states and transactions.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Blockchain:** Solana
- **Smart Contract:** Rust + Anchor (planned)
- **Wallet:** Embedded wallets under evaluation (e.g. Privy)
- **Stablecoin:** USDC on Solana (future financial layer only)
- **Backend:** Node.js / TypeScript + PostgreSQL if needed
- **Solana Infra:** Helius or similar RPC/indexing provider

## Project Structure

```
glue---dating-application/
├── docs/                  # Project documentation
│   ├── 01-problem.md
│   ├── 02-concept.md
│   ├── 03-vow-protocol.md
│   ├── 04-protocol-flow.md
│   ├── 05-cancellation-and-grace.md
│   ├── 06-date-verification.md
│   ├── 07-solana-architecture.md
│   ├── 08-financial-model.md
│   └── decisions.md
├── reports/               # Reports and learnings
├── public/                # Static assets and images
├── src/                   # React application source
│   ├── components/        # UI components
│   ├── data/              # Mock data and constants
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Getting Started

```bash
cd /Users/rogeriolima/Desktop/glue---dating-application
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Important Notes

- This is a **hackathon MVP**. It demonstrates the concept, not a production-grade application.
- No real money is moved in the current version.
- Vows in the MVP are simulated/test balances.
- Personal data, messages, and private date details stay off-chain.
- Any financial layer involving stablecoins, custody, or yield requires further legal and regulatory review before implementation.

## Documentation

See the `docs/` folder for detailed context on the problem, concept, protocol, verification, cancellation, architecture, and financial model.

## Status

- [x] Frontend prototype running
- [x] User profile and candidate discovery
- [x] Vow staking and commitment flow (simulated)
- [x] Date Code verification screen
- [ ] Solana program integration
- [ ] Wallet connection
- [ ] On-chain state transitions
- [ ] Protocol tests

## License

**© 2026 Glue. All rights reserved.**

This repository is publicly available for hackathon evaluation and documentation purposes. No license is granted to copy, modify, distribute, or use this code for commercial purposes without explicit permission.

---

*Project developed for the Hackathon Crypto Worlds Fair.*

<img src="assets/GlueLogo.png" alt="Glue" width="300">
