export type {
  DocumentTypeApi,
  PronounsApi,
  RegisterClientRequest,
  RegisterClientResult,
  RegisterClientUserWire,
  RegisterClientWireResponse,
} from './client.types';
export type { ApiErrorItem, ApiResponse } from '@/data/http';
export {
  mapClientSignupFormToRegisterRequest,
  mapPronounsToApi,
  mapRegisterClientWireToResult,
  toIsoBirthDate,
} from './client.mapper';
export { registerClient } from './client.api';
