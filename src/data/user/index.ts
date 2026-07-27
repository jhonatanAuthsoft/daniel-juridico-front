export type {
  AcceptTermsParams,
  AcceptTermsResult,
  AcceptTermsWireRequest,
  AcceptTermsWireResponse,
} from './user.types';
export { TERMS_VERSION } from './user.types';
export {
  mapAcceptTermsParamsToWire,
  mapAcceptTermsWireToResult,
} from './user.mapper';
export { acceptTerms } from './user.api';
