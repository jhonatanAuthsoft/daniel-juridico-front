import { apiUrl } from '@/data/http/api-config';
import { httpRequest } from '@/data/http/http-client';

import type {
  ApiResponse,
  CadastrarClienteRequest,
  CadastrarClienteResponse,
} from './client.types';

/**
 * Registers a client user + profile + address.
 * `POST /clientes/cadastrar`
 */
export async function cadastrarCliente(
  body: CadastrarClienteRequest,
  signal?: AbortSignal,
): Promise<CadastrarClienteResponse> {
  const response = await httpRequest<ApiResponse<CadastrarClienteResponse>>(
    apiUrl('/clientes/cadastrar'),
    {
      method: 'POST',
      body,
      signal,
    },
  );

  if (!response.success || !response.data) {
    throw new Error(response.message ?? 'Falha ao cadastrar cliente.');
  }

  return response.data;
}
