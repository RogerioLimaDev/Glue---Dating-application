# Fluxo do Protocolo

Este documento descreve o fluxo principal do compromisso de encontro no Glue.

## 1. Descoberta

Um usuário visualiza perfis de outras pessoas. Cada perfil mostra informações públicas:

- Nome, idade, foto, bio.
- Interesses e preferências de encontro.
- Taxa de compromisso cumprido.
- Quantidade de Vows exigida para um compromisso.

## 2. Proposta de compromisso

O usuário interessado inicia uma proposta de encontro:

- Escolhe ou confirma o local e horário sugerido.
- Compromete uma quantidade de Vows.
- A quantidade é definida pelo perfil do outro participante ou negociada.

## 3. Aceite e lock mútuo

A outra pessoa revisa a proposta e aceita:

- Aceita o local, horário e quantidade de Vows.
- Compromete a mesma quantidade de Vows.
- O protocolo bloqueia os Vows de ambos.

Estado: `LOCKED` ou `DATE_SCHEDULED`.

## 4. Combinação do encontro

Os participantes usam o chat simplificado para confirmar detalhes práticos. Isso pode incluir:

- Confirmação do local exato.
- Ajustes de última hora.
- Troca de informações não sensíveis.

Dados como endereço residencial, CPF, telefone ou outros dados pessoais não são obrigatórios.

## 5. Encontro físico

Os participantes se encontram no local combinado. Cada um tem acesso ao seu Date Code dentro do aplicativo.

## 6. Verificação com Date Code

Durante o encontro, os participantes trocam os códigos:

- Cada um visualiza seu próprio código.
- Cada um digita ou confirma o código do outro.
- O sistema registra a verificação mútua.

Após a verificação, o protocolo avança para liquidação.

## 7. Liquidação

O protocolo libera os Vows de acordo com a regra do compromisso:

- Se ambos compareceram e verificaram: cada um recebe de volta seus Vows (ou recompensa equivalente).
- Se houve cancelamento dentro das regras: os Vows são devolvidos com possível taxa.
- Se um participante não compareceu: a penalidade definida é aplicada.

## Diagrama conceitual

```
Discover → Make a Vow → Accept → Lock Vows → Chat/Schedule → Meet
                                                            ↓
                                            Verify with Date Code
                                                            ↓
                                                    Settle Vows
```

## Decisões pendentes

- O aceite é feito em uma única transação on-chain ou em duas etapas?
- O lock acontece no momento da proposta ou no momento do aceite?
- O protocolo exige confirmação de ambos para agendar, ou um participante define e o outro aceita?
- A liquidação é automática após verificação ou exige uma confirmação final?

## Cenários fora do fluxo principal

- Cancelamento antes do lock.
- Cancelamento após o lock.
- Não comparecimento de um lado.
- Não comparecimento de ambos.
- Falha na verificação por perda de conexão.
- Solicitação de Grace.

Esses cenários são detalhados em `docs/05-cancellation-and-grace.md`.
