# Lawyer Solicitation Details Implementation Plan

> **For Claude:** Implementar este plano tarefa por tarefa com TDD.

**Goal:** Criar o fluxo de detalhe e aceite de solicitação exclusivo do advogado.

**Architecture:** Uma rota dinâmica monta quatro componentes de apresentação sobre um mock detalhado. A rota coordena apenas navegação e estado local de aceite.

**Tech Stack:** React Native, Expo Router, Expo Image, Expo Symbols, TypeScript, Jest e Testing Library.

---

### Task 1: Testar navegação e detalhe

**Files:**
- Modify: `test/routes/lawyer-home.test.tsx`
- Create: `test/routes/lawyer-solicitation-details.test.tsx`

1. Testar navegação do card.
2. Testar estados iniciais dos accordions.
3. Testar expansão do perfil e dos dados.
4. Testar aceite e recusa.
5. Executar e confirmar as falhas.

### Task 2: Criar modelo e componentes

**Files:**
- Create: `src/components/lawyer-solicitation-details/mock-lawyer-solicitation-details.ts`
- Create: `src/components/lawyer-solicitation-details/lawyer-detail-accordion-shell.component.tsx`
- Create: `src/components/lawyer-solicitation-details/lawyer-client-profile-accordion.component.tsx`
- Create: `src/components/lawyer-solicitation-details/lawyer-solicitation-data-accordion.component.tsx`
- Create: `src/components/lawyer-solicitation-details/lawyer-solicitation-description-accordion.component.tsx`
- Create: `src/components/lawyer-solicitation-details/lawyer-client-contacts-card.component.tsx`
- Create: `src/components/lawyer-solicitation-details/index.ts`

1. Enriquecer os mocks existentes.
2. Implementar shell acessível.
3. Implementar cada bloco separado.

### Task 3: Montar rota e navegação

**Files:**
- Create: `src/app/lawyer/solicitacao/[id].tsx`
- Modify: `src/app/lawyer/(tabs)/index.tsx`

1. Montar cabeçalho e conteúdo.
2. Coordenar aceite e recusa.
3. Navegar pelos cards.
4. Executar suíte completa, lint direcionado e bundle iOS.

