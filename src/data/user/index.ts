export type {
  AcceptTermsParams,
  AcceptTermsResult,
  AcceptTermsWireRequest,
  AcceptTermsWireResponse,
  UpdatePreferencesParams,
  UpdatePreferencesResult,
  UpdatePreferencesWireRequest,
  UpdatePreferencesWireResponse,
} from './user.types';
export { TERMS_VERSION } from './user.types';
export {
  mapAcceptTermsParamsToWire,
  mapAcceptTermsWireToResult,
  mapUpdatePreferencesParamsToWire,
  mapUpdatePreferencesWireToResult,
} from './user.mapper';
export { acceptTerms, updatePreferences } from './user.api';
