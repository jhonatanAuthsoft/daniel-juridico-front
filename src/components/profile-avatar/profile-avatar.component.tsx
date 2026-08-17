import { Image, type ImageStyle } from 'expo-image';
import type { StyleProp } from 'react-native';

import { useAuth, useMe } from '@/domain/auth';
import { useObjectReadUrl } from '@/domain/arquivo';

const NO_IMAGE_PLACEHOLDER = require('@/assets/images/no-image-placeholder.png');
const PROFESSIONAL_PLACEHOLDER = require(
  '@/assets/images/professional-image-placeholder.png',
);

type ProfileAvatarProps = {
  style?: StyleProp<ImageStyle>;
  testID?: string;
};

/**
 * Authenticated user's profile photo from S3 (key via `/usuarios/me`,
 * signed URL via `POST /arquivos/url-leitura`). Falls back to placeholder.
 */
export function ProfileAvatar({
  style,
  testID = 'profile-image',
}: ProfileAvatarProps) {
  const { user } = useAuth();
  const { data: me } = useMe();
  const { data: read } = useObjectReadUrl(me?.photoKey);
  const readUrl = read?.readUrl?.trim();
  const placeholder =
    user?.role === 'LAWYER' ? PROFESSIONAL_PLACEHOLDER : NO_IMAGE_PLACEHOLDER;

  return (
    <Image
      testID={testID}
      source={readUrl ? { uri: readUrl } : placeholder}
      contentFit="cover"
      style={style}
    />
  );
}
