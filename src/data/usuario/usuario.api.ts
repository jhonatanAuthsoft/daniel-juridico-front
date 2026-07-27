import { apiUrl } from '@/data/http/api-config';
import { httpRequest } from '@/data/http/http-client';

import type {
  AceitarTermosRequest,
  AceitarTermosResponse,
  ApiResponse,
} from './usuario.types';

/**
 * Registers terms acceptance for the authenticated user.
 * `POST /usuarios/aceitar-termos`
 */
export async function aceitarTermos(
  body: AceitarTermosRequest,
  token: string,
  signal?: AbortSignal,
): Promise<AceitarTermosResponse> {
  const response = await httpRequest<ApiResponse<AceitarTermosResponse>>(
    apiUrl('/usuarios/aceitar-termos'),
    {
      method: 'POST',
      body,
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.success || !response.data) {
    throw new Error(response.message ?? 'Falha ao aceitar os termos.');
  }

  return response.data;
}
