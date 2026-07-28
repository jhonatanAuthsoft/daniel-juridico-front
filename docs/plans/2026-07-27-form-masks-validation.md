# Form masks & validation — implementation plan

> **For Claude:** implementing in-session after design approval.

**Goal:** Máscaras + validação com bloqueio de avanço em cadastro (cliente/advogado), login e recuperar senha.

**Architecture:** Helpers locais (`utils/br-input.ts`), `FieldValidators`, `format`/`validate` em `InputTextField`, `required` em `InputSelectField`, `trigger` por step.

**Tech Stack:** Expo RN, react-hook-form (sem nova dep)

## Tasks

1. Utils + FieldValidators + InputTextField/Select — done
2. Wire client steps + goNext — done
3. Wire lawyer steps + goNext — done
4. Wire login / forgot / new-password — done
5. Unit tests CPF/CNPJ — in progress
