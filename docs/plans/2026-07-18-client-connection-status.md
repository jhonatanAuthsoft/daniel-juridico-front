# Client Connection Status Implementation Plan

> **For Claude:** Implementar este plano tarefa por tarefa com TDD.

**Goal:** Renderizar ações e informações da conexão conforme o status mockado do advogado.

**Architecture:** Componentes separados representam cada estado e um componente coordenador seleciona o estado visível. A rota mantém somente o estado local atual, enquanto os valores iniciais e contatos pertencem aos mocks.

**Tech Stack:** React Native, Expo Symbols, TypeScript, Jest e Testing Library.

---

### Task 1: Testar os status

**Files:**
- Create: `src/components/client-connection-status/client-connection-status.component.test.tsx`

1. Testar `idle`, `pending`, `accepted` e `rejected`.
2. Testar abertura, fechamento e confirmação do modal.
3. Executar e confirmar a falha antes da implementação.

### Task 2: Implementar componentes atômicos

**Files:**
- Create: `src/components/client-connection-status/client-connection-idle.component.tsx`
- Create: `src/components/client-connection-status/client-connection-pending.component.tsx`
- Create: `src/components/client-connection-status/client-connection-accepted.component.tsx`
- Create: `src/components/client-connection-status/client-connection-rejected.component.tsx`
- Create: `src/components/client-connection-status/cancel-connection-modal.component.tsx`
- Create: `src/components/client-connection-status/client-connection-status.component.tsx`
- Create: `src/components/client-connection-status/index.ts`

1. Criar cada apresentação isoladamente.
2. Criar o renderizador por status.
3. Executar os testes do componente.

### Task 3: Integrar mocks e rota

**Files:**
- Modify: `src/components/client-solicitation-details/mock-client-solicitation-details.ts`
- Modify: `src/app/client/advogado/[id].tsx`
- Modify: `test/routes/client-lawyer-profile.test.tsx`

1. Adicionar status e contatos aos mocks.
2. Substituir o botão pelo renderizador.
3. Preservar avaliações logo após o bloco de conexão.
4. Executar suíte completa, lint direcionado e bundle iOS.

