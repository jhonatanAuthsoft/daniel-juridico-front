import { Image, type ImageStyle } from 'expo-image';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { BrandColors } from '@/constants/theme';
import { useMe } from '@/domain/auth';
import { useObjectReadUrl } from '@/domain/arquivo';

const NO_IMAGE_PLACEHOLDER = require('@/assets/images/no-image-placeholder.png');

type ProfileAvatarProps = {
  style?: StyleProp<ImageStyle>;
  testID?: string;
};

/**
 * Authenticated user's profile photo from S3 (key via `/usuarios/me`,
 * signed URL via `POST /arquivos/url-leitura`). Falls back to no-image placeholder.
 */
export function ProfileAvatar({
  style,
  testID = 'profile-image',
}: ProfileAvatarProps) {
  const { data: me, isLoading: isMeLoading } = useMe();
  const photoKey = me?.photoKey?.trim() || '';
  const { data: read, isLoading: isReadUrlLoading } = useObjectReadUrl(
    photoKey || null,
  );
  const readUrl = read?.readUrl?.trim();
  const isLoadingPhoto =
    isMeLoading || (photoKey.length > 0 && isReadUrlLoading && !readUrl);

  return (
    <View style={[style as StyleProp<ViewStyle>, styles.container]}>
      <Image
        testID={testID}
        source={readUrl ? { uri: readUrl } : NO_IMAGE_PLACEHOLDER}
        contentFit="cover"
        style={StyleSheet.absoluteFill}
      />
      {isLoadingPhoto ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            color={BrandColors.primary.light}
            size="small"
            testID="profile-avatar-loading"
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
});
