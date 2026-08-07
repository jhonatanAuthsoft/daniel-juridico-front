export const lawyerKeys = {
  all: ['lawyers'] as const,
  publicProfiles: () => [...lawyerKeys.all, 'public-profile'] as const,
  publicProfile: (id: string) => [...lawyerKeys.publicProfiles(), id] as const,
  reviewsLists: () => [...lawyerKeys.all, 'reviews'] as const,
  reviews: (
    id: string,
    params?: { limit?: number; offset?: number },
  ) => [...lawyerKeys.reviewsLists(), id, params ?? {}] as const,
};
