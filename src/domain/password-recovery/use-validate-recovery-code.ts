import { useMutation } from '@tanstack/react-query';

import type { ValidateRecoveryCodeParams } from '@/data/password-recovery';

import { validateRecoveryCodeUseCase } from './validate-recovery-code.use-case';

/**
 * Domain hook: validates a recovery code without consuming it.
 */
export function useValidateRecoveryCode() {
  return useMutation({
    mutationFn: (params: ValidateRecoveryCodeParams) =>
      validateRecoveryCodeUseCase(params),
  });
}
