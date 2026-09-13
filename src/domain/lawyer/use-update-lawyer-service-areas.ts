import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateLawyerServiceAreasParams } from '@/data/lawyer';

import { applyAdvogadoDetalheToMeCache } from './apply-advogado-detalhe-to-me-cache';
import { updateLawyerServiceAreasUseCase } from './update-lawyer-service-areas.use-case';

/**
 * Domain hook: `PATCH /advogados/me/areas-atuacao`.
 * Writes the server detalhe into `authKeys.me()`.
 */
export function useUpdateLawyerServiceAreas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateLawyerServiceAreasParams) =>
      updateLawyerServiceAreasUseCase(params),
    onSuccess: (detalhe) => {
      applyAdvogadoDetalheToMeCache(queryClient, detalhe);
    },
  });
}
