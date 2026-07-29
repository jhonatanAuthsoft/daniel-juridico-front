import { useCallback, useState, type ReactElement } from 'react';
import { Alert } from 'react-native';

import {
  ImageEditModal,
  type ImageEditModalProps,
} from '@/atomic/form/image-edit-modal.component';
import type { ArquivoFinalidade } from '@/data/arquivo';
import { uploadLocalImage } from '@/data/arquivo';
import { getErrorMessage } from '@/data/http';
import {
  pickImageFromGallery,
  type PickImageFromGalleryOptions,
} from '@/utils/pick-image-from-gallery';

export type ConfirmedSignupImage = {
  uri: string;
  key: string;
};

type UseImageEditFlowResult = {
  pickEditedImage: (options?: PickImageFromGalleryOptions) => Promise<void>;
  editModal: ReactElement<ImageEditModalProps>;
  isUploading: boolean;
};

/**
 * Gallery → crop → optional S3 upload → confirm.
 * When `uploadFinalidade` is set, `onConfirm` receives `{ uri, key }`.
 */
export function useImageEditFlow(
  onConfirm: (result: string | ConfirmedSignupImage) => void,
  options?: { uploadFinalidade?: ArquivoFinalidade },
): UseImageEditFlowResult {
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [aspect, setAspect] = useState<[number, number]>([1, 1]);
  const [visible, setVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const pickEditedImage = useCallback(
    async (pickOptions: PickImageFromGalleryOptions = {}) => {
      setAspect(pickOptions.aspect ?? [1, 1]);

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
    if (isUploading) {
      return;
    }
    setVisible(false);
    setPendingUri(null);
  }, [isUploading]);

  const handleConfirm = useCallback(
    async (uri: string) => {
      const finalidade = options?.uploadFinalidade;
      setVisible(false);
      setPendingUri(null);

      if (!finalidade) {
        onConfirm(uri);
        return;
      }

      setIsUploading(true);
      try {
        const key = await uploadLocalImage({ uri, finalidade });
        onConfirm({ uri, key });
      } catch (error) {
        Alert.alert(
          'Upload',
          getErrorMessage(error, 'Não foi possível enviar a imagem.'),
        );
      } finally {
        setIsUploading(false);
      }
    },
    [onConfirm, options?.uploadFinalidade],
  );

  return {
    pickEditedImage,
    isUploading,
    editModal: (
      <ImageEditModal
        visible={visible}
        imageUri={pendingUri}
        aspect={aspect}
        onCancel={handleCancel}
        onConfirm={(uri) => {
          void handleConfirm(uri);
        }}
      />
    ),
  };
}
