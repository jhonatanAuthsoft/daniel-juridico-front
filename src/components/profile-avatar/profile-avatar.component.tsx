import { Image, type ImageStyle } from 'expo-image';
import type { StyleProp } from 'react-native';

import { useMe } from '@/domain/auth';
import { useObjectReadUrl } from '@/domain/arquivo';

const PLACEHOLDER = require('@/assets/images/profile.png');

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
  const { data: me } = useMe();
  const { data: read } = useObjectReadUrl(me?.photoKey);
  const readUrl = read?.readUrl?.trim();

  return (
    <Image
      testID={testID}
      source={readUrl ? { uri: readUrl } : PLACEHOLDER}
      contentFit="cover"
      style={style}
    />
  );
}
