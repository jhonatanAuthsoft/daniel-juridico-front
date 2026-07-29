import { putBinary } from '@/data/http/put-binary';

import { requestUploadUrl } from './arquivo.api';
import type { ArquivoContentType, ArquivoFinalidade } from './arquivo.types';

function resolveContentType(uri: string, blobType?: string): ArquivoContentType {
  const normalized = (blobType ?? '').toLowerCase();
  if (normalized.includes('png') || uri.toLowerCase().endsWith('.png')) {
    return 'image/png';
  }
  return 'image/jpeg';
}

/**
 * Reads a local image URI, requests a presigned URL, PUTs to S3, returns the object key.
 */
export async function uploadLocalImage(params: {
  uri: string;
  finalidade: ArquivoFinalidade;
  signal?: AbortSignal;
}): Promise<string> {
  const { uri, finalidade, signal } = params;

  const fileResponse = await fetch(uri);
  if (!fileResponse.ok) {
    throw new Error('Não foi possível ler a imagem selecionada.');
  }

  const blob = await fileResponse.blob();
  const contentType = resolveContentType(uri, blob.type);
  const contentLength = blob.size > 0 ? blob.size : undefined;

  const upload = await requestUploadUrl(
    {
      finalidade,
      contentType,
      contentLength,
    },
    signal,
  );

  const headers: Record<string, string> = {
    ...(upload.requiredHeaders ?? {}),
  };
  if (!headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = contentType;
  }

  await putBinary(upload.uploadUrl, blob, headers, signal);
  return upload.key;
}
