# Cancelamento, Grace e Não Comparecimento

O Vow Protocol deve tratar cancelamentos e faltas de forma justa e previsível.

O princípio fundamental:

> Commitment doesn't take away your freedom. It gives your choices value.

Ninguém pode ser obrigado a encontrar outra pessoa. O protocolo só define as consequências conhecidas de antemão.

## Cenários

### 1. Cancelamento antecipado

Um dos participadores cancela com bastante antecedência.

- Possível consequência: devolução integral dos Vows.
- Possível consequência: pequena taxa de cancelamento para evitar propostas irresponsáveis.

### 2. Cancelamento próximo ao horário

Cancelamento pouco antes do encontro.

- Possível consequência: devolução parcial ou taxa maior.
- Justificativa: o outro participante já reservou tempo e pode ter custos de deslocamento.

### 3. Cancelamento mútuo

Ambos concordam em cancelar.

- Possível consequência: devolução integral para ambos.
- Possível consequência: nenhuma penalidade.

### 4. Não comparecimento

Um participante não aparece no encontro.

- Possível consequência: os Vows do faltão são transferidos para quem compareceu.
- Possível consequência: taxa adicional ou queima parcial dos Vows.

### 5. Circunstâncias excepcionais

Emergências, acidentes, doenças, eventos de força maior.

- Aqui entra o mecanismo de **Grace**.

## Grace

Grace é um mecanismo de exceção que permite reduzir ou eliminar uma penalidade.

Perguntas em aberto:

- Quem decide se Grace se aplica?
- Qual é o critério objetivo?
- Grace pode ser solicitada por um lado e aceita pelo outro?
- Existe um limite de Grace por período?
- Grace pode ser explorada para cancelar sem custo?

## Riscos a evitar

- Penalidades injustas que desincentivam o uso do aplicativo.
- Disputas insolúveis entre participantes.
- Um usuário alegar falsamente que o outro não compareceu para receber Vows.
- Mecanismos de Grace facilmente gamificados.

## Decisões pendentes

- Definir janelas de tempo para cancelamento (ex: 24h, 4h, 1h antes).
- Definir valores de taxa e penalidade.
- Definir quem pode invocar Grace.
- Definir se há um oráculo humano/automático para avaliar Grace.
- Definir o que acontece se ambos não comparecerem.

## Sugestão para o MVP

Mantenha as regras simples e explícitas:

1. Cancelamento com mais de 24h: devolução integral.
2. Cancelamento entre 24h e 4h: pequena taxa.
3. Cancelamento com menos de 4h ou não comparecimento: penalidade maior.
4. Grace disponível uma vez por mês, limitada a casos excepcionais com evidência mínima.
5. Não comparecimento mútuo: ambos perdem uma parte pequena dos Vows como incentivo à seriedade.

Esses valores são uma proposta inicial, não decisões finais.
