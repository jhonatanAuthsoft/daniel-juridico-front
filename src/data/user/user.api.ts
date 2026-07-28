import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
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
 * Uses the authenticated HTTP middleware (proactive refresh).
 * `POST /usuarios/aceitar-termos`
 */
export async function acceptTerms(
  params: AcceptTermsParams,
  signal?: AbortSignal,
): Promise<AcceptTermsResult> {
  const response = await authenticatedHttpRequest<ApiResponse<AcceptTermsWireResponse>>(
    apiUrl('/usuarios/aceitar-termos'),
    {
      method: 'POST',
      body: mapAcceptTermsParamsToWire(params),
      signal,
    },
  );

  const data = assertApiSuccess(response, 'Falha ao aceitar os termos.');
  return mapAcceptTermsWireToResult(data);
}
