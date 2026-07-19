# Client Solicitation Details Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Abrir uma tela de detalhes ao tocar em uma solicitação do cliente.

**Architecture:** A rota dinâmica `/client/solicitacao/[id]` busca dados mockados pelo identificador. A interface é composta por três componentes exclusivos do fluxo do cliente, sem compartilhamento com o futuro detalhe acessado pelo advogado.

**Tech Stack:** Expo Router, React Native, TypeScript, React Native Testing Library.

---

## Design

- `ClientSolicitationDataAccordion`: dados estruturados da solicitação, aberto inicialmente.
- `ClientSolicitationDescriptionAccordion`: descrição textual, fechado inicialmente.
- `ClientCompatibleLawyersList`: advogados mockados, avatares por iniciais e ação de solicitar conexão.
- A rota contém cabeçalho com voltar e ação de cancelar.
- Os cards da home navegam com o `id` da solicitação.
- O fluxo do advogado não reutiliza estes componentes, pois terá regras e ações diferentes.

## Tarefas

1. Criar testes dos accordions, lista e navegação.
2. Confirmar que falham pela ausência da funcionalidade.
3. Implementar modelos e mocks do detalhe.
4. Implementar os três componentes exclusivos do cliente.
5. Criar a rota dinâmica e conectar os cards da home.
6. Executar testes, lint e export iOS.

