import type { QueryClient } from '@tanstack/react-query';

import {
  mergeClienteDetalheIntoMe,
  type MeDetalheWire,
  type MeResult,
} from '@/data/auth';
import { authKeys } from '@/domain/auth/auth.keys';

export function applyClienteDetalheToMeCache(
  queryClient: QueryClient,
  detalhe: MeDetalheWire,
) {
  queryClient.setQueryData<MeResult>(authKeys.me(), (current) =>
    mergeClienteDetalheIntoMe(current, detalhe),
  );
}
