import { putBinary } from '@/data/http/put-binary';

import { requestUploadUrl } from './arquivo.api';
import type { ArquivoContentType, ArquivoFinalidade } from './arquivo.types';

function resolveContentType(uri: string, hint?: string | null): ArquivoContentType {
  const normalized = (hint ?? '').toLowerCase();
  if (normalized.includes('png') || uri.toLowerCase().endsWith('.png')) {
    return 'image/png';
  }
  return 'image/jpeg';
}

/**
 * RN Blobs often lack `arrayBuffer()`. Prefer Response.arrayBuffer, then FileReader.
 */
async function readLocalImageBytes(uri: string): Promise<{
  body: ArrayBuffer;
  contentType: ArquivoContentType;
}> {
  const fileResponse = await fetch(uri);
  if (!fileResponse.ok) {
    throw new Error('Não foi possível ler a imagem selecionada.');
  }

  const headerType = fileResponse.headers.get('content-type');
  const contentType = resolveContentType(uri, headerType);

  if (typeof fileResponse.arrayBuffer === 'function') {
    const body = await fileResponse.arrayBuffer();
    return { body, contentType };
  }

  const blob = await fileResponse.blob();
  const body = await readBlobAsArrayBuffer(blob);
  return {
    body,
    contentType: resolveContentType(uri, blob.type || headerType),
  };
}

function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') {
    return blob.arrayBuffer();
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
        return;
      }
      reject(new Error('Não foi possível ler a imagem selecionada.'));
    };
    reader.onerror = () => {
      reject(new Error('Não foi possível ler a imagem selecionada.'));
    };
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * Reads a local image URI, requests a presigned URL, PUTs to S3, returns the object key.
 *
 * Sends ArrayBuffer with an explicit Content-Type so RN does not inject blob.type
 * (mismatch → S3 SignatureDoesNotMatch / 403).
 */
export async function uploadLocalImage(params: {
  uri: string;
  finalidade: ArquivoFinalidade;
  signal?: AbortSignal;
}): Promise<string> {
  const { uri, finalidade, signal } = params;

  const { body, contentType } = await readLocalImageBytes(uri);
  const contentLength = body.byteLength > 0 ? body.byteLength : undefined;

  const upload = await requestUploadUrl(
    {
      finalidade,
      contentType,
      contentLength,
    },
    signal,
  );

  const signedContentType =
    upload.requiredHeaders?.['Content-Type'] ??
    upload.requiredHeaders?.['content-type'] ??
    contentType;

  await putBinary(
    upload.uploadUrl,
    body,
    {
      'Content-Type': signedContentType,
    },
    signal,
  );

  return upload.key;
}
