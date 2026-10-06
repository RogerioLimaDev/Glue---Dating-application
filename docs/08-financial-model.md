# Modelo Financeiro

Este documento registra a hipótese financeira do Glue. **Nenhuma decisão aqui é definitiva ou parte do MVP.**

## Hipótese principal

Incorporar uma camada financeira usando stablecoins para dar lastro aos Vows.

## Fluxo conceitual

1. O usuário compra Vows usando Pix ou cartão de crédito.
2. O pagamento é processado por um provedor de conversão fiat-cripto.
3. O valor é convertido em stablecoin, possivelmente USDC na Solana.
4. O Glue cobra uma comissão.
5. O valor correspondente aos Vows é registrado ou mantido conforme a arquitetura escolhida.
6. Os Vows são bloqueados em compromissos.
7. O encerramento do compromisso define a liquidação.

## Questões críticas antes de implementar

- Os Vows devem ser tokens SPL, posições contábeis no programa, ou unidades de compromisso sem token próprio?
- Cada Vow precisa ter lastro financeiro 1:1?
- Quem detém os ativos e quem controla as wallets?
- Como funcionam custódia, resgate, escrow e liquidação?
- Como o sistema trata taxas, reembolsos e chargebacks?
- Como garantir que os compromissos não criem obrigações financeiras sem cobertura?
- Quais são os riscos de stablecoin, custódia, liquidez e contratos inteligentes?
- Quais exigências regulatórias brasileiras se aplicam?

## Renda com reservas

A possibilidade de monetizar o capital mantido no sistema por meio de rendimento sobre reservas é uma **hipótese de negócio**, não uma funcionalidade aprovada.

Aviso importante:

> Não presuma que o Glue pode investir livremente os recursos dos usuários. Gerar rendimento com recursos de clientes exige análise jurídica e regulatória específica.

## Recomendação para o MVP

Não movimentar dinheiro real. Demonstrar o conceito financeiro com:

- Saldo de teste.
- Faucet de Vows.
- Simulação claramente identificada como não real.

Isso reduz risco regulatório, simplifica a implementação e permite focar no protocolo.

## Provedores candidatos

- Foxbit Gateway
- Hodle
- Lunium

Nenhum foi contratado. Cada um precisa ser avaliado quanto a:

- Suporte a Pix.
- Integração com Solana.
- Custos.
- KYC/AML.
- Custódia.
- APIs disponíveis.

## Decisões pendentes

- O MVP terá qualquer integração de pagamento, mesmo simulada?
- Qual será o preço de um Vow?
- Qual é a comissão do Glue por transação?
- Como será feito o resgate de Vows por stablecoins?
- Existe modelo de assinatura além da compra de Vows?

## Nota de segurança

Qualquer decisão que envolva fundos reais deve passar por revisão de segurança e análise jurídica antes de ser implementada.
