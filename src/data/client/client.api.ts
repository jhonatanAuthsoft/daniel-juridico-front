import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  httpRequest,
  type ApiResponse,
} from '@/data/http';
import type { MeDetalheWire } from '@/data/auth';

import {
  mapRegisterClientWireToResult,
  mapUpdateClientAddressToWire,
  mapUpdateClientGeneralDataToWire,
  mapUpdateClientPersonalProfileToWire,
} from './client.mapper';
import type {
  RegisterClientRequest,
  RegisterClientResult,
  RegisterClientWireResponse,
  UpdateClientAddressParams,
  UpdateClientGeneralDataParams,
  UpdateClientPersonalProfileParams,
} from './client.types';

/**
 * Registers a client user + profile + address.
 * `POST /clientes/cadastrar`
 */
export async function registerClient(
  body: RegisterClientRequest,
  signal?: AbortSignal,
): Promise<RegisterClientResult> {
  const response = await httpRequest<ApiResponse<RegisterClientWireResponse>>(
    apiUrl('/clientes/cadastrar'),
    {
      method: 'POST',
      body,
      signal,
    },
  );

  const data = assertApiSuccess(response, 'Falha ao cadastrar cliente.');
  return mapRegisterClientWireToResult(data);
}

/**
 * Updates the authenticated client's display name.
 * `PATCH /clientes/me/dados-gerais`
 */
export async function updateClientGeneralData(
  params: UpdateClientGeneralDataParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  const response = await authenticatedHttpRequest<ApiResponse<MeDetalheWire>>(
    apiUrl('/clientes/me/dados-gerais'),
    {
      method: 'PATCH',
      body: mapUpdateClientGeneralDataToWire(params),
      signal,
    },
  );
  return assertApiSuccess(response, 'Não foi possível atualizar os dados gerais.');
}

/**
 * Updates the authenticated client's address.
 * `PATCH /clientes/me/endereco`
 */
export async function updateClientAddress(
  params: UpdateClientAddressParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  const response = await authenticatedHttpRequest<ApiResponse<MeDetalheWire>>(
    apiUrl('/clientes/me/endereco'),
    {
      method: 'PATCH',
      body: mapUpdateClientAddressToWire(params),
      signal,
    },
  );
  return assertApiSuccess(response, 'Não foi possível atualizar o endereço.');
}

/**
 * Updates the authenticated client's personal profile.
 * `PATCH /clientes/me/perfil-pessoal`
 */
export async function updateClientPersonalProfile(
  params: UpdateClientPersonalProfileParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  const response = await authenticatedHttpRequest<ApiResponse<MeDetalheWire>>(
    apiUrl('/clientes/me/perfil-pessoal'),
    {
      method: 'PATCH',
      body: mapUpdateClientPersonalProfileToWire(params),
      signal,
    },
  );
  return assertApiSuccess(
    response,
    'Não foi possível atualizar o perfil pessoal.',
  );
}
