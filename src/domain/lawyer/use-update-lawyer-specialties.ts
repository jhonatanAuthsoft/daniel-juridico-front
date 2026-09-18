import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateLawyerSpecialtiesParams } from '@/data/lawyer';

import { applyAdvogadoDetalheToMeCache } from './apply-advogado-detalhe-to-me-cache';
import { updateLawyerSpecialtiesUseCase } from './update-lawyer-specialties.use-case';

/**
 * Domain hook: `PATCH /advogados/me/especialidades`.
 * Writes the server detalhe into `authKeys.me()`.
 */
export function useUpdateLawyerSpecialties() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateLawyerSpecialtiesParams) =>
      updateLawyerSpecialtiesUseCase(params),
    onSuccess: (detalhe) => {
      applyAdvogadoDetalheToMeCache(queryClient, detalhe);
    },
  });
}
