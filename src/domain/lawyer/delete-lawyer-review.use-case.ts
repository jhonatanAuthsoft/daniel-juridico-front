import { deleteLawyerReview } from '@/data/lawyer';

/**
 * Domain use case: delete own lawyer review
 * (`DELETE /advogados/{id}/avaliacoes/{avaliacaoId}`).
 */
export function deleteLawyerReviewUseCase(
  lawyerUserId: string,
  reviewId: string,
  signal?: AbortSignal,
) {
  return deleteLawyerReview(lawyerUserId, reviewId, signal);
}
