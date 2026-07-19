# Exclusão da avaliação do cliente

## Objetivo

Destacar a avaliação feita pelo cliente e permitir sua exclusão mediante confirmação.

## Design aprovado

- Avaliações recebem a marca `isOwn`.
- `ClientOwnReviewCard` apresenta “Você”, nota, comentário e “Excluir avaliação”.
- `DeleteReviewConfirmationModal` confirma uma ação irreversível.
- O advogado com conexão aceita recebe uma avaliação própria mockada no topo.
- Enquanto houver avaliação própria, “Deixar uma avaliação” fica oculto.
- Confirmar a exclusão remove o card localmente, reduz o total de 150 para 149 e libera uma nova avaliação.
- Fechar o diálogo preserva a avaliação.

## Dependências

Somente React Native `Modal`, Expo Symbols e componentes existentes.

