# Client Lawyer Profile Implementation Plan

**Goal:** Permitir que o cliente abra o perfil detalhado de um advogado compatível.

**Architecture:** A rota dinâmica `/client/advogado/[id]` é exclusiva da visão do cliente. Ela usa os mesmos mocks dos advogados compatíveis, enriquecidos com biografia e informações profissionais, sem compartilhar comportamento com telas do perfil advogado.

## Tarefas

1. Testar navegação pelo card e montagem da rota.
2. Expandir o mock de advogado.
3. Criar a página de perfil conforme a referência.
4. Manter a ação de conexão independente da navegação.
5. Validar testes, lint e bundle iOS.

