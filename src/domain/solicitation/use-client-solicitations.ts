import { useInfiniteQuery } from '@tanstack/react-query';

import type { ListSolicitationsParams } from '@/data/solicitation';

import { listClientSolicitationsUseCase } from './list-client-solicitations.use-case';
import { PAGE_SIZE, solicitationKeys } from './solicitation.keys';

export type ClientSolicitationsInfiniteParams = {
  status?: ListSolicitationsParams['status'];
  busca?: string;
};

/**
 * Domain hook: paginated client solicitation list (`GET /solicitacoes`),
 * loading {@link PAGE_SIZE} items per page via explicit "load more".
 */
export function useClientSolicitations(
  params: ClientSolicitationsInfiniteParams = {},
) {
  const status = params.status;
  const busca = params.busca?.trim() || undefined;

  return useInfiniteQuery({
    queryKey: solicitationKeys.list({
      limit: PAGE_SIZE,
      status,
      busca,
    }),
    queryFn: ({ pageParam, signal }) =>
      listClientSolicitationsUseCase(
        {
          limit: PAGE_SIZE,
          offset: pageParam,
          status,
          busca,
        },
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, page) => sum + page.items.length,
        0,
      );
      if (loaded >= lastPage.totalElements) {
        return undefined;
      }
      return loaded;
    },
  });
}
