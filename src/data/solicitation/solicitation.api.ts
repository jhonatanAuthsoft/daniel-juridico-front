import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  type ApiResponse,
} from '@/data/http';

import {
  mapCreateSolicitationParamsToWire,
  mapCreateSolicitationWireToResult,
  mapDetalheWireToResult,
  mapListagemWireToResult,
  mapMatchWireToResult,
  normalizeListagemPayload,
} from './solicitation.mapper';
import type {
  CreateSolicitationParams,
  CreateSolicitationResult,
  CreateSolicitationWireResponse,
  ListSolicitationsParams,
  ListSolicitationsResult,
  SolicitationDetailResult,
  SolicitationMatchResult,
  SolicitacaoDetalheWire,
  SolicitacaoListagemItemWire,
  SolicitacaoListagemWire,
  SolicitacaoMatchWire,
} from './solicitation.types';

/**
 * Creates a client solicitation and runs matching on the server.
 * `POST /solicitacoes` (authenticated — CLIENTE only).
 */
export async function createSolicitation(
  params: CreateSolicitationParams,
  signal?: AbortSignal,
): Promise<CreateSolicitationResult> {
  const response = await authenticatedHttpRequest<
    ApiResponse<CreateSolicitationWireResponse>
  >(apiUrl('/solicitacoes'), {
    method: 'POST',
    body: mapCreateSolicitationParamsToWire(params),
    signal,
  });

  const data = assertApiSuccess(response, 'Não foi possível criar a solicitação.');
  return mapCreateSolicitationWireToResult(data);
}

/**
 * Lists solicitations for the authenticated client.
 * `GET /solicitacoes?limit&offset&status&busca`
 */
export async function listClientSolicitations(
  params: ListSolicitationsParams = {},
  signal?: AbortSignal,
): Promise<ListSolicitationsResult> {
  const limit = params.limit ?? 10;
  const offset = params.offset ?? 0;
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (params.status) {
    query.set('status', params.status);
  }
  const busca = params.busca?.trim();
  if (busca) {
    query.set('busca', busca);
  }

  const response = await authenticatedHttpRequest<
    ApiResponse<SolicitacaoListagemWire | SolicitacaoListagemItemWire[]>
  >(apiUrl(`/solicitacoes?${query.toString()}`), {
    method: 'GET',
    signal,
  });

  const data = assertApiSuccess(
    response,
    'Não foi possível carregar as solicitações.',
  );

  const listagem = normalizeListagemPayload(data);

  return mapListagemWireToResult(
    listagem,
    response.pagination?.totalElements ?? listagem.items.length,
  );
}

/**
 * Fetches a single solicitation owned by the authenticated client.
 * `GET /solicitacoes/{id}`
 */
export async function getClientSolicitation(
  id: string,
  signal?: AbortSignal,
): Promise<SolicitationDetailResult> {
  const response = await authenticatedHttpRequest<
    ApiResponse<SolicitacaoDetalheWire>
  >(apiUrl(`/solicitacoes/${encodeURIComponent(id)}`), {
    method: 'GET',
    signal,
  });

  const data = assertApiSuccess(
    response,
    'Não foi possível carregar a solicitação.',
  );
  return mapDetalheWireToResult(data);
}

/**
 * Cancels a solicitation owned by the authenticated client.
 * `POST /solicitacoes/{id}/cancelar`
 */
export async function cancelClientSolicitation(
  id: string,
  signal?: AbortSignal,
): Promise<SolicitationDetailResult> {
  const response = await authenticatedHttpRequest<
    ApiResponse<SolicitacaoDetalheWire>
  >(apiUrl(`/solicitacoes/${encodeURIComponent(id)}/cancelar`), {
    method: 'POST',
    signal,
  });

  const data = assertApiSuccess(
    response,
    'Não foi possível cancelar a solicitação.',
  );
  return mapDetalheWireToResult(data);
}

/**
 * Lists persisted matches for a solicitation.
 * `GET /solicitacoes/{id}/matches`
 */
export async function listSolicitationMatches(
  id: string,
  signal?: AbortSignal,
): Promise<SolicitationMatchResult[]> {
  const response = await authenticatedHttpRequest<
    ApiResponse<SolicitacaoMatchWire[]>
  >(apiUrl(`/solicitacoes/${encodeURIComponent(id)}/matches`), {
    method: 'GET',
    signal,
  });

  const data = assertApiSuccess(
    response,
    'Não foi possível carregar os advogados compatíveis.',
  );
  return (data ?? []).map(mapMatchWireToResult);
}
