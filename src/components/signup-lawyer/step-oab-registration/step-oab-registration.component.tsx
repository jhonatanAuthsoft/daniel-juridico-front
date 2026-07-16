import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useFormContext } from 'react-hook-form';

import { XIcon } from '@/assets/icon/x';
import { Button } from '@/atomic/button';
import { InputSelectField, InputTextField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, InputCaption, InputLabel, Link as TypographLink } from '@/atomic/typography';
import { UF_OPTIONS } from '@/constants/select-options';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { pickImageFromGallery } from '@/utils/pick-image-from-gallery';

import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues } from '../types';

type UploadBoxProps = {
  label: string;
  imageUri: string;
  onPress: () => void;
  onClear: () => void;
};

function UploadBox({ label, imageUri, onPress, onClear }: UploadBoxProps) {
  const filled = Boolean(imageUri);

  if (filled) {
    return (
      <View style={styles.uploadBlock}>
        <InputLabel color={BrandColors.neutral.white}>{label}</InputLabel>
        <Separator size="xxs" />
        <Image source={{ uri: imageUri }} style={styles.previewShell} resizeMode="cover" />
        <Separator size="xxs" />
        <View style={styles.previewActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Remover imagem"
            onPress={onClear}
            style={styles.thumbAction}>
            <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
            <View style={styles.thumbOverlay}>
              <SymbolView
                name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                size={16}
                tintColor={BrandColors.neutral.white}
              />
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Trocar imagem"
            onPress={onPress}
            style={styles.addThumb}>
            <SymbolView
              name={{ ios: 'plus', android: 'add', web: 'add' }}
              size={20}
              tintColor={BrandColors.neutral.light}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.uploadBlock}>
      <InputLabel color={BrandColors.neutral.white}>{label}</InputLabel>
      <Separator size="xxs" />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.uploadPlaceholder}
        onPress={onPress}>
        <SymbolView
          name={{ ios: 'square.and.arrow.up', android: 'upload', web: 'upload' }}
          size={28}
          tintColor={BrandColors.neutral.xlight}
        />
        <Separator size="xxs" />
        <Body1 color={BrandColors.neutral.white}>Anexe as fotos de frente e verso</Body1>
        <Separator size="xxxs" />
        <InputCaption color={BrandColors.neutral.light}>Formato: .jpeg, .png</InputCaption>
      </Pressable>
    </View>
  );
}

export function StepOabRegistration() {
  const { setValue, watch } = useFormContext<LawyerSignupFormValues>();
  const [supplementalOpen, setSupplementalOpen] = useState(false);
  const [supplementalSaved, setSupplementalSaved] = useState(false);

  const oabFrontUri = watch('oabFrontUri');
  const oabBackUri = watch('oabBackUri');
  const supplementalOabFrontUri = watch('supplementalOabFrontUri');
  const supplementalOabBackUri = watch('supplementalOabBackUri');

  const setUri = (name: keyof LawyerSignupFormValues, uri: string) => {
    setValue(name, uri, { shouldDirty: true, shouldTouch: true });
  };

  const pickAndSet = async (name: keyof LawyerSignupFormValues) => {
    const uri = await pickImageFromGallery();
    if (uri) {
      setUri(name, uri);
    }
  };

  return (
    <View style={signupLawyerSharedStyles.fields}>
      <InputTextField
        name="oabNumber"
        label="OAB"
        placeholder="Digite o número da OAB"
        keyboardType="number-pad"
      />
      <InputSelectField
        name="oabUf"
        label="UF"
        placeholder="Selecione o estado"
        options={UF_OPTIONS}
      />

      <UploadBox
        label="Foto da frente da carteira"
        imageUri={oabFrontUri}
        onPress={() => {
          void pickAndSet('oabFrontUri');
        }}
        onClear={() => setUri('oabFrontUri', '')}
      />
      <UploadBox
        label="Foto do verso da carteira"
        imageUri={oabBackUri}
        onPress={() => {
          void pickAndSet('oabBackUri');
        }}
        onClear={() => setUri('oabBackUri', '')}
      />

      {supplementalOpen ? (
        <View style={styles.supplementalCard}>
          <View style={styles.supplementalHeader}>
            <Body1 color={BrandColors.neutral.white}>OAB Suplementar</Body1>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar OAB suplementar"
              hitSlop={Spacing.xxs}
              onPress={() => {
                setSupplementalOpen(false);
                setSupplementalSaved(false);
                setUri('supplementalOabNumber', '');
                setUri('supplementalOabUf', '');
                setUri('supplementalOabFrontUri', '');
                setUri('supplementalOabBackUri', '');
              }}>
              <XIcon color={BrandColors.neutral.white} />
            </Pressable>
          </View>

          <Separator size="sm" />

          <InputTextField
            name="supplementalOabNumber"
            label="Número da OAB"
            placeholder="Digite o número da OAB"
            keyboardType="number-pad"
          />
          <InputSelectField
            name="supplementalOabUf"
            label="UF da OAB Suplementar"
            placeholder="Selecione o estado"
            options={UF_OPTIONS}
          />
          <UploadBox
            label="Foto da frente da carteira"
            imageUri={supplementalOabFrontUri}
            onPress={() => {
              void pickAndSet('supplementalOabFrontUri');
            }}
            onClear={() => setUri('supplementalOabFrontUri', '')}
          />
          <UploadBox
            label="Foto do verso da carteira"
            imageUri={supplementalOabBackUri}
            onPress={() => {
              void pickAndSet('supplementalOabBackUri');
            }}
            onClear={() => setUri('supplementalOabBackUri', '')}
          />

          <Button
            variant="primary"
            onPress={() => {
              setSupplementalSaved(true);
              setSupplementalOpen(false);
            }}>
            Salvar
          </Button>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={() => setSupplementalOpen(true)}
          style={styles.addSupplemental}>
          <TypographLink color={BrandColors.primary.light}>
            {supplementalSaved ? '+ Editar OAB Suplementar' : '+ Adicionar OAB Suplementar'}
          </TypographLink>
        </Pressable>
      )}

      {supplementalSaved && !supplementalOpen ? (
        <Body2 color={BrandColors.neutral.light}>OAB suplementar salva nesta etapa.</Body2>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  uploadBlock: {
    width: '100%',
  },
  uploadPlaceholder: {
    minHeight: 140,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  previewShell: {
    height: 160,
    width: '100%',
    borderRadius: Radius.large,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    backgroundColor: BrandColors.neutral.dark,
  },
  previewActions: {
    flexDirection: 'row',
    gap: Spacing.xxs,
  },
  thumbAction: {
    width: 56,
    height: 56,
    borderRadius: Radius.medium,
    overflow: 'hidden',
    backgroundColor: BrandColors.neutral.dark,
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addThumb: {
    width: 56,
    height: 56,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSupplemental: {
    alignSelf: 'flex-start',
  },
  supplementalCard: {
    width: '100%',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  supplementalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
