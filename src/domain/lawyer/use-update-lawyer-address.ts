import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateLawyerAddressParams } from '@/data/lawyer';

import { applyAdvogadoDetalheToMeCache } from './apply-advogado-detalhe-to-me-cache';
import { updateLawyerAddressUseCase } from './update-lawyer-address.use-case';

/**
 * Domain hook: `PATCH /advogados/me/endereco`.
 * Writes the server detalhe into `authKeys.me()`.
 */
export function useUpdateLawyerAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateLawyerAddressParams) =>
      updateLawyerAddressUseCase(params),
    onSuccess: (detalhe) => {
      applyAdvogadoDetalheToMeCache(queryClient, detalhe);
    },
  });
}
