import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteLawyerReviewUseCase } from './delete-lawyer-review.use-case';
import { lawyerKeys } from './lawyer.keys';

export type DeleteLawyerReviewParams = {
  lawyerUserId: string;
  reviewId: string;
};

/**
 * Domain hook: delete own lawyer review
 * (`DELETE /advogados/{id}/avaliacoes/{avaliacaoId}`).
 */
export function useDeleteLawyerReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lawyerUserId, reviewId }: DeleteLawyerReviewParams) =>
      deleteLawyerReviewUseCase(lawyerUserId, reviewId),
    onSuccess: async (_data, { lawyerUserId }) => {
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
