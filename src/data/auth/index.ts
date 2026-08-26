export type { AuthSession } from './auth-storage';
export {
  clearAuthSessionStore,
  getAuthSessionMemory,
  hydrateAuthSession,
  setAuthSession,
  subscribeAuthSession,
  updateAuthTokens,
  updateAuthUser,
} from './session-store';
export { getOrCreateDeviceId } from './device-id';
export {
  decodeJwtPayload,
  getJwtExpirationMs,
  isAccessTokenExpiringSoon,
} from './jwt';
export {
  ensureFreshAccessToken,
  isRefreshInFlight,
  ACCESS_TOKEN_REFRESH_THRESHOLD_MS,
} from './auth-refresh-controller';
export type {
  LoginParams,
  LoginResult,
  LoginUserWire,
  LoginWireRequest,
  LoginWireResponse,
} from './login.types';
export { mapLoginParamsToWire, mapLoginWireToResult } from './login.mapper';
export { login } from './login.api';
export { checkEmailAvailability } from './email-availability.api';
export type { EmailAvailabilityWire } from './email-availability.api';
export type {
  ClientDocumentType,
  ClientEditProfile,
  LawyerEditOabEntry,
  LawyerEditProfile,
  MeDetalheWire,
  MeResult,
  MeWireResponse,
} from './me.types';
export { mapMeWireToResult, mergeAdvogadoDetalheIntoMe, mergeClienteDetalheIntoMe } from './me.mapper';
export { getMe } from './me.api';
export type {
  RefreshTokensParams,
  RefreshTokensResult,
} from './refresh.types';
export { refreshTokens } from './refresh.api';

/** @deprecated Prefer setAuthSession / hydrateAuthSession from session-store. */
export {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
} from './auth-storage';
