import { useQuery } from '@tanstack/react-query';

import type { ListLawyerReviewsParams } from '@/data/lawyer';

import { lawyerKeys } from './lawyer.keys';
import { listLawyerReviewsUseCase } from './list-lawyer-reviews.use-case';

/**
 * Domain hook: lawyer reviews for the client (`GET /advogados/{id}/avaliacoes`).
 */
export function useLawyerReviews(
  lawyerUserId: string | undefined,
  params: ListLawyerReviewsParams = {},
) {
  const id = lawyerUserId?.trim() ?? '';
  const limit = params.limit ?? 50;
  const offset = params.offset ?? 0;

  return useQuery({
    queryKey: lawyerKeys.reviews(id, { limit, offset }),
    queryFn: ({ signal }) =>
      listLawyerReviewsUseCase(id, { limit, offset }, signal),
    enabled: id.length > 0,
  });
}
