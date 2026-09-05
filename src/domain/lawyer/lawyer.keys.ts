export const REVIEWS_PAGE_SIZE = 10;

export const lawyerKeys = {
  all: ['lawyers'] as const,
  publicProfiles: () => [...lawyerKeys.all, 'public-profile'] as const,
  publicProfile: (id: string) => [...lawyerKeys.publicProfiles(), id] as const,
  reviewsLists: () => [...lawyerKeys.all, 'reviews'] as const,
  reviews: (id: string) => [...lawyerKeys.reviewsLists(), id] as const,
};
