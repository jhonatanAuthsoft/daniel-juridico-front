import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { UpdateClientAddressParams } from '@/data/client';

import { applyClienteDetalheToMeCache } from './apply-cliente-detalhe-to-me-cache';
import { updateClientAddressUseCase } from './update-client-address.use-case';

/**
 * Domain hook: `PATCH /clientes/me/endereco`.
 * Writes the server detalhe into `authKeys.me()`.
 */
export function useUpdateClientAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateClientAddressParams) =>
      updateClientAddressUseCase(params),
    onSuccess: (detalhe) => {
      applyClienteDetalheToMeCache(queryClient, detalhe);
    },
  });
}
