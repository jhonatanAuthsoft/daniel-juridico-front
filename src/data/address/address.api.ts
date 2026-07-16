import { httpRequest } from '@/data/http';

import { mapViaCepToAddress } from './address.mapper';
import type { AddressByCep, ViaCepResponse } from './address.types';

const VIA_CEP_BASE_URL = 'https://viacep.com.br/ws';

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function isValidCep(value: string) {
  return onlyDigits(value).length === 8;
}

/**
 * Fetches address data by CEP via ViaCEP.
 * All network access for address goes through the shared http client.
 */
export async function fetchAddressByCep(
  cep: string,
  signal?: AbortSignal,
): Promise<AddressByCep> {
  const digits = onlyDigits(cep);

  if (digits.length !== 8) {
    throw new Error('CEP deve conter 8 dígitos.');
  }

  const response = await httpRequest<ViaCepResponse>(
    `${VIA_CEP_BASE_URL}/${digits}/json/`,
    { signal },
  );

  if (response.erro === true || response.erro === 'true') {
    throw new Error('CEP não encontrado.');
  }

  return mapViaCepToAddress(response);
}
