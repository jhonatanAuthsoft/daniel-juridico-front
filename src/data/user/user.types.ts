/** Matches server `TermosConstants.VERSAO_ATUAL`. */
export const TERMS_VERSION = 'v1';

/**
 * App-facing params for accepting terms (English).
 * Mapped to the API wire body in `user.mapper`.
 */
export type AcceptTermsParams = {
  checkboxConfirmed: boolean;
  scrollConfirmed?: boolean;
  version?: string;
};

/**
 * Wire body for `POST /usuarios/aceitar-termos` (server field names).
 */
export type AcceptTermsWireRequest = {
  checkboxConfirmado: boolean;
  scrollConfirmado?: boolean;
  versao?: string;
};

/**
 * Wire response for `POST /usuarios/aceitar-termos` (server field names).
 */
export type AcceptTermsWireResponse = {
  id: string;
  usuarioId: string;
  versao: string;
  scrollConfirmado: boolean;
  checkboxConfirmado: boolean;
  aceitoEm: string;
  termosAceitos: boolean;
};

/** Domain-friendly view of the accept-terms response. */
export type AcceptTermsResult = {
  id: string;
  userId: string;
  version: string;
  scrollConfirmed: boolean;
  checkboxConfirmed: boolean;
  acceptedAt: string;
  termsAccepted: boolean;
};

/** App-facing params for `PATCH /usuarios/me/preferencias`. */
export type UpdatePreferencesParams = {
  pushNotificationsEnabled: boolean;
};

/** Wire body for `PATCH /usuarios/me/preferencias`. */
export type UpdatePreferencesWireRequest = {
  notificacoesPushHabilitadas: boolean;
};

/** Wire response for `PATCH /usuarios/me/preferencias`. */
export type UpdatePreferencesWireResponse = {
  notificacoesPushHabilitadas: boolean;
};

/** Domain-friendly view of preferences. */
export type UpdatePreferencesResult = {
  pushNotificationsEnabled: boolean;
};

/** App-facing params for `PATCH /usuarios/me/foto`. */
export type UpdateProfilePhotoParams = {
  photoKey: string;
};

/** Wire body for `PATCH /usuarios/me/foto`. */
export type UpdateProfilePhotoWireRequest = {
  fotoUrl: string;
};

/** Wire response for `PATCH /usuarios/me/foto`. */
export type UpdateProfilePhotoWireResponse = {
  fotoUrl: string;
};

/** Domain-friendly view of the updated profile photo. */
export type UpdateProfilePhotoResult = {
  photoKey: string;
};

/** App-facing params for `PATCH /usuarios/me/senha`. */
export type UpdatePasswordParams = {
  currentPassword: string;
  newPassword: string;
};

/** Wire body for `PATCH /usuarios/me/senha`. */
export type UpdatePasswordWireRequest = {
  senhaAtual: string;
  novaSenha: string;
};

/** Wire response for `PATCH /usuarios/me/senha`. */
export type UpdatePasswordWireResponse = {
  mensagem: string;
};

/** Domain-friendly view of the password update. */
export type UpdatePasswordResult = {
  message: string;
};
