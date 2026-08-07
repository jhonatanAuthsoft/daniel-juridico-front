import {
  acceptConnection,
  cancelConnection,
  createConnection,
  getLawyerConnectionStatus,
  listConnections,
  listSolicitationConnections,
  rejectConnection,
  type CreateConnectionParams,
  type ListConnectionsParams,
} from '@/data/connection';

export function createConnectionUseCase(
  params: CreateConnectionParams,
  signal?: AbortSignal,
) {
  return createConnection(params, signal);
}

export function cancelConnectionUseCase(
  conexaoId: string,
  signal?: AbortSignal,
) {
  return cancelConnection(conexaoId, signal);
}

export function acceptConnectionUseCase(
  conexaoId: string,
  signal?: AbortSignal,
) {
  return acceptConnection(conexaoId, signal);
}

export function rejectConnectionUseCase(
  conexaoId: string,
  signal?: AbortSignal,
) {
  return rejectConnection(conexaoId, signal);
}

export function listConnectionsUseCase(
  params?: ListConnectionsParams,
  signal?: AbortSignal,
) {
  return listConnections(params, signal);
}

export function listSolicitationConnectionsUseCase(
  solicitacaoId: string,
  signal?: AbortSignal,
) {
  return listSolicitationConnections(solicitacaoId, signal);
}

export function getLawyerConnectionStatusUseCase(
  advogadoId: string,
  solicitacaoId: string,
  signal?: AbortSignal,
) {
  return getLawyerConnectionStatus(advogadoId, solicitacaoId, signal);
}
