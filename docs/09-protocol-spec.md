# Vow Protocol — Especificação Técnica Mínima

## Objetivo

Definir o menor conjunto de estados, contas e instruções do programa Solana necessário para demonstrar o Glue no hackathon em 6 dias.

## Princípios para o MVP

- Apenas o **happy path** + cancelamento mútuo + no-show simples.
- **Grace fica fora** do MVP.
- Vows são **posições contábeis** dentro do programa, não tokens SPL.
- Dados de perfil, fotos, mensagens e detalhes privados ficam **off-chain**.
- A blockchain armazena apenas: compromissos, estados, Vows bloqueados, verificação e liquidação.
- Wallet de teste pré-fundada para demo sem fricção.

## Máquina de estados

```
Proposed → Locked → Verified → Settled
   ↓          ↓
Cancelled  Cancelled
```

| Estado | Significado |
|--------|-------------|
| `Proposed` | Um usuário criou a proposta e bloqueou seus Vows. |
| `Locked` | O parceiro aceitou e bloqueou seus Vows. Ambos estão comprometidos. |
| `Verified` | Os Date Codes foram trocados pessoalmente e confirmados. |
| `Settled` | Os Vows foram devolvidos ou redistribuídos conforme o resultado. |
| `Cancelled` | Compromisso cancelado antes do encontro; Vows devolvidos. |

## Contas do programa

### `Commitment`

Armazena um compromisso entre dois usuários.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `bump` | `u8` | PDA bump |
| `proposer` | `Pubkey` | Quem iniciou o compromisso. |
| `partner` | `Pubkey` | Quem deve aceitar. |
| `vows` | `u64` | Quantidade de Vows depositada por cada lado. |
| `venue_hash` | `[u8; 32]` | Hash do local (off-chain). |
| `time_hash` | `[u8; 32]` | Hash do horário (off-chain). |
| `state` | `CommitmentState` | Estado atual. |
| `proposer_code_hash` | `[u8; 32]` | Hash do Date Code do proposer. |
| `partner_code_hash` | `[u8; 32]` | Hash do Date Code do parceiro. |
| `created_at` | `i64` | Timestamp de criação. |
| `expires_at` | `i64` | Prazo para aceite/verificação. |

### `UserVault`

Armazena o saldo de Vows de cada usuário e Vows bloqueados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `bump` | `u8` | PDA bump |
| `owner` | `Pubkey` | Dono da conta. |
| `balance` | `u64` | Vows disponíveis. |
| `locked` | `u64` | Vows bloqueados em compromissos ativos. |

## Instruções do programa

### 1. `initialize_user_vault`

Cria uma `UserVault` para um usuário com saldo inicial de teste.

- Signer: usuário.
- Ações: cria PDA `UserVault`, define saldo inicial (ex: 100 Vows).

### 2. `create_commitment`

Cria um compromisso no estado `Proposed`.

- Signer: `proposer`.
- Parâmetros: `partner`, `vows`, `venue_hash`, `time_hash`, `proposer_code_hash`, `expires_at`.
- Ações:
  - Verifica saldo do proposer.
  - Bloqueia `vows` do proposer.
  - Cria PDA `Commitment` no estado `Proposed`.

### 3. `accept_commitment`

Parceiro aceita o compromisso, bloqueia seus Vows e muda para `Locked`.

- Signer: `partner`.
- Parâmetros: `commitment`.
- Ações:
  - Verifica estado `Proposed`.
  - Verifica `expires_at`.
  - Bloqueia `vows` do partner.
  - Altera estado para `Locked`.

### 4. `cancel_commitment`

Cancelamento mútuo antes do encontro.

- Signer: `proposer` ou `partner`.
- Ações:
  - Estado deve ser `Proposed` ou `Locked`.
  - Devolve Vows bloqueados para ambos.
  - Altera estado para `Cancelled`.

### 5. `verify_date`

Ambos confirmam os Date Codes trocados pessoalmente.

- Signer: `proposer` ou `partner`.
- Parâmetros: `commitment`, `proposer_code`, `partner_code`.
- Ações:
  - Verifica estado `Locked`.
  - Verifica hashes dos códigos.
  - Altera estado para `Verified`.

### 6. `settle_commitment`

Liquida o compromisso e libera ou redistribui os Vows.

- Signer: qualquer um dos dois lados (após condições).
- Ações:
  - Se estado `Verified`: devolve todos os Vows para ambos.
  - Se estado `Locked` e `expires_at` ultrapassado: quem chama recebe os Vows do outro (no-show).
  - Altera estado para `Settled`.

## Date Code

- Código de 6 dígitos gerado no frontend a partir de uma seed derivada do `commitment` PDA.
- Cada lado mostra seu próprio código e digita o código do outro.
- O programa recebe os dois códigos em claro e valida contra os hashes armazenados.
- **Importante:** os códigos em claro nunca são armazenados on-chain; apenas seus hashes.
- **Simplificação do MVP:** uma única transação `verify_date` recebe os dois códigos. Para produção, cada lado deve provar separadamente que conhece o código do outro.

## Regras de liquidação

| Cenário | Resultado |
|---------|-----------|
| Verificado mútuo | Ambos recebem de volta seus Vows. |
| Locked + expirado | Quem chama `settle` recebe os Vows do outro. |
| Cancelado | Ambos recebem de volta. |

## Seed dos PDAs

### `UserVault`

```rust
["user_vault", owner.as_ref()]
```

### `Commitment`

```rust
["commitment", proposer.as_ref(), partner.as_ref(), proposer_code_hash.as_ref()]
```

## Segurança mínima

- Apenas o `proposer` pode criar um compromisso com seus próprios Vows.
- Apenas o `partner` pode aceitar um compromisso que o tenha como parceiro.
- Cancelamento pode ser chamado por qualquer um dos dois lados.
- `verify_date` pode ser chamado por qualquer um dos dois lados, mas exige ambos os códigos corretos. **Nota:** no MVP isso é aceitável para simplificar a demo, mas não é seguro para produção; a versão final deve separar a prova de cada lado.
- `settle_commitment` só executa conforme estado e regras de tempo.

## Fora do MVP

- Grace.
- Penalidades escalonadas por tempo de cancelamento.
- Tokens SPL.
- Stablecoins reais.
- Pagamentos Pix/cartão.
- Chat real.
- PostgreSQL.
- Reputação on-chain.
- NFTs.

## Próximos passos

1. Instalar Rust, Solana CLI e Anchor.
2. Criar o projeto Anchor em `programs/vow_protocol/`.
3. Implementar contas e instruções mínimas.
4. Escrever testes TypeScript para todas as transições de estado.
5. Fazer deploy em devnet.
