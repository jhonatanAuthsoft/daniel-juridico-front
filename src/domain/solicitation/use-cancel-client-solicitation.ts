import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelClientSolicitationUseCase } from './cancel-client-solicitation.use-case';
import { solicitationKeys } from './solicitation.keys';

/**
 * Domain hook: cancels a client solicitation (`POST /solicitacoes/{id}/cancelar`).
 */
export function useCancelClientSolicitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelClientSolicitationUseCase(id),
    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: solicitationKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: solicitationKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: solicitationKeys.matches(id) }),
      ]);
    },
  });
}
