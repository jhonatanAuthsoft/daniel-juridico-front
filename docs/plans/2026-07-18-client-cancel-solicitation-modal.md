# Client Cancel Solicitation Modal Implementation Plan

**Goal:** Confirmar o cancelamento da solicitação com o visual fornecido.

**Architecture:** Um componente modal isolado recebe callbacks de fechar e confirmar. A rota controla apenas sua visibilidade.

**Tech Stack:** React Native, React Native SVG, TypeScript e Jest.

## Tarefas

1. Testar abertura, fechamento e confirmação.
2. Converter `info-alert.tsx` em componente React Native SVG.
3. Criar o modal e impedir quebra das ações.
4. Integrar à rota.
5. Executar testes, lint e bundle iOS.

