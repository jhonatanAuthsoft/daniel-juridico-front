import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  type ApiResponse,
} from '@/data/http';

import { mapMeWireToResult } from './me.mapper';
import type { MeResult, MeWireResponse } from './me.types';

/**
 * Returns the authenticated user profile detail.
 * `GET /usuarios/me`
 */
export async function getMe(signal?: AbortSignal): Promise<MeResult> {
  const response = await authenticatedHttpRequest<ApiResponse<MeWireResponse>>(
    apiUrl('/usuarios/me'),
    {
      method: 'GET',
      signal,
    },
  );

  const data = assertApiSuccess(response, 'Não foi possível carregar o perfil.');
  return mapMeWireToResult(data);
}
