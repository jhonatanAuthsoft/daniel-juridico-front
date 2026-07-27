import { useMutation } from '@tanstack/react-query';

import type { LawyerSignupFormValues } from '@/components/signup-lawyer/types';
import { useAuth } from '@/domain/auth';

import {
  registerLawyerUseCase,
  type RegisterLawyerResult,
} from './register-lawyer.use-case';

/**
 * Domain hook: registers a lawyer and persists the auth session.
 */
export function useRegisterLawyer() {
  const { signInWithSession } = useAuth();

  return useMutation({
    mutationFn: async (form: LawyerSignupFormValues): Promise<RegisterLawyerResult> => {
      const result = await registerLawyerUseCase(form);
      await signInWithSession({
        token: result.token,
        user: result.user,
      });
      return result;
    },
  });
}
