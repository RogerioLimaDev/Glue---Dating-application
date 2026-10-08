# O Vow Protocol

O **Vow Protocol** é a camada de regras que administra os compromissos no Glue.

Glue é a primeira aplicação. O protocolo é a infraestrutura por trás dela.

Essa separação é intencional: permite que o conceito de "compromisso verificável" seja reaproveitado em outros contextos no futuro.

## Ciclo principal

```
COMMIT → LOCK → MEET → VERIFY → SETTLE
```

## Estados de referência

A máquina de estados ainda não é final. Uma referência inicial é:

```
AVAILABLE → COMMITTED → LOCKED → DATE_SCHEDULED → VERIFIED → SETTLED
```

Também devem existir estados alternativos para:

- Cancelamento antecipado.
- Cancelamento próximo ao horário.
- Não comparecimento.
- Expiração do compromisso.
- Solicitação de Grace.

## Regras fundamentais

1. **Compromisso simétrico:** ambos depositam a mesma quantidade de Vows.
2. **Lock até a verificação:** os Vows ficam bloqueados enquanto o compromisso está ativo.
3. **Verificação mútua:** ambos devem confirmar que o encontro aconteceu.
4. **Cancelamento sempre possível:** ninguém é obrigado a encontrar outra pessoa.
5. **Consequências transparentes:** as penalidades e recompensas são conhecidas antes do compromisso.
6. **Grace como exceção:** em circunstâncias justificadas, uma penalidade pode ser reduzida ou eliminada.

## O que fica on-chain

- Existência do compromisso.
- Identidade on-chain dos participantes (contas, não dados pessoais).
- Quantidade de Vows bloqueados.
- Estado atual do compromisso.
- Resultado da verificação.
- Transações de liquidação.

## O que fica off-chain

- Perfis, fotos e biografias.
- Conversas.
- Detalhes privados do encontro.
- Preferências de matching.
- Notificações.

## Decisões pendentes

- Qual é o menor conjunto de estados que cobre todos os cenários do MVP?
- Quem pode iniciar uma transição de estado?
- Como o protocolo lida com expiração de tempo?
- A liquidação devolve os Vows, redistribui, queima, ou combina essas ações?
- Grace é decidida por um oráculo, por votação mútua, ou por outro mecanismo?

## Riscos

- Máquina de estados mal definida pode gerar disputas impossíveis de resolver.
- Transições sem autorização adequada permitem manipulação por uma das partes.
- Estados finais mal projetados podem travar fundos indefinidamente.
