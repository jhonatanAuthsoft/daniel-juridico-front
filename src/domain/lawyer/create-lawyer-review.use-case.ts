import { createLawyerReview } from '@/data/lawyer';
import type { CreateLawyerReviewInput } from '@/data/lawyer';

export function createLawyerReviewUseCase(
  lawyerUserId: string,
  input: CreateLawyerReviewInput,
  signal?: AbortSignal,
) {
  return createLawyerReview(lawyerUserId, input, signal);
}
