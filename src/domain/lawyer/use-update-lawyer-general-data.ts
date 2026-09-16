import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getAuthSessionMemory, updateAuthUser } from '@/data/auth';
import type { UpdateLawyerGeneralDataParams } from '@/data/lawyer';
import { maskPhone, onlyDigits } from '@/utils/br-input';

import { applyAdvogadoDetalheToMeCache } from './apply-advogado-detalhe-to-me-cache';
import { updateLawyerGeneralDataUseCase } from './update-lawyer-general-data.use-case';

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
 * Domain hook: `PATCH /advogados/me/dados-gerais`.
 * Writes the server detalhe into `authKeys.me()` and updates the session name.
 */
export function useUpdateLawyerGeneralData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateLawyerGeneralDataParams) =>
      updateLawyerGeneralDataUseCase(params),
    onSuccess: async (detalhe, params) => {
      applyAdvogadoDetalheToMeCache(queryClient, detalhe, {
        phone: maskPhone(onlyDigits(params.phone)),
      });
      const name = detalhe.perfil?.nomeCompleto?.trim() || '';
      await syncSessionIdentity(name, params.phone);
    },
  });
}
