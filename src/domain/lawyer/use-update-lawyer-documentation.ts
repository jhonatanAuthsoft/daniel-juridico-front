import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateLawyerDocumentationParams } from '@/data/lawyer';

import { applyAdvogadoDetalheToMeCache } from './apply-advogado-detalhe-to-me-cache';
import { updateLawyerDocumentationUseCase } from './update-lawyer-documentation.use-case';

/**
 * Domain hook: `PATCH /advogados/me/documentacao`.
 * Writes the server detalhe into `authKeys.me()`.
 */
export function useUpdateLawyerDocumentation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateLawyerDocumentationParams) =>
      updateLawyerDocumentationUseCase(params),
    onSuccess: (detalhe) => {
      applyAdvogadoDetalheToMeCache(queryClient, detalhe);
    },
  });
}
