import type { QueryClient } from '@tanstack/react-query';

import {
  mergeAdvogadoDetalheIntoMe,
  type MeDetalheWire,
  type MeResult,
} from '@/data/auth';
import { authKeys } from '@/domain/auth/auth.keys';

export function applyAdvogadoDetalheToMeCache(
  queryClient: QueryClient,
  detalhe: MeDetalheWire,
  overlay?: { phone?: string },
) {
  queryClient.setQueryData<MeResult>(authKeys.me(), (current) =>
    mergeAdvogadoDetalheIntoMe(current, detalhe, overlay),
  );
}
