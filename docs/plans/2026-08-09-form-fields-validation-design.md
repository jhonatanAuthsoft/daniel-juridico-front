# Revisão de campos de formulário (design)

**Data:** 2026-08-09  
**Status:** aprovado para implementação  
**Abordagem:** A — ajustes pontuais em `br-input` / `FieldValidators` / placeholders / OTP

---

## Escopo

Revisão de validações e placeholders nos cadastros (cliente/advogado) e recuperação de senha.

Fora deste desenho: máscara OAB, mudança de UX do salário (R$ / milhares), lib externa de documentos BR, refator Zod dos forms.

---

## Decisões

| Campo | Decisão |
|-------|---------|
| **RG** | Exigir **9 dígitos** completos; máscara `00.000.000-0`; verificador = **1** dígito; rejeitar parcial |
| **OAB número** | Manter alfanumérico 3–10, **sem máscara** de formato |
| **CPF** | Sem mudança (já valida dígitos verificadores) |
| **Salário / renda** | Manter máscara atual (centavos com `,` já funcionam) |
| **Órgão emissor / UF** | Placeholders → `Selecione` e `UF` (cliente + advogado) |
| **OTP** | Remover placeholder das células |
| **Nascimento** | Calendário válido + ano ≥ **1920** + **não no futuro** |
| **Expedição OAB** | Calendário válido + ano ≥ **1950** + **não no futuro** |

---

## Modelo técnico

### Helpers (`app/src/utils/br-input.ts`)

- Ajustar `maskRg` para nunca exibir 2 dígitos no verificador (sempre 1 após o hífen quando houver 9º dígito).
- Estender `isValidDateBr` (ou criar helper parametrizado) com:
  - `minYear`
  - `allowFuture: false` (comparar com data local de hoje)
- Manter validação de calendário (mês/dia reais) já existente.

### Validators (`app/src/constants/field-validators.ts`)

- `rg`: 9 dígitos + mensagem `RG inválido` (substituir `digitsMin(5)` nos steps).
- `dateBrBirth`: piso 1920, sem futuro.
- `dateBrOabIssue`: piso 1950, sem futuro.
- Alternativa equivalente: `dateBr({ minYear, allowFuture: false })` se preferir um único factory.

### UI

- `step-personal-documents` (cliente) e `step-documentation` (advogado): placeholders órgão/UF; validator RG e data nascimento.
- `step-oab-registration`: validator data expedição (principal + suplementar se aplicável).
- `input-otp.component.tsx`: células sem `placeholder`.

---

## Fluxo de validação (datas)

1. Máscara `DD/MM/AAAA` enquanto digita.  
2. Ao validar: 8 dígitos → parse dia/mês/ano.  
3. Rejeitar se mês/dia inválidos no calendário.  
4. Rejeitar se ano &lt; piso do campo.  
5. Rejeitar se data &gt; hoje (nascimento e expedição OAB).

---

## Testes

- Unitários em `br-input` / validators: RG completo vs parcial; verificador 1 dígito; nascimento 1919 vs 1920 vs futuro; OAB 1949 vs 1950 vs futuro.
- Ajustar testes de componente que assertam placeholder antigo (`SSP` / `BA` / OTP `1`–`4`) se existirem.

---

*Hipótese: RG com 9 dígitos cobre o padrão mascarado atual; OABs alfanuméricas continuam sem formato rígido.*
