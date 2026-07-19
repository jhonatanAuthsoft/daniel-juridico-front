# Avaliações do advogado na visão do cliente

## Objetivo

Exibir avaliações abaixo da ação de conexão no perfil de advogado visto pelo cliente.

## Design aprovado

- Um componente `ClientLawyerReviews` concentra cabeçalho, cards e expansão.
- O cabeçalho mostra “Avaliações” e o total demonstrativo “(150)”.
- Três avaliações aparecem inicialmente.
- Cada card contém avatar, nome, estrelas, nota e comentário.
- “Veja mais avaliações” revela os demais mocks na mesma página e muda para “Ver menos avaliações”.
- A implementação usa apenas React Native e os componentes existentes, sem nova dependência.

## Testes

- Renderização do total e das três avaliações iniciais.
- Expansão e recolhimento da lista.
- Presença da seção depois do botão de conexão no perfil do cliente.

