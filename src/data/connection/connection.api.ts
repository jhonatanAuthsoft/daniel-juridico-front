import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  type ApiResponse,
} from '@/data/http';
import { HttpError } from '@/data/http/http-error';

import {
  mapContagemPorStatus,
  mapContagemPorUrgencia,
  mapConexaoWireToResult,
  normalizeConexaoListagemPayload,
} from './connection.mapper';
import type {
  ConexaoListagemWire,
  ConexaoWire,
  ConnectionResult,
  CreateConnectionParams,
  ListConnectionsParams,
  ListConnectionsResult,
} from './connection.types';

function requireId(value: string, label: string): string {
  const id = value.trim();
  if (!id) {
    throw new Error(`${label} inválido.`);
  }
  return id;
}

/**
 * Requests a connection with a matched lawyer for a solicitation.
 * `POST /conexoes` (CLIENTE). Reativates after CANCELADA; rejects after RECUSADA.
 */
export async function createConnection(
  params: CreateConnectionParams,
  signal?: AbortSignal,
): Promise<ConnectionResult> {
  const solicitacaoId = requireId(params.solicitacaoId, 'Identificador da solicitação');
  const advogadoId = requireId(params.advogadoId, 'Identificador do advogado');

  const response = await authenticatedHttpRequest<ApiResponse<ConexaoWire>>(
    apiUrl('/conexoes'),
    {
      method: 'POST',
      body: { solicitacaoId, advogadoId },
      signal,
    },
  );

  const data = assertApiSuccess(response, 'Não foi possível solicitar a conexão.');
  return mapConexaoWireToResult(data);
}

/** `POST /conexoes/{id}/cancelar` — CLIENTE while PENDENTE. */
export async function cancelConnection(
  conexaoId: string,
  signal?: AbortSignal,
): Promise<ConnectionResult> {
  const id = requireId(conexaoId, 'Identificador da conexão');

  const response = await authenticatedHttpRequest<ApiResponse<ConexaoWire>>(
    apiUrl(`/conexoes/${encodeURIComponent(id)}/cancelar`),
    { method: 'POST', body: {}, signal },
  );

  const data = assertApiSuccess(response, 'Não foi possível cancelar a conexão.');
  return mapConexaoWireToResult(data);
}

/** `POST /conexoes/{id}/aceitar` — ADVOGADO. */
export async function acceptConnection(
  conexaoId: string,
  signal?: AbortSignal,
): Promise<ConnectionResult> {
  const id = requireId(conexaoId, 'Identificador da conexão');

  const response = await authenticatedHttpRequest<ApiResponse<ConexaoWire>>(
    apiUrl(`/conexoes/${encodeURIComponent(id)}/aceitar`),
    { method: 'POST', body: {}, signal },
  );

  const data = assertApiSuccess(response, 'Não foi possível aceitar a conexão.');
  return mapConexaoWireToResult(data);
}

/** `POST /conexoes/{id}/recusar` — ADVOGADO. */
export async function rejectConnection(
  conexaoId: string,
  signal?: AbortSignal,
): Promise<ConnectionResult> {
  const id = requireId(conexaoId, 'Identificador da conexão');

  const response = await authenticatedHttpRequest<ApiResponse<ConexaoWire>>(
    apiUrl(`/conexoes/${encodeURIComponent(id)}/recusar`),
    { method: 'POST', body: {}, signal },
  );

  const data = assertApiSuccess(response, 'Não foi possível recusar a conexão.');
  return mapConexaoWireToResult(data);
}

/**
 * `POST /conexoes/{id}/visualizar` — ADVOGADO.
 * Idempotent: the server keeps the first `visualizadaEm`.
 */
export async function markConnectionViewed(
  conexaoId: string,
  signal?: AbortSignal,
): Promise<ConnectionResult> {
  const id = requireId(conexaoId, 'Identificador da conexão');

  const response = await authenticatedHttpRequest<ApiResponse<ConexaoWire>>(
    apiUrl(`/conexoes/${encodeURIComponent(id)}/visualizar`),
    { method: 'POST', body: {}, signal },
  );

  const data = assertApiSuccess(
    response,
    'Não foi possível marcar a solicitação como visualizada.',
  );
  return mapConexaoWireToResult(data);
}

/**
 * Inbox for cliente or advogado.
 * `GET /conexoes?limit&offset&status&urgencia&busca`
 *
 * Omitting `limit` asks the server for the whole list, unpaged.
 */
export async function listConnections(
  params: ListConnectionsParams = {},
  signal?: AbortSignal,
): Promise<ListConnectionsResult> {
  const query = new URLSearchParams();
  const statuses = Array.isArray(params.status)
    ? params.status
    : params.status
      ? [params.status]
      : [];
  for (const status of statuses) {
    query.append('status', status);
  }
  if (params.limit != null) {
    query.set('limit', String(params.limit));
    query.set('offset', String(params.offset ?? 0));
  }
  if (params.urgencia) {
    query.set('urgencia', params.urgencia);
  }
  const busca = params.busca?.trim();
  if (busca) {
    query.set('busca', busca);
  }
  const suffix = query.toString() ? `?${query.toString()}` : '';

  const response = await authenticatedHttpRequest<
    ApiResponse<ConexaoListagemWire | ConexaoWire[]>
  >(apiUrl(`/conexoes${suffix}`), { method: 'GET', signal });

  const data = assertApiSuccess(response, 'Não foi possível carregar as conexões.');
  const listagem = normalizeConexaoListagemPayload(data);
  const items = listagem.items.map(mapConexaoWireToResult);

  return {
    items,
    totalElements: response.pagination?.totalElements ?? items.length,
    countsByUrgency: mapContagemPorUrgencia(listagem.contagemPorUrgencia),
    countsByStatus: mapContagemPorStatus(listagem.contagemPorStatus),
  };
}

/** `GET /solicitacoes/{id}/conexoes` — CLIENTE. */
export async function listSolicitationConnections(
  solicitacaoId: string,
  signal?: AbortSignal,
): Promise<ConnectionResult[]> {
  const id = requireId(solicitacaoId, 'Identificador da solicitação');

  const response = await authenticatedHttpRequest<ApiResponse<ConexaoWire[]>>(
    apiUrl(`/solicitacoes/${encodeURIComponent(id)}/conexoes`),
    { method: 'GET', signal },
  );

  const data = assertApiSuccess(
    response,
    'Não foi possível carregar as conexões da solicitação.',
  );
  return (Array.isArray(data) ? data : []).map(mapConexaoWireToResult);
}

/**
 * `GET /advogados/{advogadoId}/conexao?solicitacaoId=`
 * Returns null when there is no connection (404).
 */
export async function getLawyerConnectionStatus(
  advogadoId: string,
  solicitacaoId: string,
  signal?: AbortSignal,
): Promise<ConnectionResult | null> {
  const lawyerId = requireId(advogadoId, 'Identificador do advogado');
  const solicitationId = requireId(solicitacaoId, 'Identificador da solicitação');

  try {
    const response = await authenticatedHttpRequest<ApiResponse<ConexaoWire>>(
      apiUrl(
        `/advogados/${encodeURIComponent(lawyerId)}/conexao?solicitacaoId=${encodeURIComponent(solicitationId)}`,
      ),
      { method: 'GET', signal },
    );

    const data = assertApiSuccess(
      response,
      'Não foi possível carregar o status da conexão.',
    );
    return mapConexaoWireToResult(data);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
