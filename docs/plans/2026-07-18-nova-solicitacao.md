# Nova solicitação do cliente Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Criar o formulário de nova solicitação do cliente com filtros avançados e tratamento de envio offline.

**Architecture:** Uma rota irmã de `(tabs)` contém o formulário com React Hook Form. O envio consulta NetInfo e alterna para um componente reutilizável de erro quando não há conexão.

**Tech Stack:** Expo 57, Expo Router, React Native 0.86, TypeScript, React Hook Form, NetInfo, Jest e React Native Testing Library.

---

### Task 1: Dependências e infraestrutura de testes

**Files:**
- Modify: `package.json`
- Modify: lockfile do projeto
- Create: `jest.config.js`
- Create: `jest.setup.js`

1. Instalar NetInfo com `npx expo install @react-native-community/netinfo`.
2. Instalar Jest, `jest-expo` e React Native Testing Library como dependências de desenvolvimento.
3. Configurar o script `test` e o preset `jest-expo`.
4. Executar um teste vazio para confirmar que o runner inicia corretamente.

### Task 2: Componente de erro de conexão

**Files:**
- Create: `src/components/connection-error/connection-error.component.tsx`
- Create: `src/components/connection-error/index.ts`
- Test: `src/components/connection-error/connection-error.component.test.tsx`

1. Escrever testes para título, mensagem e acionamento de “Tente novamente”.
2. Executar os testes e confirmar falha pela ausência do componente.
3. Implementar o layout responsivo, área reservada para ícone e botão.
4. Executar os testes e confirmar sucesso.

### Task 3: Formulário e filtros avançados

**Files:**
- Create: `src/app/client/nova-solicitacao.tsx`
- Create: `src/components/client-solicitation-form/client-solicitation-form.component.tsx`
- Create: `src/components/client-solicitation-form/client-solicitation-form.options.ts`
- Create: `src/components/client-solicitation-form/index.ts`
- Test: `src/components/client-solicitation-form/client-solicitation-form.component.test.tsx`

1. Escrever testes para campos obrigatórios, contador de 800 caracteres e expansão dos filtros avançados.
2. Executar os testes e confirmar falha pela ausência do formulário.
3. Implementar o formulário com os átomos existentes, opções locais e layout das referências.
4. Executar os testes e confirmar sucesso.

### Task 4: Verificação de conectividade no envio

**Files:**
- Modify: `src/components/client-solicitation-form/client-solicitation-form.component.tsx`
- Test: `src/components/client-solicitation-form/client-solicitation-form.component.test.tsx`

1. Escrever testes com NetInfo mockado para envio offline e nova tentativa online/offline.
2. Executar os testes e confirmar falha pelo comportamento ausente.
3. Consultar `NetInfo.fetch()` no envio e na nova tentativa.
4. Mostrar `ConnectionError` offline e concluir via callback online.
5. Executar os testes e confirmar sucesso.

### Task 5: Navegação a partir da aba

**Files:**
- Modify: `src/app/client/(tabs)/index.tsx`
- Test: `src/app/client/(tabs)/index.test.tsx`

1. Escrever teste para o CTA navegar a `/client/nova-solicitacao`.
2. Executar e confirmar falha porque o `onPress` atual está vazio.
3. Implementar navegação tipada com Expo Router.
4. Executar o teste e confirmar sucesso.

### Task 6: Verificação final

1. Executar `npm test`.
2. Executar `npm run lint`.
3. Executar `npx tsc --noEmit`.
4. Verificar manualmente no Expo: abrir formulário, expandir filtros, preencher, enviar offline e tentar novamente.

