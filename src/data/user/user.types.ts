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
