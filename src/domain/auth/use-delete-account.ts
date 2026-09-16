import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { DeleteAccountParams } from '@/data/user';

import { deleteAccountUseCase } from './delete-account.use-case';

/**
 * Domain hook: `DELETE /usuarios/me`.
 * Clears cached queries after the account is removed.
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteAccountParams) => deleteAccountUseCase(params),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
