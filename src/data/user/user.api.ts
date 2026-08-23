import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  type ApiResponse,
} from '@/data/http';

import {
  mapAcceptTermsParamsToWire,
  mapAcceptTermsWireToResult,
  mapUpdatePreferencesParamsToWire,
  mapUpdatePreferencesWireToResult,
} from './user.mapper';
import type {
  AcceptTermsParams,
  AcceptTermsResult,
  AcceptTermsWireResponse,
  UpdatePreferencesParams,
  UpdatePreferencesResult,
  UpdatePreferencesWireResponse,
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

/**
 * Updates push notification preference for the authenticated user.
 * `PATCH /usuarios/me/preferencias`
 */
export async function updatePreferences(
  params: UpdatePreferencesParams,
  signal?: AbortSignal,
): Promise<UpdatePreferencesResult> {
  const response = await authenticatedHttpRequest<
    ApiResponse<UpdatePreferencesWireResponse>
  >(apiUrl('/usuarios/me/preferencias'), {
    method: 'PATCH',
    body: mapUpdatePreferencesParamsToWire(params),
    signal,
  });

  const data = assertApiSuccess(
    response,
    'Não foi possível atualizar as preferências.',
  );
  return mapUpdatePreferencesWireToResult(data);
}
