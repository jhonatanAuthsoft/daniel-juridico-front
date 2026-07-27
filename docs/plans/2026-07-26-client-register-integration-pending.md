# Pendências — cadastro de cliente (app ↔ server)

## 1. Aceite de termos — feito
- Cadastro não envia mais `aceiteTermos`.
- App chama `POST /usuarios/aceitar-termos` via `acceptTerms` (usuário autenticado).
- Sessão guarda `termsAccepted` a partir do mapeamento de `usuario.termosAceitos`.
- `TermsGuard` nas shells `/client` e `/lawyer` redireciona para `/signup/terms` se ainda não aceitou.

## 2. Mapeamento de pronomes
Front: `ele-dele` | `ela-dela` | `elu-delu` | `nao-informar`  
API: `ELE` | `ELA` | `NEUTRO`

Mapeamento temporário em `mapPronounsToApi`:
- `ele-dele` → `ELE`
- `ela-dela` → `ELA`
- `elu-delu` / `nao-informar` / default → `NEUTRO`

**Analisar:** alinhar enums do front com o server (e se “prefiro não informar” deve existir na API).

## 3. Upload de fotos
Todas as fotos de cliente estão sendo enviadas como `fotoUrl: "https://mock-example.com"` só para aparecer no banco e lembrar o gap.

**Próximo passo:**
- Endpoint/storage de upload.
- Substituir o mock pela URL real após o upload (perfil e documentos).

## 4. Base URL
Configurada em `app/.env` via `EXPO_PUBLIC_API_BASE_URL` (exemplo: `http://localhost:8080`).  
No emulador Android, usar `http://10.0.2.2:8080` (comentado em `.env.example`).
