import {
  apiUrl,
  assertApiSuccess,
  httpRequest,
  type ApiResponse,
} from '@/data/http';

import {
  mapRequestPasswordRecoveryParamsToWire,
  mapRequestPasswordRecoveryWireToResult,
  mapResetPasswordParamsToWire,
  mapResetPasswordWireToResult,
  mapValidateRecoveryCodeParamsToWire,
  mapValidateRecoveryCodeWireToResult,
} from './password-recovery.mapper';
import type {
  RequestPasswordRecoveryParams,
  RequestPasswordRecoveryResult,
  RequestPasswordRecoveryWireResponse,
  ResetPasswordParams,
  ResetPasswordResult,
  ResetPasswordWireResponse,
  ValidateRecoveryCodeParams,
  ValidateRecoveryCodeResult,
  ValidateRecoveryCodeWireResponse,
} from './password-recovery.types';

/**
 * Requests a 4-digit recovery code by e-mail.
 * `POST /usuarios/recuperar-senha`
 */
export async function requestPasswordRecovery(
  params: RequestPasswordRecoveryParams,
  signal?: AbortSignal,
): Promise<RequestPasswordRecoveryResult> {
  const response = await httpRequest<ApiResponse<RequestPasswordRecoveryWireResponse>>(
    apiUrl('/usuarios/recuperar-senha'),
    {
      method: 'POST',
      body: mapRequestPasswordRecoveryParamsToWire(params),
      signal,
    },
  );

  const data = assertApiSuccess(
    response,
    'Não foi possível solicitar a recuperação de senha.',
  );
  return mapRequestPasswordRecoveryWireToResult(data);
}

/**
 * Validates a recovery code without consuming it.
 * `POST /usuarios/validar-codigo-recuperacao`
 */
export async function validateRecoveryCode(
  params: ValidateRecoveryCodeParams,
  signal?: AbortSignal,
): Promise<ValidateRecoveryCodeResult> {
  const response = await httpRequest<ApiResponse<ValidateRecoveryCodeWireResponse>>(
    apiUrl('/usuarios/validar-codigo-recuperacao'),
    {
      method: 'POST',
      body: mapValidateRecoveryCodeParamsToWire(params),
      signal,
    },
  );

  const data = assertApiSuccess(response, 'Não foi possível validar o código.');
  return mapValidateRecoveryCodeWireToResult(data);
}

/**
 * Resets the password with a valid recovery code.
 * `POST /usuarios/redefinir-senha`
 */
export async function resetPassword(
  params: ResetPasswordParams,
  signal?: AbortSignal,
): Promise<ResetPasswordResult> {
  const response = await httpRequest<ApiResponse<ResetPasswordWireResponse>>(
    apiUrl('/usuarios/redefinir-senha'),
    {
      method: 'POST',
      body: mapResetPasswordParamsToWire(params),
      signal,
    },
  );

  const data = assertApiSuccess(response, 'Não foi possível redefinir a senha.');
  return mapResetPasswordWireToResult(data);
}
