# Ação de avaliação na conexão aceita

## Objetivo

Permitir que o cliente avalie o advogado apenas quando a solicitação de conexão estiver aceita.

## Design aprovado

- `ClientLawyerReviews` recebe `canReview`.
- Quando permitido, “Deixar uma avaliação” aparece entre o cabeçalho e os cards.
- Um componente separado `ClientReviewFormModal` concentra o formulário.
- Nota de 1 a 5 estrelas e comentário são obrigatórios.
- O comentário aceita até 800 caracteres e exibe a quantidade restante.
- Erros aparecem junto aos campos.
- O envio é apenas local: fecha o modal e transforma a ação em “Avaliação enviada”, sem alterar a lista.
- O formulário usa `Modal`, `TextInput` e `KeyboardAvoidingView` nativos, sem nova dependência.

## Alternativas descartadas

- Controlar o formulário diretamente na rota: acopla o perfil ao estado interno do modal.
- Criar uma rota separada: adiciona navegação para uma interação curta.

