import { useInfiniteQuery } from '@tanstack/react-query';

import { lawyerKeys, REVIEWS_PAGE_SIZE } from './lawyer.keys';
import { listLawyerReviewsUseCase } from './list-lawyer-reviews.use-case';

/**
 * Domain hook: paginated lawyer reviews (`GET /advogados/{id}/avaliacoes`),
 * loading {@link REVIEWS_PAGE_SIZE} items per page via explicit "load more".
 */
export function useLawyerReviews(lawyerUserId: string | undefined) {
  const id = lawyerUserId?.trim() ?? '';

  return useInfiniteQuery({
    queryKey: lawyerKeys.reviews(id),
    queryFn: ({ pageParam, signal }) =>
      listLawyerReviewsUseCase(
        id,
        { limit: REVIEWS_PAGE_SIZE, offset: pageParam },
        signal,
      ),
    initialPageParam: 0,
    enabled: id.length > 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.items.length, 0);
      if (loaded >= lastPage.total) {
        return undefined;
      }
      return loaded;
    },
  });
}
