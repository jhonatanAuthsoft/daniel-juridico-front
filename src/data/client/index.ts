export type {
  DocumentTypeApi,
  PronounsApi,
  RegisterClientRequest,
  RegisterClientResult,
  RegisterClientUserWire,
  RegisterClientWireResponse,
  UpdateClientAddressParams,
  UpdateClientGeneralDataParams,
  UpdateClientPersonalProfileParams,
} from './client.types';
export type { ApiErrorItem, ApiResponse } from '@/data/http';
export {
  mapClientSignupFormToRegisterRequest,
  mapPronounsToApi,
  mapRegisterClientWireToResult,
  mapUpdateClientAddressToWire,
  mapUpdateClientGeneralDataToWire,
  mapUpdateClientPersonalProfileToWire,
  toIsoBirthDate,
} from './client.mapper';
export {
  registerClient,
  updateClientAddress,
  updateClientGeneralData,
  updateClientPersonalProfile,
} from './client.api';
