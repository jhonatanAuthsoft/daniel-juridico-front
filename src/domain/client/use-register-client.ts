import { useMutation } from '@tanstack/react-query';

import type { ClientSignupFormValues } from '@/components/signup-client';
import { useAuth } from '@/domain/auth';

import {
  registerClientUseCase,
  type RegisterClientResult,
} from './register-client.use-case';

/**
 * Domain hook: registers a client and persists the auth session.
 */
export function useRegisterClient() {
  const { signInWithSession } = useAuth();

  return useMutation({
    mutationFn: async (form: ClientSignupFormValues): Promise<RegisterClientResult> => {
      const result = await registerClientUseCase(form);
      await signInWithSession({
        token: result.token,
        user: result.user,
      });
      return result;
    },
  });
}
