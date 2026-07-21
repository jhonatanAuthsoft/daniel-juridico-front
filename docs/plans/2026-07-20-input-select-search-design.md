# InputSelectField — options glass + busca

## Objetivo

Ajustar o menu de opções do select e permitir filtrar por texto.

## Design

- Manter o trigger atual (campo pill com glass).
- Painel de opções com tokens existentes:
  - `borderRadius: Radius.medium` (16)
  - `borderColor: BrandColors.accessory.darkBlue` (#494266)
  - fundo `GlassBackground` + `BrandGradients.gradient`
- Cada opção: checkbox (vazio/marcado) + label; divisórias entre itens.
- Campo de busca no topo do painel (mesmo visual glass do trigger), filtrando `options` por label.
- Sem lib externa (react-select é web); evoluir o componente nativo atual.
