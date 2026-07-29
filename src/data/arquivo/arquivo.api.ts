import {
  apiUrl,
  assertApiSuccess,
  httpRequest,
  type ApiResponse,
} from '@/data/http';

import type {
  ArquivoUrlLeituraRequest,
  ArquivoUrlLeituraResult,
  ArquivoUrlUploadRequest,
  ArquivoUrlUploadResult,
} from './arquivo.types';

/**
 * Requests a presigned PUT URL for a signup image.
 * `POST /arquivos/url-upload` (public).
 */
export async function requestUploadUrl(
  body: ArquivoUrlUploadRequest,
  signal?: AbortSignal,
): Promise<ArquivoUrlUploadResult> {
  const response = await httpRequest<ApiResponse<ArquivoUrlUploadResult>>(
    apiUrl('/arquivos/url-upload'),
    {
      method: 'POST',
      body,
      signal,
    },
  );

  return assertApiSuccess(response, 'Não foi possível preparar o upload da imagem.');
}

/**
 * Requests a presigned GET URL for a stored object key.
 * `POST /arquivos/url-leitura` (public).
 */
export async function requestReadUrl(
  body: ArquivoUrlLeituraRequest,
  signal?: AbortSignal,
): Promise<ArquivoUrlLeituraResult> {
  const response = await httpRequest<ApiResponse<ArquivoUrlLeituraResult>>(
    apiUrl('/arquivos/url-leitura'),
    {
      method: 'POST',
      body,
      signal,
    },
  );

  return assertApiSuccess(response, 'Não foi possível gerar a URL de leitura.');
}
