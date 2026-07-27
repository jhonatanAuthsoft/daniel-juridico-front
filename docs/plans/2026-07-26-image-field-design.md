# Image field — galeria, edição e preview

## Objetivo

Padronizar campos de imagem: galeria → edição (recorte/rotação) → preview; upload depois.

## Fluxo

1. Toque abre a galeria do device.
2. Após selecionar, abre **um único modal** no estilo crop iOS:
   - imagem full-screen
   - grade 3×3 + handles nos cantos/lados
   - áreas fora do recorte escurecidas
   - barra inferior: **Cancelar** · girar · **Salvar**
3. Arrastar/pinçar move a imagem; handles redimensionam o frame (com `aspect` trava proporção).
4. URI final fica no form (pronta para upload futuro).
5. Preview: imagem grande + thumbnail com lixeira.
6. Botão `+` só quando `multiple` é true.

## API

- `ImageField` — UI controlada (`value` / `onChange`)
- `InputImageField` — integração com react-hook-form (`name`)
- `multiple?: boolean` — single `string` ou `string[]`
- `aspect?: [number, number]` — proporção do frame de recorte (padrão **1×1**)
