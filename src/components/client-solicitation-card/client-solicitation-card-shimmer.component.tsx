import { Skeleton } from '@/atomic/skeleton';

/**
 * Shimmer that mirrors {@link ClientSolicitationCard} spacing and block layout.
 */
export function ClientSolicitationCardShimmer() {
  return (
    <Skeleton
      height={230}
      radius="small"
      width="100%"
    />
  );
}

