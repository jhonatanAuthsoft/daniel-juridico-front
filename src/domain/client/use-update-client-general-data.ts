import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getAuthSessionMemory, updateAuthUser } from '@/data/auth';
import type { UpdateClientGeneralDataParams } from '@/data/client';

import { applyClienteDetalheToMeCache } from './apply-cliente-detalhe-to-me-cache';
import { updateClientGeneralDataUseCase } from './update-client-general-data.use-case';

async function syncSessionName(fullName: string) {
  const session = getAuthSessionMemory();
  if (!session?.user || !fullName) {
    return;
  }
  if (session.user.name === fullName) {
    return;
  }
  await updateAuthUser({ ...session.user, name: fullName });
}

/**
 * Domain hook: `PATCH /clientes/me/dados-gerais`.
 * Writes the server detalhe into `authKeys.me()` and updates the session name.
 */
export function useUpdateClientGeneralData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateClientGeneralDataParams) =>
      updateClientGeneralDataUseCase(params),
    onSuccess: async (detalhe) => {
      applyClienteDetalheToMeCache(queryClient, detalhe);
      const name =
        detalhe.perfil?.nomeCompleto?.trim() ||
        detalhe.perfil?.razaoSocial?.trim() ||
        '';
      await syncSessionName(name);
    },
  });
}
