# Conta do advogado

## Objetivo

Substituir o mock de perfil do advogado pela tela Conta conforme o design.

## Design

- Título “Conta”, foto circular `profile.png` com ação de editar visual, nome e e-mail.
- Links: Editar Dados, Alterar Senha, Assinatura e plano, Termos e condições (somente visual).
- Toggles locais: Notificações e Tornar Perfil indisponível.
- Botão “Sair da conta” faz sign-out e volta ao login.
- Rota exclusiva do advogado; o cliente mantém o perfil mock atual.
- Foto `professional-image-placeholder.png` copiada como `profile.png`.
