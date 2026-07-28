import {
  apiUrl,
  assertApiSuccess,
  httpRequest,
  type ApiResponse,
} from '@/data/http';

import type {
  RefreshTokensParams,
  RefreshTokensResult,
  RefreshTokensWireResponse,
} from './refresh.types';

/**
 * Rotates access + refresh tokens.
 * Must use raw `httpRequest` (not the authenticated middleware) to avoid recursion.
 * `POST /usuarios/refresh`
 */
export async function refreshTokens(
  params: RefreshTokensParams,
  signal?: AbortSignal,
): Promise<RefreshTokensResult> {
  const response = await httpRequest<ApiResponse<RefreshTokensWireResponse>>(
    apiUrl('/usuarios/refresh'),
    {
      method: 'POST',
      body: {
        token: params.token,
        refreshToken: params.refreshToken,
      },
      signal,
    },
  );

  const data = assertApiSuccess(response, 'Não foi possível renovar a sessão.');
  return {
    token: data.token,
    refreshToken: data.refreshToken,
  };
}
