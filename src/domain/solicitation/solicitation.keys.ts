export const solicitationKeys = {
  all: ['solicitations'] as const,
  lists: () => [...solicitationKeys.all, 'list'] as const,
  list: (params?: { limit?: number; offset?: number; status?: string }) =>
    [...solicitationKeys.lists(), params ?? {}] as const,
  details: () => [...solicitationKeys.all, 'detail'] as const,
  detail: (id: string) => [...solicitationKeys.details(), id] as const,
  matches: (id: string) => [...solicitationKeys.all, 'matches', id] as const,
};
