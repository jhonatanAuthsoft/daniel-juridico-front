import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateLawyerBillingParams } from '@/data/lawyer';

import { applyAdvogadoDetalheToMeCache } from './apply-advogado-detalhe-to-me-cache';
import { updateLawyerBillingUseCase } from './update-lawyer-billing.use-case';

/**
 * Domain hook: `PATCH /advogados/me/formas-cobranca`.
 * Writes the server detalhe into `authKeys.me()`.
 */
export function useUpdateLawyerBilling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateLawyerBillingParams) =>
      updateLawyerBillingUseCase(params),
    onSuccess: (detalhe) => {
      applyAdvogadoDetalheToMeCache(queryClient, detalhe);
    },
  });
}
