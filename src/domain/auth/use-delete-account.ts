import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteAccountUseCase } from './delete-account.use-case';

/**
 * Domain hook: `DELETE /usuarios/me`.
 * Clears cached queries after the account is removed.
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAccountUseCase(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
