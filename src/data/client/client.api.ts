import {
  apiUrl,
  assertApiSuccess,
  httpRequest,
  type ApiResponse,
} from '@/data/http';

import { mapRegisterClientWireToResult } from './client.mapper';
import type {
  RegisterClientRequest,
  RegisterClientResult,
  RegisterClientWireResponse,
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
