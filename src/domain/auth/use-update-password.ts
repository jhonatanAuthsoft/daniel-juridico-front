import { useMutation } from '@tanstack/react-query';

import type { UpdatePasswordParams } from '@/data/user';

import { updatePasswordUseCase } from './update-password.use-case';

/**
 * Domain hook: `PATCH /usuarios/me/senha`.
 */
export function useUpdatePassword() {
  return useMutation({
    mutationFn: (params: UpdatePasswordParams) => updatePasswordUseCase(params),
  });
}
