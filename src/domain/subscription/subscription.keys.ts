export const subscriptionKeys = {
  all: ['subscription'] as const,
  me: () => [...subscriptionKeys.all, 'me'] as const,
};
