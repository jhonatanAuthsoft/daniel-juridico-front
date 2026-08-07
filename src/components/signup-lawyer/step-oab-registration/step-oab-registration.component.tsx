import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { XIcon } from '@/assets/icon/x';
import { Button } from '@/atomic/button';
import { InputImageField, InputSelectField, InputTextField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, InputLabel, Link as TypographLink } from '@/atomic/typography';
import { FieldValidators } from '@/constants/field-validators';
import { InputMasks } from '@/constants/input-masks';
import { UF_OPTIONS } from '@/constants/select-options';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues, SupplementalOabEntry } from '../types';

const MAX_SUPPLEMENTAL_OABS = 5;
const OAB_PHOTO_MAX = 2;
/** Proporção aproximada de carteira OAB (paisagem). */
const OAB_PHOTO_ASPECT: [number, number] = [3, 2];

function createEmptySupplementalOab(): SupplementalOabEntry {
  return {
    number: '',
    uf: '',
    issueDate: '',
    photoUris: [],
    photoKeys: [],
  };
}

export function StepOabRegistration() {
  const { control, trigger } = useFormContext<LawyerSignupFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'supplementalOabs',
  });
  const supplementalOabs =
    useWatch({ control, name: 'supplementalOabs' }) ?? [];

  /** Index being edited; `null` means the form is closed. */
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  /** When true, cancel/close removes the draft entry instead of keeping it. */
  const [isCreating, setIsCreating] = useState(false);

  const canAddMore =
    editingIndex === null && fields.length < MAX_SUPPLEMENTAL_OABS;

  const startCreate = () => {
    if (fields.length >= MAX_SUPPLEMENTAL_OABS) {
      return;
    }
    append(createEmptySupplementalOab());
    setIsCreating(true);
    setEditingIndex(fields.length);
  };

  const startEdit = (index: number) => {
    setIsCreating(false);
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    if (editingIndex == null) {
      return;
    }

    if (isCreating) {
      remove(editingIndex);
    }

    setIsCreating(false);
    setEditingIndex(null);
  };

  const saveEdit = async () => {
    if (editingIndex == null) {
      return;
    }

    const valid = await trigger([
      `supplementalOabs.${editingIndex}.number`,
      `supplementalOabs.${editingIndex}.uf`,
      `supplementalOabs.${editingIndex}.issueDate`,
      `supplementalOabs.${editingIndex}.photoUris`,
    ]);
    if (!valid) {
      return;
    }

    setIsCreating(false);
    setEditingIndex(null);
  };

  const deleteAt = (index: number) => {
    remove(index);
    if (editingIndex == null) {
      return;
    }
    if (editingIndex === index) {
      setIsCreating(false);
      setEditingIndex(null);
      return;
    }
    if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  return (
    <View style={signupLawyerSharedStyles.fields}>
      <InputTextField
        name="oabNumber"
        label="OAB"
        placeholder="Digite o número da OAB"
        autoCapitalize="characters"
        format={InputMasks.alphanumericMax(10)}
        validate={FieldValidators.alphanumericMin(3, 'Número da OAB inválido')}
        maxLength={10}
      />
      <InputSelectField
        name="oabUf"
        label="UF"
        placeholder="Selecione o estado"
        options={UF_OPTIONS}
        required
      />
      <InputTextField
        name="oabIssueDate"
        label="Data de expedição"
        placeholder="00/00/0000"
        keyboardType="number-pad"
        format={InputMasks.dateBr}
        validate={FieldValidators.dateBr}
        maxLength={10}
      />

      <InputImageField
        multiple
        name="oabPhotoUris"
        keyName="oabPhotoKeys"
        uploadFinalidade="OAB"
        label="Foto da Carteira"
        emptyTitle="Anexe as fotos de frente e verso"
        emptyCaption="Formato: .jpeg, .png"
        aspect={OAB_PHOTO_ASPECT}
        maxCount={OAB_PHOTO_MAX}
        minCount={2}
        required
      />

      {fields.map((field, index) => {
        if (editingIndex === index) {
          return (
            <View key={field.id} style={styles.editCard}>
              <View style={styles.editHeader}>
                <Body1 color={BrandColors.neutral.white}>OAB Suplementar</Body1>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Fechar OAB suplementar"
                  hitSlop={Spacing.xxs}
                  onPress={cancelEdit}>
                  <XIcon color={BrandColors.neutral.white} />
                </Pressable>
              </View>

              <Separator size="sm" />

              <InputTextField
                name={`supplementalOabs.${index}.number`}
                label="Número da OAB"
                placeholder="Digite o número da OAB"
                autoCapitalize="characters"
                format={InputMasks.alphanumericMax(10)}
                validate={FieldValidators.alphanumericMin(3, 'Número da OAB inválido')}
                maxLength={10}
              />
              <InputSelectField
                name={`supplementalOabs.${index}.uf`}
                label="UF da OAB Suplementar"
                placeholder="Selecione o estado"
                options={UF_OPTIONS}
              />
              <InputTextField
                name={`supplementalOabs.${index}.issueDate`}
                label="Data de expedição"
                placeholder="00/00/0000"
                keyboardType="number-pad"
                format={InputMasks.dateBr}
                maxLength={10}
              />
              <InputImageField
                multiple
                name={`supplementalOabs.${index}.photoUris`}
                keyName={`supplementalOabs.${index}.photoKeys`}
                uploadFinalidade="OAB"
                label="Foto da Carteira"
                emptyTitle="Anexe as fotos de frente e verso"
                emptyCaption="Opcional: envie frente e verso, ou nenhuma"
                aspect={OAB_PHOTO_ASPECT}
                maxCount={OAB_PHOTO_MAX}
                minCount={2}
              />

              <Button variant="primary" onPress={() => void saveEdit()}>
                Salvar
              </Button>
            </View>
          );
        }

        const entry = supplementalOabs[index] ?? field;
        const photoUris = entry.photoUris ?? [];

        return (
          <View key={field.id} style={styles.savedCard}>
            <View style={styles.savedHeader}>
              <Body1 bold color={BrandColors.neutral.white}>
                OAB Suplementar
              </Body1>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Excluir OAB suplementar"
                hitSlop={Spacing.xxs}
                onPress={() => deleteAt(index)}>
                <SymbolView
                  name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                  size={20}
                  tintColor={BrandColors.primary.light}
                />
              </Pressable>
            </View>

            <Separator size="sm" />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Editar OAB suplementar"
              onPress={() => startEdit(index)}>
              <View style={styles.oabMeta}>
                <View style={styles.oabMetaLabelRow}>
                  <SymbolView
                    name={{ ios: 'doc.text', android: 'description', web: 'description' }}
                    size={16}
                    tintColor={BrandColors.neutral.white}
                  />
                  <InputLabel color={BrandColors.neutral.white}>Número da OAB E UF</InputLabel>
                </View>
                <Body1 color={BrandColors.primary.light}>
                  {[entry.number, entry.uf].filter(Boolean).join(' - ') || '—'}
                </Body1>
              </View>

              <Separator size="sm" />

              <InputLabel color={BrandColors.neutral.white}>
                Foto da Carteira (Frente e verso)
              </InputLabel>
              <Separator size="xxs" />
              <View style={styles.photoRow}>
                <WalletPhotoPreview uri={photoUris[0] ?? ''} label="Frente" />
                <WalletPhotoPreview uri={photoUris[1] ?? ''} label="Verso" />
              </View>
            </Pressable>
          </View>
        );
      })}

      {canAddMore ? (
        <Pressable
          accessibilityRole="button"
          onPress={startCreate}
          style={styles.addSupplemental}>
          <TypographLink color={BrandColors.primary.light}>
            + Adicionar OAB Suplementar
          </TypographLink>
        </Pressable>
      ) : null}
    </View>
  );
}

type WalletPhotoPreviewProps = {
  uri: string;
  label: string;
};

function WalletPhotoPreview({ uri, label }: WalletPhotoPreviewProps) {
  return (
    <View accessibilityLabel={`Foto ${label} da carteira`} style={styles.photoPreview}>
      {uri ? (
        <Image source={{ uri }} style={styles.photoImage} resizeMode="contain" />
      ) : (
        <Body2 color={BrandColors.neutral.medium}>Sem foto</Body2>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addSupplemental: {
    alignSelf: 'flex-start',
  },
  editCard: {
    width: '100%',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedCard: {
    width: '100%',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.dark,
    backgroundColor: BrandColors.neutral.xdark,
    padding: Spacing.sm,
  },
  savedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  oabMeta: {
    gap: Spacing.xxxs,
  },
  oabMetaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
  photoRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  photoPreview: {
    flex: 1,
    aspectRatio: 3 / 2,
    borderRadius: Radius.medium,
    backgroundColor: BrandColors.accessory.darkBlue,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
});
