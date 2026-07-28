import {
  apiUrl,
  assertApiSuccess,
  httpRequest,
  type ApiResponse,
} from '@/data/http';

import { getOrCreateDeviceId } from './device-id';
import { mapLoginParamsToWire, mapLoginWireToResult } from './login.mapper';
import type {
  LoginParams,
  LoginResult,
  LoginWireResponse,
} from './login.types';

/**
 * Authenticates with e-mail + password (+ deviceId).
 * `POST /usuarios/login`
 */
export async function login(
  params: LoginParams,
  signal?: AbortSignal,
): Promise<LoginResult> {
  const deviceId = params.deviceId?.trim() || (await getOrCreateDeviceId());
  const response = await httpRequest<ApiResponse<LoginWireResponse>>(
    apiUrl('/usuarios/login'),
    {
      method: 'POST',
      body: mapLoginParamsToWire({ ...params, deviceId }),
      signal,
    },
  );

  const data = assertApiSuccess(response, 'Usuário ou senha inválidos');
  return mapLoginWireToResult(data);
}
