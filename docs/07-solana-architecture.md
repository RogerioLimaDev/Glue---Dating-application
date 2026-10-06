# Arquitetura Solana

Este documento descreve a arquitetura técnica de referência para o Glue no hackathon Solana.

## Stack de referência

| Camada | Tecnologia |
|--------|-----------|
| Blockchain | Solana |
| Smart contract | Rust + Anchor (framework candidato) |
| Aplicação | TypeScript + React |
| Wallet | Embedded wallets, possivelmente Privy |
| Stablecoin | USDC na Solana (se camada financeira for adicionada) |
| Backend | Node.js / TypeScript, se necessário |
| Banco de dados | PostgreSQL ou equivalente |
| Infra Solana | Helius ou provedor RPC/indexing |
| On/off ramp | Foxbit Gateway, Hodle, Lunium (a investigar) |

## Separação on-chain / off-chain

### Off-chain

- Perfis, fotos e biografias.
- Mensagens e chat.
- Matching e preferências.
- Notificações push/email.
- Detalhes privados do encontro.

### On-chain

- Compromissos e estados do protocolo.
- Bloqueio de Vows.
- Verificação e liquidação.
- Histórico de compromissos finalizados.

## Componentes do sistema

### Programa Solana (smart contract)

Responsável por:

- Criar compromissos.
- Bloquear e desbloquear Vows.
- Registrar verificações.
- Executar liquidações.
- Gerenciar estados do protocolo.

### Frontend

Responsável por:

- Descoberta de perfis.
- Visualização de saldo de Vows.
- Criação e aceite de compromissos.
- Chat simplificado.
- Interface de Date Code.
- Painel de transações e estados on-chain.

### Backend

Responsável por:

- Armazenar dados tradicionais da aplicação.
- Servir perfis e mensagens.
- Indexar eventos on-chain para leitura rápida.
- Enviar notificações.

### Wallet

Opções:

1. **Wallet externa (Phantom, Solflare):** simples para usuários cripto, mas cria fricção para iniciantes.
2. **Embedded wallet (Privy):** melhor UX para não-crypto nativos, mas adiciona dependência de terceiro.

Recomendação para o MVP: usar embedded wallets para manter a experiência acessível.

## Decisões técnicas prioritárias

1. Vows serão tokens SPL, posições contábeis em contas do programa, ou uma mistura?
2. Os Vows terão lastro em USDC no MVP ou serão totalmente simbólicos?
3. A carteira será embedded ou externa?
4. O programa será escrito em Anchor ou em Rust puro?
5. Quais dados serão indexados on-chain vs consultados via RPC?

## Riscos

- Complexidade do programa pode exceder o prazo do hackathon.
- Dependência de provedores RPC pode gerar instabilidade na demo.
- Custódia de wallets embedded exige confiança no provedor.
- Latência da Solana pode afetar a percepção de instantaneidade do aplicativo.

## Próximos passos

1. Definir se o MVP usa Vows simbólicos ou com lastro.
2. Escolher entre Anchor e Rust puro.
3. Prototipar o programa com os estados básicos.
4. Conectar o frontend a devnet.
5. Escrever testes para as transições de estado críticas.
