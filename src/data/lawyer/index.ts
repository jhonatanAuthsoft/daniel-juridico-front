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
  UpdateLawyerAddressParams,
  UpdateLawyerBiographyParams,
  UpdateLawyerBillingParams,
  UpdateLawyerDocumentationParams,
  UpdateLawyerGeneralDataParams,
  UpdateLawyerGraduationParams,
  UpdateLawyerAvailabilityParams,
  UpdateLawyerPracticeAreasParams,
  UpdateLawyerSpecialtiesParams,
  UpdateLawyerServiceAreasParams,
  UpdateLawyerOabParams,
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
  mapUpdateLawyerAddressToWire,
  mapUpdateLawyerBiographyToWire,
  mapUpdateLawyerBillingToWire,
  mapUpdateLawyerDocumentationToWire,
  mapUpdateLawyerGeneralDataToWire,
  mapUpdateLawyerGraduationToWire,
  mapUpdateLawyerAvailabilityToWire,
  mapUpdateLawyerPracticeAreasToWire,
  mapUpdateLawyerSpecialtiesToWire,
  mapUpdateLawyerServiceAreasToWire,
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
export {
  registerLawyer,
  updateLawyerAddress,
  updateLawyerBiography,
  updateLawyerBilling,
  updateLawyerDocumentation,
  updateLawyerGeneralData,
  updateLawyerGraduation,
  updateLawyerAvailability,
  updateLawyerPracticeAreas,
  updateLawyerSpecialties,
  updateLawyerServiceAreas,
} from './lawyer.api';
export { getPublicLawyerProfile } from './public-profile.api';
export {
  createLawyerReview,
  deleteLawyerReview,
  listLawyerReviews,
} from './reviews.api';
