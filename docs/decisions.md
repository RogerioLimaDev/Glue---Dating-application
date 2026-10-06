# Decisões do Projeto

Este documento registra decisões confirmadas, hipóteses em avaliação e questões em aberto do Glue.

## Decisões confirmadas

- Blockchain: **Solana**.
- Produto: aplicativo de dating focado em compromisso, não em quantidade de matches.
- Conceito central: **Vow** como unidade de compromisso.
- Ciclo do protocolo: **COMMIT → LOCK → MEET → VERIFY → SETTLE**.
- Verificação: **Date Code** trocado pessoalmente.
- Dados pessoais e conversas ficam **off-chain**.
- Compromissos, Vows, verificação e liquidação ficam **on-chain**.
- MVP deve demonstrar o fluxo completo de ponta a ponta.
- UX deve ser simples para usuários sem experiência em blockchain.

## Hipóteses em avaliação

- Uso de **Anchor** para desenvolvimento do smart contract.
- Uso de **embedded wallets** (Privy) para reduzir fricção.
- Uso de **USDC** como stablecoin de lastro, se a camada financeira for adicionada.
- Uso de **Helius** como provedor RPC/indexing.
- Integração de on-ramp/off-ramp com **Foxbit Gateway, Hodle ou Lunium**.
- Modelo de rendimento sobre reservas como possibilidade de negócio futura.

## Questões em aberto

- Vows serão tokens SPL ou posições contábeis no programa?
- O MVP usará Vows com lastro real ou totalmente simbólicos?
- Qual será a máquina de estados final do protocolo?
- Quem decide Grace e com base em quais critérios?
- Qual é o modelo de penalidade exato para cancelamentos e faltas?
- Quantos dígitos terá o Date Code e qual será seu tempo de expiração?
- O programa será em Anchor ou Rust puro?
- O frontend atual será mantido, reescrito ou expandido?
- Será necessário backend próprio ou apenas indexação de eventos on-chain?
- Qual será a licença do repositório?

## Riscos

- **Técnico:** máquina de estados mal projetada pode travar fundos ou gerar disputas insolúveis.
- **Financeiro:** movimentar dinheiro real sem estrutura regulatória adequada.
- **UX:** embedded wallet pode criar dependência de terceiro ou limitar usuários avançados.
- **Demo:** RPC instável ou transação lenta pode quebrar a apresentação no hackathon.
- **Regulatório:** qualquer rendimento sobre reservas de clientes exige análise jurídica específica.

## Próximas tarefas

1. Finalizar a máquina de estados do Vow Protocol.
2. Decidir se o MVP usa Vows simbólicos ou com lastro.
3. Escolher Anchor ou Rust puro.
4. Criar o primeiro programa Solana com estados básicos.
5. Conectar o frontend atual a devnet.
6. Escrever testes para transições críticas.
7. Montar o script de demonstração do hackathon.

## Como atualizar este documento

Sempre que uma decisão for confirmada, uma hipótese for validada/refutada ou uma nova questão surgir, atualize este arquivo com a data e o motivo.
