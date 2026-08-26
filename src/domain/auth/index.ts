export type { AuthUser, AuthSessionState, UserRole } from './auth.types';
export { homeHrefForRole, mapApiProfileToRole, roleLabel } from './auth.types';
export { AuthProvider, useAuth } from './auth-provider';
export { RoleGuard } from './role-guard';
export { TermsGuard } from './terms-guard';
export { createEmailAvailableValidator } from './create-email-available-validator';
export { authKeys } from './auth.keys';
export { getMeUseCase } from './get-me.use-case';
export { useMe } from './use-me';
export type {
  ClientDocumentType,
  ClientEditProfile,
  LawyerEditOabEntry,
  LawyerEditProfile,
  MeResult,
} from '@/data/auth';
export { useUpdatePreferences } from './use-update-preferences';
export { updatePreferencesUseCase } from './update-preferences.use-case';
export { useUpdateProfilePhoto } from './use-update-profile-photo';
export { updateProfilePhotoUseCase } from './update-profile-photo.use-case';
export { useUpdatePassword } from './use-update-password';
export { updatePasswordUseCase } from './update-password.use-case';
export { useAcceptTerms } from './use-accept-terms';
export { acceptTermsUseCase } from './accept-terms.use-case';
export { useLogin } from './use-login';
export { loginUseCase, type LoginResult } from './login.use-case';
