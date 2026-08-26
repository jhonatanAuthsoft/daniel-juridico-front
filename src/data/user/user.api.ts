import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  type ApiResponse,
} from '@/data/http';

import {
  mapAcceptTermsParamsToWire,
  mapAcceptTermsWireToResult,
  mapUpdatePasswordParamsToWire,
  mapUpdatePasswordWireToResult,
  mapUpdatePreferencesParamsToWire,
  mapUpdatePreferencesWireToResult,
  mapUpdateProfilePhotoParamsToWire,
  mapUpdateProfilePhotoWireToResult,
} from './user.mapper';
import type {
  AcceptTermsParams,
  AcceptTermsResult,
  AcceptTermsWireResponse,
  UpdatePasswordParams,
  UpdatePasswordResult,
  UpdatePasswordWireResponse,
  UpdatePreferencesParams,
  UpdatePreferencesResult,
  UpdatePreferencesWireResponse,
  UpdateProfilePhotoParams,
  UpdateProfilePhotoResult,
  UpdateProfilePhotoWireResponse,
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

/**
 * Updates the authenticated user's profile photo S3 key.
 * `PATCH /usuarios/me/foto`
 */
export async function updateProfilePhoto(
  params: UpdateProfilePhotoParams,
  signal?: AbortSignal,
): Promise<UpdateProfilePhotoResult> {
  const response = await authenticatedHttpRequest<
    ApiResponse<UpdateProfilePhotoWireResponse>
  >(apiUrl('/usuarios/me/foto'), {
    method: 'PATCH',
    body: mapUpdateProfilePhotoParamsToWire(params),
    signal,
  });

  const data = assertApiSuccess(
    response,
    'Não foi possível atualizar a foto de perfil.',
  );
  return mapUpdateProfilePhotoWireToResult(data);
}

/**
 * Updates the authenticated user's password.
 * `PATCH /usuarios/me/senha`
 */
export async function updatePassword(
  params: UpdatePasswordParams,
  signal?: AbortSignal,
): Promise<UpdatePasswordResult> {
  const response = await authenticatedHttpRequest<
    ApiResponse<UpdatePasswordWireResponse>
  >(apiUrl('/usuarios/me/senha'), {
    method: 'PATCH',
    body: mapUpdatePasswordParamsToWire(params),
    signal,
  });

  const data = assertApiSuccess(response, 'Não foi possível alterar a senha.');
  return mapUpdatePasswordWireToResult(data);
}
