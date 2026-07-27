import {
  apiUrl,
  assertApiSuccess,
  httpRequest,
  type ApiResponse,
} from '@/data/http';

import {
  mapAcceptTermsParamsToWire,
  mapAcceptTermsWireToResult,
} from './user.mapper';
import type {
  AcceptTermsParams,
  AcceptTermsResult,
  AcceptTermsWireResponse,
} from './user.types';

/**
 * Registers terms acceptance for the authenticated user.
 * `POST /usuarios/aceitar-termos`
 */
export async function acceptTerms(
  params: AcceptTermsParams,
  token: string,
  signal?: AbortSignal,
): Promise<AcceptTermsResult> {
  const response = await httpRequest<ApiResponse<AcceptTermsWireResponse>>(
    apiUrl('/usuarios/aceitar-termos'),
    {
      method: 'POST',
      body: mapAcceptTermsParamsToWire(params),
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = assertApiSuccess(response, 'Falha ao aceitar os termos.');
  return mapAcceptTermsWireToResult(data);
}
