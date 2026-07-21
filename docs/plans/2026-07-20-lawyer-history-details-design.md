# Detalhe de solicitação do histórico (advogado)

## Objetivo

Ao abrir um item do Histórico, mostrar a solicitação já decidida (aceita/recusada), sem ações de aceitar/recusar.

## Design

- Mesmo header “Visualizar solicitação”.
- Accordion “Perfil do cliente” (colapsado).
- Sem “Dados da solicitação” e sem botões Aceitar/Recusar.
- “Descrição da solicitação” aberta.
- Card de status com faixa lateral:
  - Recusada: faixa salmon, ícone X, título “Solicitação Recusada”, texto sobre contato não divulgado.
  - Aceita: faixa verde, ícone check, título “Solicitação Aceita”, contatos do cliente visíveis.
- Itens pendentes da tab Solicitações mantêm o fluxo atual (aceitar/recusar).
