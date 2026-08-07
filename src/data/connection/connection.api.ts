import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  type ApiResponse,
} from '@/data/http';
import { HttpError } from '@/data/http/http-error';

import { mapConexaoWireToResult } from './connection.mapper';
import type {
  ConexaoWire,
  ConnectionResult,
  CreateConnectionParams,
  ListConnectionsParams,
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

/** `GET /conexoes?status=` — inbox for cliente or advogado. */
export async function listConnections(
  params: ListConnectionsParams = {},
  signal?: AbortSignal,
): Promise<ConnectionResult[]> {
  const query = new URLSearchParams();
  if (params.status) {
    query.set('status', params.status);
  }
  const suffix = query.toString() ? `?${query.toString()}` : '';

  const response = await authenticatedHttpRequest<ApiResponse<ConexaoWire[]>>(
    apiUrl(`/conexoes${suffix}`),
    { method: 'GET', signal },
  );

  const data = assertApiSuccess(response, 'Não foi possível carregar as conexões.');
  return (Array.isArray(data) ? data : []).map(mapConexaoWireToResult);
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
