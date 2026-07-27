# Cadastro advogado — Raio de atuação (etapa 8)

## Objetivo

Reordenar etapas: Especialidades passa a ser a 7; nova etapa 8 “Raio de atuação”. Remover o placeholder da etapa 7.

## Design

- Etapas: … → 6 Atuação → **7 Especialidades** → **8 Raio de atuação** → 9 Cobrança → 10 Sobre você.
- Tela 8: selects Estado e Cidade (`InputSelectField` com busca).
- Campos: `serviceState`, `serviceCity` (independentes do endereço residencial).
- Cidades filtradas por UF via `CITIES_BY_UF`.
- Copy: título “Raio de atuação”; subtítulo “Informe as cidades em que você atende para auxiliar as conexões com cliente”.
