import { useQuery } from '@tanstack/react-query';

import { requestReadUrl } from '@/data/arquivo';

import { arquivoKeys } from './arquivo.keys';

const READ_URL_SKEW_MS = 60_000;

/**
 * Resolves an S3 object key to a temporary signed read URL
 * via `POST /arquivos/url-leitura`.
 */
export function useObjectReadUrl(key: string | null | undefined) {
  const normalizedKey = key?.trim() || '';

  return useQuery({
    queryKey: arquivoKeys.readUrl(normalizedKey),
    queryFn: ({ signal }) => requestReadUrl({ key: normalizedKey }, signal),
    enabled: normalizedKey.length > 0,
    staleTime: (query) => {
      const expiresInSeconds = query.state.data?.expiresInSeconds;
      if (typeof expiresInSeconds !== 'number' || expiresInSeconds <= 0) {
        return 14 * 60 * 1000;
      }
      return Math.max(expiresInSeconds * 1000 - READ_URL_SKEW_MS, 30_000);
    },
  });
}
