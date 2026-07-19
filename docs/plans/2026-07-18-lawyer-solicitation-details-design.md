# Detalhe da solicitação na visão do advogado

## Objetivo

Permitir que o advogado abra uma solicitação da home, consulte cliente e demanda e aceite ou recuse o atendimento.

## Design aprovado

- Rota exclusiva `/lawyer/solicitacao/[id]`.
- `LawyerClientProfileAccordion`: foto, nome, localização, pronomes, estado civil, profissão e renda.
- `LawyerSolicitationDataAccordion`: urgência, área, especialidades, localização e cobrança.
- `LawyerSolicitationDescriptionAccordion`: descrição completa, aberta inicialmente.
- `LawyerClientContactsCard`: telefone e e-mail, mostrado somente após aceite.
- Perfil e dados começam recolhidos.
- “Aceitar solicitação” atualiza o estado local e substitui as ações pelos contatos.
- “Recusar” retorna para a lista.
- Os componentes são exclusivos da visão do advogado e não reutilizam o comportamento do detalhe do cliente.

## Dependências

React Native, Expo Router, Expo Image e Expo Symbols já instalados. Nenhuma nova biblioteca.

