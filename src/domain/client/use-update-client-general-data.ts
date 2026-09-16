import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getAuthSessionMemory, updateAuthUser } from '@/data/auth';
import type { UpdateClientGeneralDataParams } from '@/data/client';
import { maskPhone, onlyDigits } from '@/utils/br-input';

import { applyClienteDetalheToMeCache } from './apply-cliente-detalhe-to-me-cache';
import { updateClientGeneralDataUseCase } from './update-client-general-data.use-case';

async function syncSessionIdentity(fullName: string, phone: string) {
  const session = getAuthSessionMemory();
  if (!session?.user) {
    return;
  }

  const nextName = fullName || session.user.name;
  const nextPhone = onlyDigits(phone) || session.user.phone;
  if (session.user.name === nextName && session.user.phone === nextPhone) {
    return;
  }

  await updateAuthUser({ ...session.user, name: nextName, phone: nextPhone });
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
    onSuccess: async (detalhe, params) => {
      applyClienteDetalheToMeCache(queryClient, detalhe, {
        phone: maskPhone(onlyDigits(params.phone)),
      });
      const name =
        detalhe.perfil?.nomeCompleto?.trim() ||
        detalhe.perfil?.razaoSocial?.trim() ||
        '';
      await syncSessionIdentity(name, params.phone);
    },
  });
}
