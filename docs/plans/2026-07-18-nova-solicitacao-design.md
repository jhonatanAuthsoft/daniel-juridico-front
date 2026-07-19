# Design: Nova solicitação do cliente

## Objetivo

Permitir que o cliente abra um formulário de nova solicitação a partir da aba de solicitações, preencha os dados principais e filtros avançados e receba uma tela de erro quando tentar enviar sem conexão.

## Navegação

O CTA “+ Nova solicitação” abre `/client/nova-solicitacao`, rota protegida pelo layout do cliente e exibida fora da tab bar. Fechar retorna à lista. Um envio válido e online também retorna à lista, sem persistência nesta entrega.

## Formulário

O formulário usa React Hook Form e os campos atômicos existentes:

- Título da demanda
- Atuação
- Especialidade
- Estado
- Cidade
- Grau de urgência
- Problema, limitado a 800 caracteres

“Filtros avançados” expande e recolhe:

- Subespecialidade
- Forma de cobrança
- Tempo mínimo de experiência em meses

Os seletores usam opções locais de demonstração. O botão de envio permanece desabilitado até os campos obrigatórios estarem válidos.

## Conectividade

No envio, `@react-native-community/netinfo` consulta a conectividade atual. Quando offline, o formulário é substituído por um componente reutilizável de erro de conexão. “Tente novamente” repete a consulta: se continuar offline, mantém a tela; se estiver online, conclui o fluxo e volta à lista.

O componente reserva uma área para o ícone, que será fornecido posteriormente.

## Testes e verificação

Como o projeto ainda não possui infraestrutura de testes, a entrega adicionará uma configuração mínima de Jest e React Native Testing Library antes da implementação. Serão cobertos:

- abertura da rota pelo CTA;
- expansão e recolhimento dos filtros avançados;
- limite do campo de problema;
- envio offline mostrando o erro;
- nova tentativa offline mantendo o erro;
- nova tentativa online concluindo o fluxo.

