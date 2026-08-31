import { isDirectImageUri } from '@/utils/is-direct-image-uri';

import { useObjectReadUrl } from './use-object-read-url';

export { isDirectImageUri };

export type ResolvedImageUri = {
  uri: string;
  isResolving: boolean;
  isError: boolean;
};

/**
 * Returns a displayable image URI: local/https values pass through;
 * S3 object keys are signed via `POST /arquivos/url-leitura`.
 */
export function useResolvedImageUri(
  keyOrUri: string | null | undefined,
): ResolvedImageUri {
  const trimmed = keyOrUri?.trim() ?? '';
  const isDirect = trimmed.length > 0 && isDirectImageUri(trimmed);
  const objectKey = !isDirect && trimmed.length > 0 ? trimmed : '';
  const { data, isError, isPending } = useObjectReadUrl(objectKey || null);

  if (isDirect) {
    return { uri: trimmed, isResolving: false, isError: false };
  }
  if (!objectKey) {
    return { uri: '', isResolving: false, isError: false };
  }

  const uri = data?.readUrl?.trim() ?? '';
  return {
    uri,
    isResolving: isPending && !uri,
    isError,
  };
}
