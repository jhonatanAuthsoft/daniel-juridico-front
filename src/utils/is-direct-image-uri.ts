const DIRECT_IMAGE_URI = /^(https?:|file:|content:|ph:|data:|assets-library:)/i;

/** True for URIs RN/Expo can load; false for S3 object keys like `tmp/advogados/oab/...`. */
export function isDirectImageUri(value: string): boolean {
  return DIRECT_IMAGE_URI.test(value.trim());
}
