import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export type ImageCropRect = {
  originX: number;
  originY: number;
  width: number;
  height: number;
};

/**
 * Rotates an image clockwise by `degrees` and returns a new local URI.
 * No-op when degrees is a multiple of 360.
 */
export async function rotateImage(uri: string, degrees: number): Promise<string> {
  const normalized = ((degrees % 360) + 360) % 360;
  if (normalized === 0) {
    return uri;
  }

  const result = await manipulateAsync(uri, [{ rotate: normalized }], {
    compress: 0.9,
    format: SaveFormat.JPEG,
  });

  return result.uri;
}

/**
 * Crops an image to the given pixel rect and returns a new local URI.
 */
export async function cropImage(uri: string, crop: ImageCropRect): Promise<string> {
  const result = await manipulateAsync(
    uri,
    [
      {
        crop: {
          originX: Math.max(0, Math.round(crop.originX)),
          originY: Math.max(0, Math.round(crop.originY)),
          width: Math.max(1, Math.round(crop.width)),
          height: Math.max(1, Math.round(crop.height)),
        },
      },
    ],
    {
      compress: 0.9,
      format: SaveFormat.JPEG,
    },
  );

  return result.uri;
}
