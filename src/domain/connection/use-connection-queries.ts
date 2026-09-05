import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import type {
  ListConnectionsParams,
  ListConnectionsResult,
  StatusConexaoApi,
  UrgenciaConexaoApi,
} from '@/data/connection';

import { PAGE_SIZE, connectionKeys } from './connection.keys';
import {
  getLawyerConnectionStatusUseCase,
  listConnectionsUseCase,
  listSolicitationConnectionsUseCase,
} from './connection.use-cases';

/**
 * `GET /conexoes?status=` — whole list unpaged.
 * Used by screens that need the full set (details lookup).
 */
export function useConnections(params: ListConnectionsParams = {}) {
  return useQuery({
    queryKey: connectionKeys.list(params.status),
    queryFn: ({ signal }) => listConnectionsUseCase(params, signal),
    select: (result: ListConnectionsResult) => result.items,
  });
}

export type LawyerInboxParams = {
  status?: StatusConexaoApi | StatusConexaoApi[];
  urgencia?: UrgenciaConexaoApi;
  busca?: string;
};

export type LawyerHistoryParams = {
  status?: StatusConexaoApi | StatusConexaoApi[];
  busca?: string;
};

function usePaginatedConnections(
  queryKey: readonly unknown[],
  params: LawyerInboxParams,
) {
  const status = params.status;
  const urgencia = params.urgencia;
  const busca = params.busca?.trim() || undefined;

  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam, signal }) =>
      listConnectionsUseCase(
        {
          limit: PAGE_SIZE,
          offset: pageParam,
          status,
          urgencia,
          busca,
        },
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.items.length, 0);
      if (loaded >= lastPage.totalElements) {
        return undefined;
      }
      return loaded;
    },
  });
}

/**
 * Paginated lawyer inbox (`GET /conexoes`), {@link PAGE_SIZE} per page via
 * explicit "load more". Ordering (emergencies first), urgency filter and
 * search all run on the server.
 */
export function useLawyerInboxConnections(params: LawyerInboxParams = {}) {
  const status = params.status;
  const urgencia = params.urgencia;
  const busca = params.busca?.trim() || undefined;

  return usePaginatedConnections(
    connectionKeys.lawyerInbox({ status, urgencia, busca }),
    { status, urgencia, busca },
  );
}

/**
 * Paginated lawyer history (`GET /conexoes`), {@link PAGE_SIZE} per page.
 * Status filter (accepted/rejected) and search run on the server.
 */
export function useLawyerHistoryConnections(params: LawyerHistoryParams = {}) {
  const status = params.status;
  const busca = params.busca?.trim() || undefined;

  return usePaginatedConnections(
    connectionKeys.lawyerHistory({ status, busca }),
    { status, busca },
  );
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
