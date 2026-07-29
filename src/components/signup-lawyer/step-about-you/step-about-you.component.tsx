import { SymbolView } from 'expo-symbols';
import { useCallback } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { GlassBackground } from '@/atomic/glass';
import { InputSelectField, InputTextField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, InputCaption } from '@/atomic/typography';
import { FieldValidators } from '@/constants/field-validators';
import { TREATMENT_PRONOUN_OPTIONS } from '@/constants/select-options';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import {
  useImageEditFlow,
  type ConfirmedSignupImage,
} from '@/hooks/use-image-edit-flow';

import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues } from '../types';

const BIOGRAPHY_MAX_LENGTH = 500;

export function StepAboutYou() {
  const { control, setValue } = useFormContext<LawyerSignupFormValues>();
  const biography = useWatch({ control, name: 'biography' }) ?? '';
  const profileImageUri = useWatch({ control, name: 'profileImageUri' }) ?? '';

  const handleConfirmProfileImage = useCallback(
    (result: string | ConfirmedSignupImage) => {
      if (typeof result === 'string') {
        setValue('profileImageUri', result, { shouldDirty: true, shouldTouch: true });
        return;
      }
      setValue('profileImageUri', result.uri, { shouldDirty: true, shouldTouch: true });
      setValue('profileImageKey', result.key, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const { pickEditedImage, editModal, isUploading } = useImageEditFlow(
    handleConfirmProfileImage,
    { uploadFinalidade: 'ADVOGADO_PERFIL' },
  );

  const handlePickProfileImage = () => {
    void pickEditedImage({ aspect: [1, 1] });
  };

  const clearProfileImage = () => {
    setValue('profileImageUri', '', { shouldDirty: true, shouldTouch: true });
    setValue('profileImageKey', '', { shouldDirty: true, shouldTouch: true });
  };

  return (
    <View style={signupLawyerSharedStyles.fields}>
      <InputSelectField
        name="pronouns"
        label="Pronome de tratamento"
        placeholder="Selecione o pronome"
        options={TREATMENT_PRONOUN_OPTIONS}
        required
      />

      <Controller
        control={control}
        name="profileImageKey"
        rules={{
          validate: (value) =>
            String(value ?? '').trim().length > 0
              ? true
              : 'Adicione e envie uma imagem de perfil',
        }}
        render={({ fieldState: { error } }) => (
          <View>
            {profileImageUri ? (
              <View style={styles.profileImageFilled}>
                <Image
                  source={{ uri: profileImageUri }}
                  style={styles.profilePreview}
                  resizeMode="cover"
                />
                <View style={styles.profileActions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Remover imagem de perfil"
                    onPress={clearProfileImage}
                    style={styles.profileActionButton}>
                    <Body1 color={BrandColors.primary.light}>Remover</Body1>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Trocar imagem de perfil"
                    disabled={isUploading}
                    onPress={handlePickProfileImage}
                    style={styles.profileActionButton}>
                    <Body1 color={BrandColors.primary.light}>Trocar</Body1>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Adicionar imagem de perfil"
                disabled={isUploading}
                style={styles.profileImagePlaceholder}
                onPress={handlePickProfileImage}>
                <GlassBackground blurPx={25} />
                <View style={styles.uploadContent}>
                  {isUploading ? (
                    <ActivityIndicator color={BrandColors.primary.light} />
                  ) : (
                    <>
                      <SymbolView
                        name={{
                          ios: 'square.and.arrow.up',
                          android: 'upload',
                          web: 'upload',
                        }}
                        size={28}
                        tintColor={BrandColors.neutral.xlight}
                      />
                      <Separator size="xxs" />
                      <Body1 color={BrandColors.primary.light}>Adicione uma imagem</Body1>
                      <Separator size="xxxs" />
                      <InputCaption color={BrandColors.neutral.light}>
                        Formato: .jpeg, .png
                      </InputCaption>
                      <InputCaption color={BrandColors.neutral.light}>
                        Tamanho máximo: 25 MB
                      </InputCaption>
                    </>
                  )}
                </View>
              </Pressable>
            )}
            {error?.message ? (
              <>
                <Separator size="xxxs" />
                <InputCaption color={BrandColors.feedback.error.light}>
                  {error.message}
                </InputCaption>
              </>
            ) : null}
          </View>
        )}
      />

      <View>
        <InputTextField
          name="biography"
          label="Biografia"
          placeholder="Tenho 10 anos que atuo..."
          multiline
          maxLength={BIOGRAPHY_MAX_LENGTH}
          numberOfLines={5}
          textAlignVertical="top"
          validate={FieldValidators.required()}
        />
        <Separator size="xxxs" />
        <InputCaption color={BrandColors.neutral.light}>
          {biography.length}/{BIOGRAPHY_MAX_LENGTH} caracteres
        </InputCaption>
      </View>

      {editModal}
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
