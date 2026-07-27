# Integração — cadastro de advogado (app ↔ server)

## O que foi feito

- **Camadas novas** seguindo o padrão do cliente:
  - `data/lawyer/` — `lawyer.types.ts` (wire DTOs), `lawyer.mapper.ts` (form → payload), `lawyer.api.ts` (`POST /advogados/cadastrar`).
  - `domain/lawyer/` — `registerLawyerUseCase` + `useRegisterLawyer` (persiste sessão via `signInWithSession`).
  - `app/signup/lawyer.tsx` — submit no último step; sucesso navega para `/signup/terms?profile=lawyer`.
- **Data de expedição da OAB** — campo novo no step 4 (principal e suplementares). `atuacaoDesde` é derivado da expedição da OAB principal (decisão de produto).
- **Pronome de tratamento** — opções agora são Doutor / Doutora / Neutro (`TREATMENT_PRONOUN_OPTIONS`), valores iguais ao `PronomeTratamentoEnum` do server.
- **Especialidades** — catálogo completo (16 especialidades + subespecialidades) em `specialties.data.ts`, com códigos alinhados ao server (migration `V7__catalogo_especialidades_completo.sql`). O id do filho é `CODIGO:SUBCODIGO`; o mapper deriva `especialidadeCodigo`/`subespecialidadeCodigo` com `parseSpecialtyId`.
- **`nomePai` opcional** — server (`V7`, DTO, entity, service) aceita nulo; app omite quando "não tenho nome do pai" está marcado.
- **Cidade** — selects guardam slug (`sao-paulo`); `cityLabelFromValue` converte para o nome (`São Paulo`) antes de enviar (endereço e área de atuação). Aplicado também no mapper do cliente.
- **Compartilhado** — `data/shared/` com `toIsoDate` (datas `DD/MM/AAAA` → `AAAA-MM-DD`) e `MOCK_PHOTO_URL`, reutilizados pelos mappers de cliente e advogado.

## Pendências

### 1. Upload de fotos
Foto de perfil e fotos das carteiras OAB (frente/verso) vão como `https://mock-example.com` (`MOCK_PHOTO_URL`). Substituir quando existir endpoint/storage de upload.

### 2. Validação do formulário
O form ainda avança de step sem validação obrigatória (ex.: data de expedição vazia derruba `atuacaoDesde`, que é obrigatório no server). O erro da API é exibido em `Alert`, mas vale validar por step no app.

### 3. Nome da especialidade "Direito Penal"
A migration V7 renomeia `CRIMINAL` de "Direito Criminal" para "Direito Penal" (o código continua `CRIMINAL`). A lista de referência tinha "Obrigações" e "Direito das Obrigações" duplicados — mantido só `OBRIGACOES` ("Direito das Obrigações").
