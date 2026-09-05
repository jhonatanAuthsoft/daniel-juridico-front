import type { StatusConexaoApi, UrgenciaConexaoApi } from '@/data/connection';

export const PAGE_SIZE = 10;

export const LAWYER_HISTORY_STATUSES: StatusConexaoApi[] = ['ACEITA', 'RECUSADA'];

export const connectionKeys = {
  all: ['connections'] as const,
  lists: () => [...connectionKeys.all, 'list'] as const,
  list: (status?: StatusConexaoApi | StatusConexaoApi[]) =>
    [...connectionKeys.lists(), status ?? 'ALL'] as const,
  /** Paginated lawyer inbox. Nested under `lists()` so mutations invalidate it. */
  lawyerInbox: (params: {
    status?: StatusConexaoApi | StatusConexaoApi[];
    urgencia?: UrgenciaConexaoApi;
    busca?: string;
  }) => [...connectionKeys.lists(), 'lawyer-inbox', params] as const,
  /** Paginated lawyer history (accepted + rejected). */
  lawyerHistory: (params: {
    status?: StatusConexaoApi | StatusConexaoApi[];
    busca?: string;
  }) => [...connectionKeys.lists(), 'lawyer-history', params] as const,
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
