import type {
  LoginParams,
  LoginResult,
  LoginWireRequest,
  LoginWireResponse,
} from './login.types';

export function mapLoginParamsToWire(params: LoginParams): LoginWireRequest {
  return {
    email: params.email.trim().toLowerCase(),
    senha: params.password,
    ...(params.deviceId?.trim() ? { deviceId: params.deviceId.trim() } : {}),
  };
}

export function mapLoginWireToResult(response: LoginWireResponse): LoginResult {
  return {
    token: response.token,
    refreshToken: response.refreshToken,
    user: {
      id: response.usuario.id,
      email: response.usuario.email,
      fullName: response.usuario.nomeCompleto,
      profile: response.usuario.perfil,
      phone: response.usuario.telefone ?? undefined,
      termsAccepted: Boolean(response.usuario.termosAceitos),
    },
    raw: response,
  };
}
