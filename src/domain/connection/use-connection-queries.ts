import { useQuery } from '@tanstack/react-query';

import type { ListConnectionsParams } from '@/data/connection';

import { connectionKeys } from './connection.keys';
import {
  getLawyerConnectionStatusUseCase,
  listConnectionsUseCase,
  listSolicitationConnectionsUseCase,
} from './connection.use-cases';

/** `GET /conexoes?status=` — inbox. */
export function useConnections(params: ListConnectionsParams = {}) {
  return useQuery({
    queryKey: connectionKeys.list(params.status),
    queryFn: ({ signal }) => listConnectionsUseCase(params, signal),
  });
}

/** `GET /solicitacoes/{id}/conexoes` — CLIENTE. */
export function useSolicitationConnections(solicitacaoId: string | undefined) {
  const id = solicitacaoId?.trim() ?? '';

  return useQuery({
    queryKey: connectionKeys.bySolicitation(id),
    queryFn: ({ signal }) => listSolicitationConnectionsUseCase(id, signal),
    enabled: id.length > 0,
  });
}

/**
 * `GET /advogados/{id}/conexao?solicitacaoId=`
 * Returns null when there is no connection yet (maps to UI `idle`).
 */
export function useLawyerConnectionStatus(
  advogadoId: string | undefined,
  solicitacaoId: string | undefined,
) {
  const lawyerId = advogadoId?.trim() ?? '';
  const solicitationId = solicitacaoId?.trim() ?? '';

  return useQuery({
    queryKey: connectionKeys.byLawyer(lawyerId, solicitationId),
    queryFn: ({ signal }) =>
      getLawyerConnectionStatusUseCase(lawyerId, solicitationId, signal),
    enabled: lawyerId.length > 0 && solicitationId.length > 0,
  });
}
