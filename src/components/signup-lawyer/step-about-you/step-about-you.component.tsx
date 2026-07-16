import { SymbolView } from 'expo-symbols';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useFormContext, useWatch } from 'react-hook-form';

import { GlassBackground } from '@/atomic/glass';
import { InputSelectField, InputTextField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, InputCaption } from '@/atomic/typography';
import { PRONOUN_OPTIONS } from '@/constants/select-options';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { pickImageFromGallery } from '@/utils/pick-image-from-gallery';

import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues } from '../types';

const BIOGRAPHY_MAX_LENGTH = 500;

export function StepAboutYou() {
  const { control, setValue } = useFormContext<LawyerSignupFormValues>();
  const biography = useWatch({ control, name: 'biography' }) ?? '';
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
    <View style={signupLawyerSharedStyles.fields}>
      <InputSelectField
        name="pronouns"
        label="Pronome de tratamento"
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
          <GlassBackground blurPx={25} />
          <View style={styles.uploadContent}>
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
          </View>
        </Pressable>
      )}

      <View>
        <InputTextField
          name="biography"
          label="Biografia"
          placeholder="Tenho 10 anos que atuo..."
          multiline
          maxLength={BIOGRAPHY_MAX_LENGTH}
          numberOfLines={5}
          textAlignVertical="top"
        />
        <Separator size="xxxs" />
        <InputCaption color={BrandColors.neutral.light}>
          {biography.length}/{BIOGRAPHY_MAX_LENGTH} caracteres
        </InputCaption>
      </View>
    </View>
  );
}

const glassShadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  android: {
    elevation: 4,
  },
  default: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
});

const styles = StyleSheet.create({
  profileImagePlaceholder: {
    minHeight: 160,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    overflow: 'hidden',
    ...glassShadow,
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
  uploadContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
});
