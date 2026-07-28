import type { LawyerSignupFormValues } from '@/components/signup-lawyer/types';
import {
  mapLawyerSignupFormToRegisterRequest,
  registerLawyer,
} from '@/data/lawyer';

import { mapApiProfileToRole, type AuthUser } from '@/domain/auth/auth.types';

export type RegisterLawyerResult = {
  token: string;
  refreshToken: string;
  user: AuthUser;
};

/**
 * Use case: register a lawyer from the signup form values.
 */
export async function registerLawyerUseCase(
  form: LawyerSignupFormValues,
  signal?: AbortSignal,
): Promise<RegisterLawyerResult> {
  const payload = mapLawyerSignupFormToRegisterRequest(form);
  const result = await registerLawyer(payload, signal);

  const user: AuthUser = {
    id: result.user.id,
    email: result.user.email,
    name: result.user.fullName,
    role: mapApiProfileToRole(result.user.profile),
    phone: result.user.phone,
    termsAccepted: result.user.termsAccepted,
  };

  return {
    token: result.token,
    refreshToken: result.refreshToken,
    user,
  };
}
