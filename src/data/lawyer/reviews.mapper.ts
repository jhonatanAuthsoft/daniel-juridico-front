import type {
  LawyerReview,
  LawyerReviewItemWire,
  LawyerReviewsListWire,
  LawyerReviewsResult,
} from './reviews.types';

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function mapItem(wire: LawyerReviewItemWire): LawyerReview | null {
  const id = asText(wire?.id);
  const rating = asNumber(wire?.nota);
  if (!id || rating == null) {
    return null;
  }

  return {
    id,
    rating,
    comment: asText(wire?.comentario),
    reviewerName: asText(wire?.nomeAvaliador) || 'Cliente',
    createdAt: asText(wire?.criadoEm) || null,
    isOwn: Boolean(wire?.propria),
  };
}

export function mapLawyerReviewsWireToResult(
  wire: LawyerReviewsListWire,
): LawyerReviewsResult {
  const items = Array.isArray(wire?.items)
    ? wire.items.map(mapItem).filter((item): item is LawyerReview => item != null)
    : [];

  const totalRaw = asNumber(wire?.totalAvaliacoes);
  const averageRaw = asNumber(wire?.mediaAvaliacoes);

  return {
    items,
    total: totalRaw != null ? Math.max(0, Math.trunc(totalRaw)) : items.length,
    averageRating: averageRaw ?? 0,
  };
}

/** Maps domain reviews to the client reviews list UI shape. */
export function mapLawyerReviewsToClientReviews(
  reviews: LawyerReview[],
): {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  isOwn?: boolean;
}[] {
  return reviews.map((review) => ({
    id: review.id,
    reviewerName: review.reviewerName,
    rating: review.rating,
    comment: review.comment,
    isOwn: review.isOwn,
  }));
}
