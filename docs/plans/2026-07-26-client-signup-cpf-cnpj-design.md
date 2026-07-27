# Cadastro cliente — etapa 2 CPF/CNPJ

## Objetivo

Permitir escolher CPF ou CNPJ na etapa 2 e alterar os campos do formulário.

## Design

- Toggle segmentado no topo (CPF | CNPJ), opção ativa com borda clara em cápsula.
- **CPF:** Nome completo, RG, Órgão Emissor + UF, CPF, Data de Nascimento.
- **CNPJ:** Razão Social, CNPJ.
- Campo de formulário `personType: 'cpf' | 'cnpj'` (default `cpf`).
- `fullName` reutilizado como nome ou razão social (label muda).
- Novos campos: `cnpj`, `birthDate`.
