export const catalogKeys = {
  all: ['catalog'] as const,
  specialties: () => [...catalogKeys.all, 'specialties'] as const,
};
