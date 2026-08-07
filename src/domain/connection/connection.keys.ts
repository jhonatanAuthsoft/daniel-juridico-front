import type { StatusConexaoApi } from '@/data/connection';

export const connectionKeys = {
  all: ['connections'] as const,
  lists: () => [...connectionKeys.all, 'list'] as const,
  list: (status?: StatusConexaoApi) =>
    [...connectionKeys.lists(), status ?? 'ALL'] as const,
  bySolicitation: (solicitacaoId: string) =>
    [...connectionKeys.all, 'solicitation', solicitacaoId] as const,
  byLawyer: (advogadoId: string, solicitacaoId: string) =>
    [
      ...connectionKeys.all,
      'lawyer',
      advogadoId,
      solicitacaoId,
    ] as const,
};
