import type {
  AcceptTermsParams,
  AcceptTermsResult,
  AcceptTermsWireRequest,
  AcceptTermsWireResponse,
  UpdatePreferencesParams,
  UpdatePreferencesResult,
  UpdatePreferencesWireRequest,
  UpdatePreferencesWireResponse,
  UpdateProfilePhotoParams,
  UpdateProfilePhotoResult,
  UpdateProfilePhotoWireRequest,
  UpdateProfilePhotoWireResponse,
  UpdatePasswordParams,
  UpdatePasswordResult,
  UpdatePasswordWireRequest,
  UpdatePasswordWireResponse,
} from './user.types';
import { TERMS_VERSION } from './user.types';

export function mapAcceptTermsParamsToWire(
  params: AcceptTermsParams,
): AcceptTermsWireRequest {
  return {
    checkboxConfirmado: params.checkboxConfirmed,
    scrollConfirmado: params.scrollConfirmed ?? false,
    versao: params.version ?? TERMS_VERSION,
  };
}

export function mapAcceptTermsWireToResult(
  response: AcceptTermsWireResponse,
): AcceptTermsResult {
  return {
    id: response.id,
    userId: response.usuarioId,
    version: response.versao,
    scrollConfirmed: response.scrollConfirmado,
    checkboxConfirmed: response.checkboxConfirmado,
    acceptedAt: response.aceitoEm,
    termsAccepted: response.termosAceitos,
  };
}

export function mapUpdatePreferencesParamsToWire(
  params: UpdatePreferencesParams,
): UpdatePreferencesWireRequest {
  return {
    notificacoesPushHabilitadas: params.pushNotificationsEnabled,
  };
}

export function mapUpdatePreferencesWireToResult(
  response: UpdatePreferencesWireResponse,
): UpdatePreferencesResult {
  return {
    pushNotificationsEnabled: Boolean(response.notificacoesPushHabilitadas),
  };
}

export function mapUpdateProfilePhotoParamsToWire(
  params: UpdateProfilePhotoParams,
): UpdateProfilePhotoWireRequest {
  return {
    fotoUrl: params.photoKey.trim(),
  };
}

export function mapUpdateProfilePhotoWireToResult(
  response: UpdateProfilePhotoWireResponse,
): UpdateProfilePhotoResult {
  return {
    photoKey: response.fotoUrl.trim(),
  };
}

export function mapUpdatePasswordParamsToWire(
  params: UpdatePasswordParams,
): UpdatePasswordWireRequest {
  return {
    senhaAtual: params.currentPassword,
    novaSenha: params.newPassword,
  };
}

export function mapUpdatePasswordWireToResult(
  response: UpdatePasswordWireResponse,
): UpdatePasswordResult {
  return {
    message: response.mensagem,
  };
}
