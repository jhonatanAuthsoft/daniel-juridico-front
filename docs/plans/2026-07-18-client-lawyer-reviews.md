# Client Lawyer Reviews Implementation Plan

> **For Claude:** Implementar este plano tarefa por tarefa com TDD.

**Goal:** Adicionar uma seção expansível de avaliações ao perfil do advogado na visão do cliente.

**Architecture:** Um componente stateful recebe avaliações por props e controla apenas a quantidade visível. A rota mantém os dados mockados e posiciona o componente abaixo da ação de conexão.

**Tech Stack:** React Native, Expo, TypeScript, Jest e Testing Library.

---

### Task 1: Testar o componente

**Files:**
- Create: `src/components/client-lawyer-reviews/client-lawyer-reviews.component.test.tsx`

1. Testar cabeçalho, total e três cards iniciais.
2. Testar expansão e recolhimento.
3. Executar o teste e confirmar a falha pela ausência do componente.

### Task 2: Implementar avaliações

**Files:**
- Create: `src/components/client-lawyer-reviews/client-lawyer-reviews.component.tsx`
- Create: `src/components/client-lawyer-reviews/index.ts`

1. Definir o tipo de avaliação.
2. Renderizar cards e estrelas.
3. Controlar expansão local.
4. Executar os testes do componente.

### Task 3: Integrar ao perfil

**Files:**
- Modify: `src/app/client/advogado/[id].tsx`
- Modify: `test/routes/client-lawyer-profile.test.tsx`

1. Testar a presença da seção na rota.
2. Criar avaliações mockadas na visão do cliente.
3. Montar o componente depois do botão de conexão.
4. Executar testes, lint direcionado e bundle iOS.

