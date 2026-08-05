import { useQuery } from '@tanstack/react-query';

import type { ListSolicitationsParams } from '@/data/solicitation';

import { listClientSolicitationsUseCase } from './list-client-solicitations.use-case';
import { solicitationKeys } from './solicitation.keys';

/**
 * Domain hook: client solicitation list (`GET /solicitacoes`).
 */
export function useClientSolicitations(params: ListSolicitationsParams = {}) {
  return useQuery({
    queryKey: solicitationKeys.list(params),
    queryFn: ({ signal }) => listClientSolicitationsUseCase(params, signal),
  });
}
