import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

const MAX_IMAGE_BYTES = 25 * 1024 * 1024;

export type PickImageFromGalleryOptions = {
  /** When true, opens crop UI (useful for profile photos). */
  allowsEditing?: boolean;
  aspect?: [number, number];
};

function isAllowedImageType(mimeType: string | undefined, uri: string) {
  if (mimeType) {
    const normalized = mimeType.toLowerCase();
    return (
      normalized.includes('jpeg') ||
      normalized.includes('jpg') ||
      normalized.includes('png')
    );
  }

  const lowerUri = uri.toLowerCase();
  return (
    lowerUri.endsWith('.jpg') ||
    lowerUri.endsWith('.jpeg') ||
    lowerUri.endsWith('.png') ||
    lowerUri.startsWith('ph://') ||
    lowerUri.startsWith('content://') ||
    lowerUri.startsWith('file://')
  );
}

async function ensureMediaLibraryPermission(): Promise<boolean> {
  const current = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (current.granted) {
    return true;
  }

  const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (requested.granted) {
    return true;
  }

  Alert.alert(
    'Permissão necessária',
    'Precisamos de acesso à galeria para anexar imagens. Você pode liberar nas configurações do aparelho.',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Abrir configurações',
        onPress: () => {
          void Linking.openSettings();
        },
      },
    ],
  );

  return false;
}

/**
 * Opens the device photo gallery and returns the selected local URI,
 * or `null` if the user cancels / permission is denied / validation fails.
 */
export async function pickImageFromGallery(
  options: PickImageFromGalleryOptions = {},
): Promise<string | null> {
  const granted = await ensureMediaLibraryPermission();
  if (!granted) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: options.allowsEditing ?? false,
    aspect: options.aspect,
    quality: 0.85,
    exif: false,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  const asset = result.assets[0];

  if (asset.fileSize != null && asset.fileSize > MAX_IMAGE_BYTES) {
    Alert.alert('Arquivo muito grande', 'O tamanho máximo permitido é 25 MB.');
    return null;
  }

  if (!isAllowedImageType(asset.mimeType, asset.uri)) {
    Alert.alert('Formato inválido', 'Use imagens nos formatos .jpeg ou .png.');
    return null;
  }

  return asset.uri;
}
