import { httpRequest } from '@/data/http';
import type { SelectOption } from '@/constants/select-options';

import type { BrasilApiMunicipio } from './cities.types';

const BRASIL_API_MUNICIPIOS_URL = 'https://brasilapi.com.br/api/ibge/municipios/v1';

/** BrasilAPI/IBGE often returns ALL CAPS; normalize for UI and API payloads. */
function toTitleCasePt(value: string): string {
  return value
    .toLocaleLowerCase('pt-BR')
    .replace(/(^|[\s'-])(\S)/g, (_match, sep: string, char: string) => {
      return `${sep}${char.toLocaleUpperCase('pt-BR')}`;
    });
}

/**
 * Lists municipalities for a Brazilian UF via BrasilAPI (IBGE).
 */
export async function fetchCitiesByUf(
  uf: string,
  signal?: AbortSignal,
): Promise<SelectOption[]> {
  const normalized = uf.trim().toUpperCase();
  if (!normalized || normalized.length !== 2) {
    return [];
  }

  const response = await httpRequest<BrasilApiMunicipio[]>(
    `${BRASIL_API_MUNICIPIOS_URL}/${normalized}`,
    { signal },
  );

  return response
    .map((item) => {
      const name = toTitleCasePt(item.nome.trim());
      return { value: name, label: name };
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
}
