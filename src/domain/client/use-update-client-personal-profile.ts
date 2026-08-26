import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateClientPersonalProfileParams } from '@/data/client';

import { applyClienteDetalheToMeCache } from './apply-cliente-detalhe-to-me-cache';
import { updateClientPersonalProfileUseCase } from './update-client-personal-profile.use-case';

/**
 * Domain hook: `PATCH /clientes/me/perfil-pessoal`.
 * Writes the server detalhe into `authKeys.me()`.
 */
export function useUpdateClientPersonalProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateClientPersonalProfileParams) =>
      updateClientPersonalProfileUseCase(params),
    onSuccess: (detalhe) => {
      applyClienteDetalheToMeCache(queryClient, detalhe);
    },
  });
}
