/** Wire / domain types for `GET /advogados/{id}/avaliacoes`. */

export type LawyerReviewItemWire = {
  id: string;
  nota: number | string;
  comentario: string;
  nomeAvaliador: string;
  criadoEm?: string | null;
  propria?: boolean;
};

export type LawyerReviewsListWire = {
  items: LawyerReviewItemWire[];
  mediaAvaliacoes?: number | string | null;
  totalAvaliacoes?: number | null;
};

export type ListLawyerReviewsParams = {
  limit?: number;
  offset?: number;
};

export type LawyerReview = {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: string | null;
  isOwn: boolean;
};

export type LawyerReviewsResult = {
  items: LawyerReview[];
  averageRating: number;
  total: number;
};

export type DeleteLawyerReviewResult = {
  id: string;
};
