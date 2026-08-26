import { useCallback } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp } from 'react-native';
import type { ImageStyle } from 'expo-image';

import { EditAltIcon } from '@/assets/icon/edit-alt';
import { BrandColors } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useAuth, useUpdateProfilePhoto } from '@/domain/auth';
import {
  useImageEditFlow,
  type ConfirmedSignupImage,
} from '@/hooks/use-image-edit-flow';

import { ProfileAvatar } from './profile-avatar.component';

type AccountProfilePhotoProps = {
  avatarStyle?: StyleProp<ImageStyle>;
};

/**
 * Account-screen avatar with edit control: gallery → crop → S3 upload
 * → `PATCH /usuarios/me/foto`. Photo is read via `/usuarios/me` + `url-leitura`.
 */
export function AccountProfilePhoto({ avatarStyle }: AccountProfilePhotoProps) {
  const { user } = useAuth();
  const updatePhoto = useUpdateProfilePhoto();
  const finalidade =
    user?.role === 'LAWYER' ? 'ADVOGADO_PERFIL' : 'CLIENTE_PERFIL';

  const handleConfirm = useCallback(
    (result: string | ConfirmedSignupImage) => {
      if (typeof result === 'string') {
        return;
      }

      updatePhoto.mutate(
        { photoKey: result.key },
        {
          onError: (error) => {
            Alert.alert(
              'Foto de perfil',
              getErrorMessage(error, 'Não foi possível atualizar a foto de perfil.'),
            );
          },
        },
      );
    },
    [updatePhoto],
  );

  const { pickEditedImage, editModal, isUploading } = useImageEditFlow(
    handleConfirm,
    { uploadFinalidade: finalidade },
  );

  const busy = isUploading || updatePhoto.isPending;

  return (
    <View style={styles.avatarWrap}>
      <ProfileAvatar style={[styles.avatar, avatarStyle]} />
      <Pressable
        accessibilityLabel="Editar foto de perfil"
        accessibilityRole="button"
        disabled={busy}
        onPress={() => {
          void pickEditedImage({ aspect: [1, 1] });
        }}
        style={({ pressed }) => [
          styles.editAvatar,
          pressed && styles.pressed,
          busy && styles.editAvatarBusy,
        ]}>
        {busy ? (
          <ActivityIndicator color={BrandColors.neutral.white} size="small" />
        ) : (
          <EditAltIcon
            accessibilityElementsHidden
            importantForAccessibility="no"
            color={BrandColors.neutral.xlight}
            size={16}
          />
        )}
      </Pressable>
      {editModal}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    width: 128,
    height: 128,
    marginBottom: 8,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: BrandColors.neutral.dark,
  },
  editAvatar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.neutral.dark,
  },
  editAvatarBusy: {
    opacity: 0.85,
  },
  pressed: {
    opacity: 0.75,
  },
});
