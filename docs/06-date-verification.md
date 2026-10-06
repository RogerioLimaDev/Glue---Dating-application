# Verificação do Encontro

O **Date Code** é o mecanismo que prova — dentro dos limites técnicos possíveis — que dois participantes se encontraram fisicamente.

## Limitação fundamental

A blockchain não pode verificar diretamente que duas pessoas estiveram no mesmo lugar ao mesmo tempo. O Date Code é uma ponte pragmática entre o evento físico e o registro digital.

## Como funciona

1. O protocolo gera um código temporário e de uso único para cada participante.
2. Durante o encontro, os participantes trocam os códigos pessoalmente.
3. Cada um insere ou confirma o código do outro no aplicativo.
4. O sistema registra que a verificação mútua ocorreu.
5. O protocolo avança para liquidação.

## Requisitos de segurança

O design deve considerar:

- **Códigos falsificados:** um participante não deve poder advinhar ou gerar o código do outro.
- **Replay:** um código usado não pode ser reutilizado em outro compromisso.
- **Expiração:** o código deve ter validade limitada ao horário do encontro.
- **Confirmação unilateral:** um participante não deve poder confirmar sozinho que o outro compareceu.
- **Perda de conexão:** o sistema deve funcionar mesmo se um dos aplicativos estiver offline durante o encontro.
- **Fraudes sociais:** evitar que um participante coaja o outro a confirmar um encontro que não aconteceu.

## Dados fora da blockchain

Conversas, fotos, localização precisa, endereço e detalhes privados do encontro **nunca** vão para a blockchain.

Apenas o resultado da verificação é registrado on-chain:

- Identificador do compromisso.
- Participantes.
- Timestamp de verificação.
- Resultado: verificado, não verificado, disputado.

## Possíveis implementações técnicas

### Opção A: Código curto de 4 a 6 dígitos

- Simples de trocar pessoalmente.
- Risco maior de adivinhação ou vazamento.
- Deve ter expiração curta e uso único.

### Opção B: Código com hash vinculado ao compromisso

- Cada código é derivado de dados únicos do compromisso.
- Dificulta replay e falsificação.
- Ainda simples de trocar pessoalmente.

### Opção C: QR code com criptografia assimétrica

- Cada participante escaneia o QR do outro.
- Mais seguro contra falsificação.
- Requer ambos os dispositivos funcionando.

## Decisão recomendada para o MVP

Começar com a **Opção B**: códigos de uso único, vinculados ao compromisso, com expiração automática. Ela oferece equilíbrio entre segurança e simplicidade de demonstração.

## Decisões pendentes

- Quantidade de dígitos do código.
- Tempo de expiração.
- O que acontece se um participante perder o celular durante o encontro.
- Como tratar disputas de verificação.
- Se há segunda via de verificação por biometria, NFC, geolocalização ou outro meio.
