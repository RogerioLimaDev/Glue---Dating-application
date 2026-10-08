# Recuperação de Sessão — 06 Out 2026

Resumo do que foi feito na sessão do Mac e do estado em que o projeto parou antes de continuar no PC.

## O que aconteceu na sessão anterior

- O MacBook Air 7,2 (SSD WD WDS480G2G0C) sofreu vários kernel panics durante compilações de Rust/Anchor.
- Causa raiz: SSD de terceiros com erro crônico `Loss of MMIO space` no driver IONVMe, agravado por operações de disco intensas (instalação de toolchains, `anchor build`, compilação de crates).
- O histórico de kernel panics pode ser visto em `/Library/Logs/DiagnosticReports/Kernel-*.panic`.
- Decisão: parar de compilar localmente no Mac e continuar amanhã em um PC.

## Estado do repositório no GitHub

- Branch `main` atualizada até o commit `30994d9`.
- URL: `https://github.com/RogerioLimaDev/Glue---Dating-application.git`

## Mudanças aplicadas nesta sessão

1. **Downgrade do Anchor**
   - `anchor-lang`: `0.29.0` → `0.28.0`
   - `@coral-xyz/anchor`: `0.29.0` → `0.28.0`
   - Motivo: compatibilidade com a Solana CLI 1.18.26 e Rust 1.75 disponíveis no Mac.

2. **Ajustes no programa Rust**
   - Corrigido acesso a `ctx.bumps` para a API do Anchor 0.28 (`BTreeMap<String, u8>`):
     - `ctx.bumps.user_vault` → `ctx.bumps["user_vault"]`
     - `ctx.bumps.commitment` → `ctx.bumps["commitment"]`
   - Adicionado parâmetro `nonce: u64` à instrução `create_commitment` para permitir PDA determinístico, já que argumentos de função não são acessíveis dentro da macro `#[derive(Accounts)]`.
   - Seeds do `Commitment` agora usam `nonce.to_le_bytes()`.

3. **Ajustes nos testes TypeScript**
   - Derivação de PDA atualizada para usar `new anchor.BN(nonce).toBuffer("le", 8)`.
   - Chamadas a `createCommitment` passam o nonce como último argumento.

4. **Configuração da toolchain local**
   - Criado `programs/vow_protocol/rust-toolchain.toml` apontando para a toolchain `solana`.
   - Instalado `anchor-cli 0.28.0` via `avm install 0.28.0`.
   - Ativada Solana CLI 1.18.26 (link simbólico em `~/.local/share/solana/install/active_release`).

5. **Tentativas de resolver o build**
   - `cargo build` passou.
   - `anchor build` falhou porque crates recentes do registry (ex: `block-buffer 0.12.1`, `digest 0.11.3`) exigem `edition2024`, suportado apenas a partir do Cargo 1.85.
   - A Solana CLI 1.18.26 ainda usa Cargo 1.75.
   - Tentativa de pinar `digest = "=0.10.7"` e `sha2 = "=0.10.9"` não resolveu sozinha porque outras dependências transitivas ainda puxam versões mais novas.

## Bloqueio atual

- `anchor build` não completa no Mac por incompatibilidade entre a Solana CLI 1.18.26 (Cargo 1.75) e crates do registry que exigem `edition2024`.
- Instalar Solana CLI 2.x resolveria, mas as compilações longas geram risco de novo kernel panic no SSD WD.

## O que funciona agora

- Lógica do programa Rust compila com `cargo build` na toolchain `solana`.
- Código de testes está atualizado para a nova API.
- Frontend e documentação estão intactos.

## Próximos passos recomendados no PC

1. Clonar o repositório:
   ```bash
   git clone https://github.com/RogerioLimaDev/Glue---Dating-application.git
   cd Glue---Dating-application
   ```

2. Instalar ou garantir as toolchains:
   - Rust (via rustup)
   - Solana CLI 2.x (recomendado) ou 1.18.26
   - Anchor 0.28.0 via `avm install 0.28.0 && avm use 0.28.0`

3. Rodar o build do programa:
   ```bash
   cd programs/vow_protocol
   cargo build
   cd ../..
   anchor build
   ```

4. Se `anchor build` falhar por incompatibilidade de toolchain, atualizar para Anchor 0.29.0/0.30.1 e Solana CLI 2.x, e reverter os ajustes de `ctx.bumps` para a API mais nova.

5. Depois do build, executar os testes:
   ```bash
   anchor test
   ```

6. Em seguida, integrar o deploy em devnet e conectar ao frontend.

## Notas técnicas para retomada

- O PDA do `Commitment` usa as seeds: `["commitment", proposer, partner, nonce]`.
- O PDA do `UserVault` continua: `["user_vault", owner]`.
- O faucet inicial de 100 Vows é configurado em `initialize_user_vault`.
- O programa não gera tokens SPL; Vows são posições contábeis.
- `Date Code` é verificado via hash SHA-256 on-chain.

## Dúvidas para decidir amanhã

- Manter Anchor 0.28 ou atualizar para 0.29/0.30 no PC?
- Fazer deploy real em devnet ou continuar com mock para o hackathon?
- Priorizar smart contract ou integração frontend primeiro?

---

Atualizado em: 2026-10-06
