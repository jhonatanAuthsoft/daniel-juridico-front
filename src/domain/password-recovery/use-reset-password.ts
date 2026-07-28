import { useMutation } from '@tanstack/react-query';

import type { ResetPasswordParams } from '@/data/password-recovery';

import { resetPasswordUseCase } from './reset-password.use-case';

/**
 * Domain hook: resets the password with a valid recovery code.
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (params: ResetPasswordParams) => resetPasswordUseCase(params),
  });
}
