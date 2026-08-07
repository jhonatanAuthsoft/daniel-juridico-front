import { listLawyerReviews } from '@/data/lawyer';
import type { ListLawyerReviewsParams } from '@/data/lawyer';

/**
 * Domain use case: lawyer reviews list (`GET /advogados/{id}/avaliacoes`).
 */
export function listLawyerReviewsUseCase(
  lawyerUserId: string,
  params?: ListLawyerReviewsParams,
  signal?: AbortSignal,
) {
  return listLawyerReviews(lawyerUserId, params, signal);
}
