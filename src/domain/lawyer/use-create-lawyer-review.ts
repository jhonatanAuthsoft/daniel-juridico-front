import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
  CreateLawyerReviewInput,
  LawyerReviewsResult,
} from '@/data/lawyer';

import { createLawyerReviewUseCase } from './create-lawyer-review.use-case';
import { lawyerKeys } from './lawyer.keys';

export type CreateLawyerReviewParams = CreateLawyerReviewInput & {
  lawyerUserId: string;
};

type ReviewsCacheSnapshot = [
  readonly unknown[],
  LawyerReviewsResult | undefined,
][];

/**
 * Domain hook: create lawyer review with optimistic UI
 * (`POST /advogados/{id}/avaliacoes`).
 */
export function useCreateLawyerReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lawyerUserId, rating, comment }: CreateLawyerReviewParams) =>
      createLawyerReviewUseCase(lawyerUserId, { rating, comment }),
    onMutate: async ({ lawyerUserId, rating, comment }) => {
      const id = lawyerUserId.trim();
      await queryClient.cancelQueries({
        queryKey: [...lawyerKeys.reviewsLists(), id],
      });

      const previous = queryClient.getQueriesData<LawyerReviewsResult>({
        queryKey: [...lawyerKeys.reviewsLists(), id],
      }) as ReviewsCacheSnapshot;

      queryClient.setQueriesData<LawyerReviewsResult>(
        { queryKey: [...lawyerKeys.reviewsLists(), id] },
        (old) => {
          if (!old) {
            return old;
          }
          const optimistic = {
            id: `optimistic-${Date.now()}`,
            rating,
            comment: comment.trim(),
            reviewerName: 'Você',
            createdAt: new Date().toISOString(),
            isOwn: true,
          };
          return {
            ...old,
            canReview: false,
            total: old.total + 1,
            items: [optimistic, ...old.items.filter((review) => !review.isOwn)],
          };
        },
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: async (_data, _error, { lawyerUserId }) => {
      const id = lawyerUserId.trim();
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [...lawyerKeys.reviewsLists(), id],
        }),
        queryClient.invalidateQueries({
          queryKey: lawyerKeys.publicProfile(id),
        }),
      ]);
    },
  });
}
