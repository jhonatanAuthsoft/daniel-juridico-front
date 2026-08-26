import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateLawyerGraduationParams } from '@/data/lawyer';

import { applyAdvogadoDetalheToMeCache } from './apply-advogado-detalhe-to-me-cache';
import { updateLawyerGraduationUseCase } from './update-lawyer-graduation.use-case';

/**
 * Domain hook: `PATCH /advogados/me/graduacao`.
 * Writes the server detalhe into `authKeys.me()`.
 */
export function useUpdateLawyerGraduation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateLawyerGraduationParams) =>
      updateLawyerGraduationUseCase(params),
    onSuccess: (detalhe) => {
      applyAdvogadoDetalheToMeCache(queryClient, detalhe);
    },
  });
}
