import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getAuthSessionMemory, updateAuthUser } from '@/data/auth';
import type { UpdateLawyerGeneralDataParams } from '@/data/lawyer';

import { applyAdvogadoDetalheToMeCache } from './apply-advogado-detalhe-to-me-cache';
import { updateLawyerGeneralDataUseCase } from './update-lawyer-general-data.use-case';

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
 * Domain hook: `PATCH /advogados/me/dados-gerais`.
 * Writes the server detalhe into `authKeys.me()` and updates the session name.
 */
export function useUpdateLawyerGeneralData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateLawyerGeneralDataParams) =>
      updateLawyerGeneralDataUseCase(params),
    onSuccess: async (detalhe) => {
      applyAdvogadoDetalheToMeCache(queryClient, detalhe);
      const name = detalhe.perfil?.nomeCompleto?.trim() || '';
      await syncSessionName(name);
    },
  });
}
