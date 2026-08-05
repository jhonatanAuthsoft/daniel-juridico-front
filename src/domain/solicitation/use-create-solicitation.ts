import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateSolicitationParams } from '@/data/solicitation';

import {
  createSolicitationUseCase,
  type CreateSolicitationResult,
} from './create-solicitation.use-case';
import { solicitationKeys } from './solicitation.keys';

/**
 * Domain hook: creates a solicitation (API runs matching on create).
 */
export function useCreateSolicitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateSolicitationParams): Promise<CreateSolicitationResult> =>
      createSolicitationUseCase(params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: solicitationKeys.lists() });
    },
  });
}
