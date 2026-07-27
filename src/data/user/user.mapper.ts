import type {
  AcceptTermsParams,
  AcceptTermsResult,
  AcceptTermsWireRequest,
  AcceptTermsWireResponse,
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
