import { useCallback, useState, type ReactElement } from 'react';

import {
  ImageEditModal,
  type ImageEditModalProps,
} from '@/atomic/form/image-edit-modal.component';
import {
  pickImageFromGallery,
  type PickImageFromGalleryOptions,
} from '@/utils/pick-image-from-gallery';

type UseImageEditFlowResult = {
  /** Opens gallery, then the crop/rotate modal; calls `onConfirm` with the final URI. */
  pickEditedImage: (options?: PickImageFromGalleryOptions) => Promise<void>;
  editModal: ReactElement<ImageEditModalProps>;
};

/**
 * Shared gallery → crop/rotate modal → confirm flow for custom image UIs
 * (e.g. profile avatars) that do not use `ImageField`.
 */
export function useImageEditFlow(
  onConfirm: (uri: string) => void,
): UseImageEditFlowResult {
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [aspect, setAspect] = useState<[number, number]>([1, 1]);
  const [visible, setVisible] = useState(false);

  const pickEditedImage = useCallback(
    async (options: PickImageFromGalleryOptions = {}) => {
      setAspect(options.aspect ?? [1, 1]);

      const uri = await pickImageFromGallery({
        allowsEditing: false,
      });

      if (!uri) {
        return;
      }

      setPendingUri(uri);
      setVisible(true);
    },
    [],
  );

  const handleCancel = useCallback(() => {
    setVisible(false);
    setPendingUri(null);
  }, []);

  const handleConfirm = useCallback(
    (uri: string) => {
      setVisible(false);
      setPendingUri(null);
      onConfirm(uri);
    },
    [onConfirm],
  );

  return {
    pickEditedImage,
    editModal: (
      <ImageEditModal
        visible={visible}
        imageUri={pendingUri}
        aspect={aspect}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    ),
  };
}
