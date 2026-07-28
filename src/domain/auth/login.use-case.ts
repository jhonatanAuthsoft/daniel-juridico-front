import { login, type LoginParams, type LoginResult as LoginApiResult } from '@/data/auth';

import { mapApiProfileToRole, type AuthUser } from './auth.types';

export type LoginResult = {
  token: string;
  refreshToken: string;
  user: AuthUser;
};

/**
 * Use case: authenticate with e-mail and password.
 */
export async function loginUseCase(
  params: LoginParams,
  signal?: AbortSignal,
): Promise<LoginResult> {
  const result: LoginApiResult = await login(params, signal);

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
