# Form masks & validation — design

**Date:** 2026-07-27  
**Scope:** Cadastro cliente + advogado, login, recuperar senha  
**Approach:** Helpers locais + estender `InputTextField` (sem nova dep)

## Decisions

- Máscaras + dígito verificador para CPF/CNPJ
- Bloquear Continuar/submit até campos do step/tela atuais válidos
- Valor na UI pode ficar mascarado; mappers seguem enviando só dígitos ao API

## Infra

- `InputTextField`: `format?: (text) => string`, `validate?: (value) => true | string`
- Utils BR: masks + `isValidCpf` / `isValidCnpj` / phone / cep / date
- Step field maps + `trigger(fields)` em `goNext`

## Out of scope

- Formulário de solicitação e demais forms do app
