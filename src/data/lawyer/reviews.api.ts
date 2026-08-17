import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  type ApiResponse,
} from '@/data/http';

import { mapLawyerReviewsWireToResult } from './reviews.mapper';
import type {
  CreateLawyerReviewInput,
  CreateLawyerReviewResult,
  DeleteLawyerReviewResult,
  LawyerReviewItemWire,
  LawyerReviewsListWire,
  LawyerReviewsResult,
  ListLawyerReviewsParams,
} from './reviews.types';

const DEFAULT_LIMIT = 50;

function mapReviewItemWire(wire: LawyerReviewItemWire): CreateLawyerReviewResult {
  const mapped = mapLawyerReviewsWireToResult({
    items: [wire],
    totalAvaliacoes: 1,
    podeAvaliar: false,
  }).items[0];
  if (!mapped) {
    throw new Error('Resposta de avaliação inválida.');
  }
  return mapped;
}

/**
 * Lists reviews for a lawyer (authenticated).
 * `GET /advogados/{id}/avaliacoes?limit&offset`
 */
export async function listLawyerReviews(
  lawyerUserId: string,
  params: ListLawyerReviewsParams = {},
  signal?: AbortSignal,
): Promise<LawyerReviewsResult> {
  const id = lawyerUserId.trim();
  if (!id) {
    throw new Error('Identificador do advogado inválido.');
  }

  const limit = params.limit ?? DEFAULT_LIMIT;
  const offset = params.offset ?? 0;
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  const response = await authenticatedHttpRequest<
    ApiResponse<LawyerReviewsListWire>
  >(apiUrl(`/advogados/${encodeURIComponent(id)}/avaliacoes?${query}`), {
    method: 'GET',
    signal,
  });

  const data = assertApiSuccess(
    response,
    'Não foi possível carregar as avaliações.',
  );
  return mapLawyerReviewsWireToResult(data);
}

/**
 * Creates a review for a lawyer (authenticated client with ACEITA connection).
 * `POST /advogados/{id}/avaliacoes`
 */
export async function createLawyerReview(
  lawyerUserId: string,
  input: CreateLawyerReviewInput,
  signal?: AbortSignal,
): Promise<CreateLawyerReviewResult> {
  const id = lawyerUserId.trim();
  if (!id) {
    throw new Error('Identificador do advogado inválido.');
  }

  const comment = input.comment.trim();
  if (!comment) {
    throw new Error('O comentário é obrigatório.');
  }

  const response = await authenticatedHttpRequest<
    ApiResponse<LawyerReviewItemWire>
  >(apiUrl(`/advogados/${encodeURIComponent(id)}/avaliacoes`), {
    method: 'POST',
    signal,
    body: {
      nota: input.rating,
      comentario: comment,
    },
  });

  const data = assertApiSuccess(
    response,
    'Não foi possível enviar a avaliação.',
  );
  return mapReviewItemWire(data);
}

/**
 * Deletes the authenticated client's own review.
 * `DELETE /advogados/{id}/avaliacoes/{avaliacaoId}`
 */
export async function deleteLawyerReview(
  lawyerUserId: string,
  reviewId: string,
  signal?: AbortSignal,
): Promise<DeleteLawyerReviewResult> {
  const lawyerId = lawyerUserId.trim();
  const avaliacaoId = reviewId.trim();
  if (!lawyerId || !avaliacaoId) {
    throw new Error('Identificador da avaliação inválido.');
  }

  const response = await authenticatedHttpRequest<
    ApiResponse<{ id: string }>
  >(
    apiUrl(
      `/advogados/${encodeURIComponent(lawyerId)}/avaliacoes/${encodeURIComponent(avaliacaoId)}`,
    ),
    {
      method: 'DELETE',
      signal,
    },
  );

  const data = assertApiSuccess(
    response,
    'Não foi possível excluir a avaliação.',
  );
  return { id: typeof data?.id === 'string' ? data.id : avaliacaoId };
}
