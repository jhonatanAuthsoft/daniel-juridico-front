export type {
  OabWireRequest,
  PostgraduateWireRequest,
  PracticeAreaWireRequest,
  RegisterLawyerRequest,
  RegisterLawyerResult,
  RegisterLawyerUserWire,
  RegisterLawyerWireResponse,
  SpecialtyWireRequest,
  TreatmentPronounApi,
} from './lawyer.types';
export {
  mapBillingMethodToApi,
  mapLawyerSignupFormToRegisterRequest,
  mapPracticeAreaToModalidade,
  mapRegisterLawyerWireToResult,
  mapSpecialtiesToApi,
  mapTreatmentPronounToApi,
} from './lawyer.mapper';
export { registerLawyer } from './lawyer.api';
