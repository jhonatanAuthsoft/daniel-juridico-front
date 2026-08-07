import { HttpError } from '@/data/http';

/**
 * PUT binary body to a URL (e.g. S3 presigned). Does not JSON-encode the body.
 * Prefer ArrayBuffer over Blob so RN fetch won't inject blob.type as Content-Type
 * (that breaks S3 SignatureDoesNotMatch / 403).
 */
export async function putBinary(
  url: string,
  body: Blob | ArrayBuffer,
  headers: Record<string, string> = {},
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body,
    signal,
  });

  if (!response.ok) {
    throw new HttpError(
      `Falha ao enviar arquivo (status ${response.status})`,
      response.status,
      undefined,
    );
  }
}
