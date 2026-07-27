# Cadastro advogado — pular Especialidades

## Objetivo

Mostrar a etapa 7 (Especialidades) só se na etapa 6 o usuário marcar “Nenhuma das anteriores”.

## Comportamento

- `practiceAreas` inclui `none` → 6 → 7 → 8…
- Caso contrário → 6 → 8… (pula 7)
- Voltar: 8 → 7 só se `none` estiver marcado; senão 8 → 6
- Ao pular a 7 na ida, limpar `specialties`
