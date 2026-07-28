import { useMutation } from '@tanstack/react-query';

import type { LoginParams } from '@/data/auth';
import { useAuth } from '@/domain/auth/auth-provider';

import { loginUseCase, type LoginResult } from './login.use-case';

/**
 * Domain hook: logs in and persists the auth session (access + refresh).
 */
export function useLogin() {
  const { signInWithSession } = useAuth();

  return useMutation({
    mutationFn: async (params: LoginParams): Promise<LoginResult> => {
      const result = await loginUseCase(params);
      await signInWithSession({
        token: result.token,
        refreshToken: result.refreshToken,
        user: result.user,
      });
      return result;
    },
  });
}
