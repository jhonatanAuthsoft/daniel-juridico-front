# Histórico do advogado

## Objetivo

Substituir o Style Guide na tab Histórico por uma lista de solicitações aceitas/recusadas.

## Design

- Título “Histórico” + ícone de busca (mesmo comportamento da home de Solicitações).
- Filtros: Todas | Aceitas (8) | Recusadas (6).
- Cards com: nome do cliente, urgência (ponto + label), descrição (2 linhas), status (aceita/recusada).
- Status aceita: ícone check + texto verde “Solicitação aceita.”
- Status recusada: ícone X + texto salmon “Solicitação recusada”.
- Toque no card navega para `/lawyer/solicitacao/[id]`.
- Padding inferior para não ficar atrás da tab bar.
- Empty states reutilizam `LawyerEmptyState`.
