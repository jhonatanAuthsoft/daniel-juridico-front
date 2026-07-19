# Client Own Review Delete Implementation Plan

> **For Claude:** Implementar este plano tarefa por tarefa com TDD.

**Goal:** Permitir que o cliente exclua sua avaliação após confirmação.

**Architecture:** O bloco de avaliações mantém a lista e o total locais. Um card exclusivo representa a avaliação do cliente e um modal isolado confirma a remoção.

**Tech Stack:** React Native, Expo Symbols, TypeScript, Jest e Testing Library.

---

### Task 1: Testar exclusão

**Files:**
- Modify: `test/routes/client-lawyer-profile.test.tsx`

1. Testar card “Você” e ausência da ação de criar.
2. Testar fechamento do diálogo sem exclusão.
3. Testar confirmação, total reduzido e ação liberada.
4. Executar e confirmar as falhas.

### Task 2: Criar componentes

**Files:**
- Create: `src/components/client-lawyer-reviews/client-own-review-card.component.tsx`
- Create: `src/components/client-lawyer-reviews/delete-review-confirmation-modal.component.tsx`
- Modify: `src/components/client-lawyer-reviews/client-lawyer-reviews.component.tsx`

1. Implementar card próprio.
2. Implementar diálogo.
3. Gerenciar lista e total locais.

### Task 3: Integrar mock

**Files:**
- Modify: `src/app/client/advogado/[id].tsx`

1. Adicionar avaliação própria somente ao advogado aceito.
2. Executar suíte completa, lint direcionado e bundle iOS.

