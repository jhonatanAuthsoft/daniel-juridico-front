import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateLawyerBiographyParams } from '@/data/lawyer';

import { applyAdvogadoDetalheToMeCache } from './apply-advogado-detalhe-to-me-cache';
import { updateLawyerBiographyUseCase } from './update-lawyer-biography.use-case';

/**
 * Domain hook: `PATCH /advogados/me/biografia`.
 * Writes the server detalhe into `authKeys.me()`.
 */
export function useUpdateLawyerBiography() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateLawyerBiographyParams) =>
      updateLawyerBiographyUseCase(params),
    onSuccess: (detalhe) => {
      applyAdvogadoDetalheToMeCache(queryClient, detalhe);
    },
  });
}
