import { useMutation } from '@tanstack/react-query';

import type { RequestPasswordRecoveryParams } from '@/data/password-recovery';

import { requestPasswordRecoveryUseCase } from './request-password-recovery.use-case';

/**
 * Domain hook: requests a password recovery code.
 */
export function useRequestPasswordRecovery() {
  return useMutation({
    mutationFn: (params: RequestPasswordRecoveryParams) =>
      requestPasswordRecoveryUseCase(params),
  });
}
