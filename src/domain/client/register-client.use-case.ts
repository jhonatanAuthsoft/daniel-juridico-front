import type { ClientSignupFormValues } from '@/components/signup-client';
import {
  mapClientSignupFormToRegisterRequest,
  registerClient,
} from '@/data/client';

import { mapApiProfileToRole, type AuthUser } from '@/domain/auth/auth.types';

export type RegisterClientResult = {
  token: string;
  user: AuthUser;
};

/**
 * Use case: register a client from the signup form values.
 */
export async function registerClientUseCase(
  form: ClientSignupFormValues,
  signal?: AbortSignal,
): Promise<RegisterClientResult> {
  const payload = mapClientSignupFormToRegisterRequest(form);
  const result = await registerClient(payload, signal);

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
    user,
  };
}
