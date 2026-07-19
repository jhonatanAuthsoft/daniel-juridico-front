# Status da conexão na visão do cliente

## Objetivo

Substituir o botão isolado por componentes atômicos que representem cada estado da solicitação de conexão.

## Design aprovado

- `idle`: botão “Solicitar conexão”.
- `pending`: card “Solicitação enviada”, indicação de espera e ação para cancelar.
- `accepted`: card com telefone e e-mail apenas visuais.
- `rejected`: card informando que a solicitação foi recusada.
- Um renderizador recebe um status discriminado e escolhe o componente correto.
- O cancelamento usa `Modal` nativo, pede confirmação e retorna ao estado inicial.
- Os mocks demonstram os quatro estados: Maria (`idle`), Amanda (`pending`), Juliana (`accepted`) e Clara (`rejected`).
- Solicitar muda localmente de `idle` para `pending`; cancelar muda de `pending` para `idle`.

## Alternativas descartadas

- Um único componente com muitos condicionais: menos arquivos, porém menor isolamento.
- Card genérico por configuração: reduz marcação repetida, mas abstrai em excesso estados com conteúdo e ações diferentes.

## Dependências

React Native `Modal` e `expo-symbols`, já presentes e compatíveis com Expo 57. Nenhuma nova biblioteca.

