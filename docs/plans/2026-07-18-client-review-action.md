# Client Review Action Implementation Plan

> **For Claude:** Implementar este plano tarefa por tarefa com TDD.

**Goal:** Permitir avaliação local de advogados com conexão aceita.

**Architecture:** O bloco de avaliações controla abertura e confirmação, enquanto um modal isolado controla nota, comentário e validação. A rota informa apenas se o status atual permite avaliar.

**Tech Stack:** React Native, Expo Symbols, TypeScript, Jest e Testing Library.

---

### Task 1: Testar a ação

**Files:**
- Modify: `test/routes/client-lawyer-profile.test.tsx`

1. Testar ausência da ação em estados não aceitos.
2. Testar abertura na conexão aceita.
3. Testar validação dos campos.
4. Testar confirmação após envio.
5. Executar e confirmar as falhas.

### Task 2: Implementar o modal

**Files:**
- Create: `src/components/client-lawyer-reviews/client-review-form-modal.component.tsx`
- Modify: `src/components/client-lawyer-reviews/client-lawyer-reviews.component.tsx`

1. Criar seleção acessível de estrelas.
2. Criar comentário limitado a 800 caracteres.
3. Validar nota e comentário.
4. Notificar sucesso ao componente pai.

### Task 3: Integrar ao status

**Files:**
- Modify: `src/app/client/advogado/[id].tsx`

1. Passar `canReview` somente quando o status for `accepted`.
2. Executar suíte completa, lint direcionado e bundle iOS.

