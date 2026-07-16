import { SymbolView } from 'expo-symbols';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';

import { InputSelectField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, InputCaption } from '@/atomic/typography';
import { PRONOUN_OPTIONS } from '@/constants/select-options';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { pickImageFromGallery } from '@/utils/pick-image-from-gallery';

import { signupClientSharedStyles } from '../shared.styles';
import type { ClientSignupFormValues } from '../types';

export function StepProfile() {
  const { setValue, control } = useFormContext<ClientSignupFormValues>();
  const profileImageUri = useWatch({ control, name: 'profileImageUri' }) ?? '';

  const handlePickProfileImage = async () => {
    const uri = await pickImageFromGallery({
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (uri) {
      setValue('profileImageUri', uri, { shouldDirty: true, shouldTouch: true });
    }
  };

  return (
    <View style={signupClientSharedStyles.fields}>
      <InputSelectField
        name="pronouns"
        label="Pronomes de tratamento"
        placeholder="Selecione o pronome"
        options={PRONOUN_OPTIONS}
      />

      {profileImageUri ? (
        <View style={styles.profileImageFilled}>
          <Image source={{ uri: profileImageUri }} style={styles.profilePreview} resizeMode="cover" />
          <View style={styles.profileActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remover imagem de perfil"
              onPress={() =>
                setValue('profileImageUri', '', { shouldDirty: true, shouldTouch: true })
              }
              style={styles.profileActionButton}>
              <Body1 color={BrandColors.primary.light}>Remover</Body1>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Trocar imagem de perfil"
              onPress={() => {
                void handlePickProfileImage();
              }}
              style={styles.profileActionButton}>
              <Body1 color={BrandColors.primary.light}>Trocar</Body1>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adicionar imagem de perfil"
          style={styles.profileImagePlaceholder}
          onPress={() => {
            void handlePickProfileImage();
          }}>
          <SymbolView
            name={{ ios: 'square.and.arrow.up', android: 'upload', web: 'upload' }}
            size={28}
            tintColor={BrandColors.neutral.xlight}
          />
          <Separator size="xxs" />
          <Body1 color={BrandColors.primary.light}>Adicione uma imagem</Body1>
          <Separator size="xxxs" />
          <InputCaption color={BrandColors.neutral.light}>Formato: .jpeg, .png</InputCaption>
          <InputCaption color={BrandColors.neutral.light}>Tamanho máximo: 25 MB</InputCaption>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profileImagePlaceholder: {
    minHeight: 160,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  profileImageFilled: {
    gap: Spacing.xxs,
    width: '100%',
  },
  profilePreview: {
    width: '100%',
    height: 200,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    backgroundColor: BrandColors.neutral.dark,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  profileActionButton: {
    paddingVertical: Spacing.xxxs,
  },
});
