import type {
  RequestPasswordRecoveryParams,
  RequestPasswordRecoveryResult,
  RequestPasswordRecoveryWireRequest,
  RequestPasswordRecoveryWireResponse,
  ResetPasswordParams,
  ResetPasswordResult,
  ResetPasswordWireRequest,
  ResetPasswordWireResponse,
  ValidateRecoveryCodeParams,
  ValidateRecoveryCodeResult,
  ValidateRecoveryCodeWireRequest,
  ValidateRecoveryCodeWireResponse,
} from './password-recovery.types';

export function mapRequestPasswordRecoveryParamsToWire(
  params: RequestPasswordRecoveryParams,
): RequestPasswordRecoveryWireRequest {
  return {
    email: params.email.trim().toLowerCase(),
  };
}

export function mapRequestPasswordRecoveryWireToResult(
  response: RequestPasswordRecoveryWireResponse,
): RequestPasswordRecoveryResult {
  return {
    message: response.mensagem,
    waitSeconds: response.aguardarSegundos ?? null,
  };
}

export function mapValidateRecoveryCodeParamsToWire(
  params: ValidateRecoveryCodeParams,
): ValidateRecoveryCodeWireRequest {
  return {
    email: params.email.trim().toLowerCase(),
    codigo: params.code.trim(),
  };
}

export function mapValidateRecoveryCodeWireToResult(
  response: ValidateRecoveryCodeWireResponse,
): ValidateRecoveryCodeResult {
  return {
    valid: Boolean(response.valido),
    message: response.mensagem,
  };
}

export function mapResetPasswordParamsToWire(
  params: ResetPasswordParams,
): ResetPasswordWireRequest {
  return {
    email: params.email.trim().toLowerCase(),
    codigo: params.code.trim(),
    novaSenha: params.newPassword,
    confirmarSenha: params.newPassword,
  };
}

export function mapResetPasswordWireToResult(
  response: ResetPasswordWireResponse,
): ResetPasswordResult {
  return {
    message: response.mensagem,
  };
}
