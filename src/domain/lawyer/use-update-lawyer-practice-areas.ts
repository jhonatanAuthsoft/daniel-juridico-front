import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateLawyerPracticeAreasParams } from '@/data/lawyer';

import { applyAdvogadoDetalheToMeCache } from './apply-advogado-detalhe-to-me-cache';
import { updateLawyerPracticeAreasUseCase } from './update-lawyer-practice-areas.use-case';

/**
 * Domain hook: `PATCH /advogados/me/modalidades`.
 * Writes the server detalhe into `authKeys.me()`.
 */
export function useUpdateLawyerPracticeAreas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateLawyerPracticeAreasParams) =>
      updateLawyerPracticeAreasUseCase(params),
    onSuccess: (detalhe) => {
      applyAdvogadoDetalheToMeCache(queryClient, detalhe);
    },
  });
}
