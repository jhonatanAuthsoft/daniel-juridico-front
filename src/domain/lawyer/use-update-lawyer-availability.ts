import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MeResult } from '@/data/auth';
import type { UpdateLawyerAvailabilityParams } from '@/data/lawyer';
import { authKeys } from '@/domain/auth/auth.keys';

import { applyAdvogadoDetalheToMeCache } from './apply-advogado-detalhe-to-me-cache';
import { updateLawyerAvailabilityUseCase } from './update-lawyer-availability.use-case';

/**
 * Domain hook: `PATCH /advogados/me/disponibilidade`.
 * Optimistically updates `profileUnavailable`, then writes the server detalhe.
 */
export function useUpdateLawyerAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateLawyerAvailabilityParams) =>
      updateLawyerAvailabilityUseCase(params),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: authKeys.me() });

      const previous = queryClient.getQueryData<MeResult>(authKeys.me());

      queryClient.setQueryData<MeResult>(authKeys.me(), (old) => {
        if (!old) {
          return {
            photoKey: null,
            pushNotificationsEnabled: true,
            profileUnavailable: params.profileUnavailable,
            clientProfile: null,
            lawyerProfile: null,
          };
        }
        return {
          ...old,
          profileUnavailable: params.profileUnavailable,
        };
      });

      return { previous };
    },
    onError: (_error, _params, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(authKeys.me(), context.previous);
      }
    },
    onSuccess: (detalhe) => {
      applyAdvogadoDetalheToMeCache(queryClient, detalhe);
    },
  });
}
