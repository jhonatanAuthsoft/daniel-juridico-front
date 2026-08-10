export const PAGE_SIZE = 10;

export const solicitationKeys = {
  all: ['solicitations'] as const,
  lists: () => [...solicitationKeys.all, 'list'] as const,
  list: (params?: {
    limit?: number;
    status?: string;
    busca?: string;
  }) => [...solicitationKeys.lists(), params ?? {}] as const,
  details: () => [...solicitationKeys.all, 'detail'] as const,
  detail: (id: string) => [...solicitationKeys.details(), id] as const,
  matches: (id: string) => [...solicitationKeys.all, 'matches', id] as const,
};
