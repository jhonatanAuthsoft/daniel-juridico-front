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
export type {
  PublicLawyerCatalogItem,
  PublicLawyerOab,
  PublicLawyerProfile,
  PublicLawyerProfileWire,
} from './public-profile.types';
export type {
  CreateLawyerReviewInput,
  CreateLawyerReviewResult,
  DeleteLawyerReviewResult,
  LawyerReview,
  LawyerReviewsResult,
  ListLawyerReviewsParams,
} from './reviews.types';
export {
  mapBillingMethodToApi,
  mapLawyerSignupFormToRegisterRequest,
  mapPracticeAreaToModalidade,
  mapRegisterLawyerWireToResult,
  mapSpecialtiesToApi,
  mapTreatmentPronounToApi,
} from './lawyer.mapper';
export {
  formatPublicLawyerEducation,
  formatPublicLawyerModalities,
  formatPublicLawyerOabLabel,
  formatPublicLawyerRegistration,
  mapPublicLawyerProfileWireToResult,
} from './public-profile.mapper';
export {
  mapLawyerReviewsToClientReviews,
  mapLawyerReviewsWireToResult,
} from './reviews.mapper';
export { registerLawyer } from './lawyer.api';
export { getPublicLawyerProfile } from './public-profile.api';
export {
  createLawyerReview,
  deleteLawyerReview,
  listLawyerReviews,
} from './reviews.api';
